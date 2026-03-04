//! Asset loading and management system

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::future::Future;
use std::pin::Pin;

/// Asset type enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum AssetType {
    Texture,
    Mesh,
    Shader,
    Material,
    Audio,
    Font,
    Animation,
    Prefab,
    Scene,
    Data,
}

/// Asset loading state
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LoadState {
    Unloaded,
    Loading,
    Loaded,
    Failed,
}

/// Asset reference handle
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct AssetHandle {
    pub id: u64,
    pub asset_type: AssetType,
}

impl AssetHandle {
    pub fn new(id: u64, asset_type: AssetType) -> Self {
        Self { id, asset_type }
    }
}

/// Generic asset container
#[derive(Debug, Clone)]
pub struct Asset<T: Clone> {
    pub handle: AssetHandle,
    pub data: Option<T>,
    pub state: LoadState,
    pub dependencies: Vec<AssetHandle>,
    pub size_bytes: usize,
    pub ref_count: usize,
    pub last_used: std::time::Instant,
    pub name: String,
    pub path: String,
}

impl<T: Clone> Asset<T> {
    pub fn new(handle: AssetHandle, name: impl Into<String>, path: impl Into<String>) -> Self {
        Self {
            handle,
            data: None,
            state: LoadState::Unloaded,
            dependencies: Vec::new(),
            size_bytes: 0,
            ref_count: 0,
            last_used: std::time::Instant::now(),
            name: name.into(),
            path: path.into(),
        }
    }

    pub fn is_loaded(&self) -> bool {
        self.state == LoadState::Loaded && self.data.is_some()
    }

    pub fn get(&self) -> Option<&T> {
        self.data.as_ref()
    }

    pub fn retain(&mut self) {
        self.ref_count += 1;
        self.last_used = std::time::Instant::now();
    }

    pub fn release(&mut self) -> bool {
        if self.ref_count > 0 {
            self.ref_count -= 1;
        }
        self.ref_count == 0
    }
}

/// Loading priority
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum LoadPriority {
    Critical = 0,
    High = 1,
    Normal = 2,
    Low = 3,
    Background = 4,
}

/// Asset loading request
#[derive(Debug, Clone)]
pub struct LoadRequest {
    pub path: String,
    pub asset_type: AssetType,
    pub priority: LoadPriority,
    pub dependencies: Vec<String>,
    pub on_complete: Option<Box<dyn Fn(AssetHandle) + Send>>,
    pub on_progress: Option<Box<dyn Fn(f32) + Send>>,
    pub on_error: Option<Box<dyn Fn(String) + Send>>,
}

impl LoadRequest {
    pub fn new(path: impl Into<String>, asset_type: AssetType) -> Self {
        Self {
            path: path.into(),
            asset_type,
            priority: LoadPriority::Normal,
            dependencies: Vec::new(),
            on_complete: None,
            on_progress: None,
            on_error: None,
        }
    }

    pub fn with_priority(mut self, priority: LoadPriority) -> Self {
        self.priority = priority;
        self
    }

    pub fn with_dependencies(mut self, deps: Vec<String>) -> Self {
        self.dependencies = deps;
        self
    }

    pub fn on_complete<F: Fn(AssetHandle) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_complete = Some(Box::new(callback));
        self
    }

    pub fn on_progress<F: Fn(f32) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_progress = Some(Box::new(callback));
        self
    }

    pub fn on_error<F: Fn(String) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_error = Some(Box::new(callback));
        self
    }
}

/// Async asset loader trait
pub trait AsyncAssetLoader: Send + Sync {
    type Output: Clone + Send;

    fn load(&self, path: &str) -> Pin<Box<dyn Future<Output = Result<Self::Output, String>> + Send>>;
    fn can_load(&self, path: &str) -> bool;
}

/// Asset bundle for grouping related assets
#[derive(Debug, Clone)]
pub struct AssetBundle {
    pub name: String,
    pub assets: Vec<AssetHandle>,
    pub total_size: usize,
    pub loaded_size: usize,
}

impl AssetBundle {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            assets: Vec::new(),
            total_size: 0,
            loaded_size: 0,
        }
    }

    pub fn add_asset(&mut self, handle: AssetHandle, size: usize) {
        self.assets.push(handle);
        self.total_size += size;
    }

    pub fn mark_loaded(&mut self, handle: AssetHandle, size: usize) {
        if self.assets.contains(&handle) {
            self.loaded_size += size;
        }
    }

    pub fn get_load_progress(&self) -> f32 {
        if self.total_size == 0 {
            1.0
        } else {
            self.loaded_size as f32 / self.total_size as f32
        }
    }

    pub fn is_fully_loaded(&self) -> bool {
        self.loaded_size >= self.total_size
    }
}

/// Asset cache with LRU eviction
pub struct AssetCache<T: Clone> {
    assets: HashMap<u64, Asset<T>>,
    max_memory_bytes: usize,
    current_memory_bytes: usize,
    next_id: u64,
}

impl<T: Clone> AssetCache<T> {
    pub fn new(max_memory_mb: usize) -> Self {
        Self {
            assets: HashMap::new(),
            max_memory_bytes: max_memory_mb * 1024 * 1024,
            current_memory_bytes: 0,
            next_id: 1,
        }
    }

    pub fn create_handle(&mut self, asset_type: AssetType) -> AssetHandle {
        let id = self.next_id;
        self.next_id += 1;
        AssetHandle::new(id, asset_type)
    }

    pub fn insert(&mut self, handle: AssetHandle, asset: Asset<T>) {
        self.current_memory_bytes += asset.size_bytes;
        self.assets.insert(handle.id, asset);
        self.evict_if_needed();
    }

    pub fn get(&mut self, handle: &AssetHandle) -> Option<&Asset<T>> {
        if let Some(asset) = self.assets.get_mut(&handle.id) {
            asset.retain();
            Some(asset)
        } else {
            None
        }
    }

    pub fn get_mut(&mut self, handle: &AssetHandle) -> Option<&mut Asset<T>> {
        if let Some(asset) = self.assets.get_mut(&handle.id) {
            asset.retain();
            Some(asset)
        } else {
            None
        }
    }

    pub fn remove(&mut self, handle: &AssetHandle) -> Option<Asset<T>> {
        if let Some(asset) = self.assets.remove(&handle.id) {
            self.current_memory_bytes = self.current_memory_bytes.saturating_sub(asset.size_bytes);
            Some(asset)
        } else {
            None
        }
    }

    pub fn evict_if_needed(&mut self) {
        while self.current_memory_bytes > self.max_memory_bytes && self.assets.len() > 1 {
            let least_recently_used = self.assets
                .iter()
                .filter(|(_, asset)| asset.ref_count == 0)
                .min_by_key(|(_, asset)| asset.last_used)
                .map(|(id, _)| *id);

            if let Some(id) = least_recently_used {
                if let Some(asset) = self.assets.remove(&id) {
                    self.current_memory_bytes = self.current_memory_bytes.saturating_sub(asset.size_bytes);
                }
            } else {
                break;
            }
        }
    }

    pub fn clear(&mut self) {
        self.assets.clear();
        self.current_memory_bytes = 0;
    }

    pub fn get_memory_usage_mb(&self) -> f32 {
        self.current_memory_bytes as f32 / (1024.0 * 1024.0)
    }

    pub fn get_asset_count(&self) -> usize {
        self.assets.len()
    }
}

/// Asset manager for loading and managing all asset types
#[derive(Debug)]
pub struct AssetManager {
    next_handle_id: u64,
    load_queue: Vec<LoadRequest>,
    active_loads: Vec<AssetHandle>,
    bundles: HashMap<String, AssetBundle>,
    max_concurrent_loads: usize,
}

impl Default for AssetManager {
    fn default() -> Self {
        Self {
            next_handle_id: 1,
            load_queue: Vec::new(),
            active_loads: Vec::new(),
            bundles: HashMap::new(),
            max_concurrent_loads: 4,
        }
    }
}

impl AssetManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_max_concurrent(mut self, max: usize) -> Self {
        self.max_concurrent_loads = max;
        self
    }

    pub fn generate_handle(&mut self, asset_type: AssetType) -> AssetHandle {
        let id = self.next_handle_id;
        self.next_handle_id += 1;
        AssetHandle::new(id, asset_type)
    }

    pub fn queue_load(&mut self, request: LoadRequest) -> AssetHandle {
        let handle = self.generate_handle(request.asset_type);

        self.load_queue.push(request);
        self.load_queue.sort_by_key(|r| r.priority);

        handle
    }

    pub fn queue_bundle_load(&mut self, bundle_name: impl Into<String>, requests: Vec<LoadRequest>) -> Vec<AssetHandle> {
        let bundle_name = bundle_name.into();
        let mut bundle = AssetBundle::new(&bundle_name);
        let mut handles = Vec::new();

        for request in requests {
            let handle = self.generate_handle(request.asset_type);
            bundle.add_asset(handle, 0);
            handles.push(handle);
            self.queue_load(request);
        }

        self.bundles.insert(bundle_name, bundle);
        handles
    }

    pub fn get_bundle_progress(&self, bundle_name: &str) -> f32 {
        self.bundles.get(bundle_name).map_or(0.0, |b| b.get_load_progress())
    }

    pub fn update(&mut self) {
        while self.active_loads.len() < self.max_concurrent_loads && !self.load_queue.is_empty() {
            if let Some(request) = self.load_queue.pop() {
                let handle = self.generate_handle(request.asset_type);
                self.active_loads.push(handle);
            }
        }
    }

    pub fn cancel_load(&mut self, handle: &AssetHandle) {
        self.load_queue.retain(|r| {
            false
        });
        self.active_loads.retain(|h| h != handle);
    }

    pub fn clear_queue(&mut self) {
        self.load_queue.clear();
    }

    pub fn get_queue_length(&self) -> usize {
        self.load_queue.len()
    }

    pub fn get_active_load_count(&self) -> usize {
        self.active_loads.len()
    }

    pub fn create_bundle(&mut self, name: impl Into<String>) {
        self.bundles.insert(name.into(), AssetBundle::new(name.into()));
    }

    pub fn get_bundle(&self, name: &str) -> Option<&AssetBundle> {
        self.bundles.get(name)
    }
}

/// Texture asset type
#[derive(Debug, Clone)]
pub struct TextureAsset {
    pub width: u32,
    pub height: u32,
    pub format: TextureFormat,
    pub data: Vec<u8>,
    pub mipmaps: Vec<Vec<u8>>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TextureFormat {
    R8,
    Rg8,
    Rgb8,
    Rgba8,
    R16,
    Rg16,
    Rgba16,
    Rgba32f,
    Bc1,
    Bc3,
    Bc5,
    Bc7,
}

/// Mesh asset type
#[derive(Debug, Clone)]
pub struct MeshAsset {
    pub vertices: Vec<f32>,
    pub indices: Vec<u32>,
    pub vertex_layout: VertexLayout,
    pub bounds: BoundingBox,
    pub submeshes: Vec<SubmeshRange>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct VertexLayout {
    pub has_position: bool,
    pub has_normal: bool,
    pub has_uv: bool,
    pub has_color: bool,
    pub has_tangent: bool,
    pub has_bones: bool,
}

#[derive(Debug, Clone, Copy)]
pub struct BoundingBox {
    pub min: [f32; 3],
    pub max: [f32; 3],
}

#[derive(Debug, Clone, Copy)]
pub struct SubmeshRange {
    pub start_index: u32,
    pub index_count: u32,
    pub material_index: u32,
}

/// Shader asset type
#[derive(Debug, Clone)]
pub struct ShaderAsset {
    pub vertex_shader: String,
    pub fragment_shader: String,
    pub compute_shader: Option<String>,
    pub uniforms: Vec<ShaderUniform>,
}

#[derive(Debug, Clone)]
pub struct ShaderUniform {
    pub name: String,
    pub uniform_type: UniformType,
    pub location: u32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum UniformType {
    Float,
    Vec2,
    Vec3,
    Vec4,
    Mat3,
    Mat4,
    Int,
    Bool,
    Sampler2D,
    SamplerCube,
}

/// Audio asset type
#[derive(Debug, Clone)]
pub struct AudioAsset {
    pub sample_rate: u32,
    pub channels: u16,
    pub duration: f32,
    pub samples: Vec<f32>,
    pub format: AudioFormat,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AudioFormat {
    Mono,
    Stereo,
    Surround5_1,
    Surround7_1,
}

/// Font asset type
#[derive(Debug, Clone)]
pub struct FontAsset {
    pub name: String,
    pub size: f32,
    pub glyphs: HashMap<char, GlyphInfo>,
    pub atlas_data: Vec<u8>,
    pub atlas_width: u32,
    pub atlas_height: u32,
    pub line_height: f32,
    pub baseline: f32,
}

#[derive(Debug, Clone, Copy)]
pub struct GlyphInfo {
    pub uv_min: [f32; 2],
    pub uv_max: [f32; 2],
    pub size: [f32; 2],
    pub bearing: [f32; 2],
    pub advance: f32,
}

/// Prefab asset type
#[derive(Debug, Clone)]
pub struct PrefabAsset {
    pub root_entity: EntityData,
    pub entities: Vec<EntityData>,
}

#[derive(Debug, Clone)]
pub struct EntityData {
    pub name: String,
    pub position: [f32; 3],
    pub rotation: [f32; 4],
    pub scale: [f32; 3],
    pub components: Vec<ComponentData>,
    pub children: Vec<usize>,
}

#[derive(Debug, Clone)]
pub struct ComponentData {
    pub component_type: String,
    pub properties: HashMap<String, serde_json::Value>,
}
