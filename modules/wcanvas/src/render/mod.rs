/// High-performance rendering system with batching, culling, and instancing

use ultraviolet::{Mat4, Vec3, Vec4};
use std::collections::HashMap;

/// Renderable object handle
pub type RenderableId = u64;

/// Render queue for efficient batching
#[derive(Debug)]
pub struct RenderQueue {
    opaque_queue: Vec<RenderCommand>,
    transparent_queue: Vec<RenderCommand>,
    ui_queue: Vec<RenderCommand>,
    current_id: RenderableId,
}

/// Render command for batching
#[derive(Debug, Clone)]
pub struct RenderCommand {
    pub id: RenderableId,
    pub material_id: u64,
    pub mesh_id: u64,
    pub transform: Mat4,
    pub layer: u32,
    pub bounding_box: BoundingBox,
    pub cast_shadows: bool,
    pub receive_shadows: bool,
    pub is_ui: bool,
}

/// Bounding box for culling
#[derive(Debug, Clone, Copy)]
pub struct BoundingBox {
    pub min: Vec3,
    pub max: Vec3,
}

impl BoundingBox {
    pub fn new(min: Vec3, max: Vec3) -> Self {
        Self { min, max }
    }

    pub fn from_center_size(center: Vec3, size: Vec3) -> Self {
        let half = size * 0.5;
        Self {
            min: center - half,
            max: center + half,
        }
    }

    pub fn is_empty(&self) -> bool {
        self.min.x > self.max.x || self.min.y > self.max.y || self.min.z > self.max.z
    }

    pub fn center(&self) -> Vec3 {
        (self.min + self.max) * 0.5
    }

    pub fn size(&self) -> Vec3 {
        self.max - self.min
    }

    pub fn contains_point(&self, point: Vec3) -> bool {
        point.x >= self.min.x && point.x <= self.max.x &&
        point.y >= self.min.y && point.y <= self.max.y &&
        point.z >= self.min.z && point.z <= self.max.z
    }

    pub fn intersects(&self, other: &Self) -> bool {
        self.min.x <= other.max.x && self.max.x >= other.min.x &&
        self.min.y <= other.max.y && self.max.y >= other.min.y &&
        self.min.z <= other.max.z && self.max.z >= other.min.z
    }

    pub fn transform(&self, matrix: &Mat4) -> Self {
        let corners = [
            Vec3::new(self.min.x, self.min.y, self.min.z),
            Vec3::new(self.max.x, self.min.y, self.min.z),
            Vec3::new(self.min.x, self.max.y, self.min.z),
            Vec3::new(self.max.x, self.max.y, self.min.z),
            Vec3::new(self.min.x, self.min.y, self.max.z),
            Vec3::new(self.max.x, self.min.y, self.max.z),
            Vec3::new(self.min.x, self.max.y, self.max.z),
            Vec3::new(self.max.x, self.max.y, self.max.z),
        ];

        let mut min = Vec3::new(f32::INFINITY, f32::INFINITY, f32::INFINITY);
        let mut max = Vec3::new(f32::NEG_INFINITY, f32::NEG_INFINITY, f32::NEG_INFINITY);

        for corner in &corners {
            let transformed = matrix.transform_point(*corner);
            min = min.min(transformed);
            max = max.max(transformed);
        }

        Self { min, max }
    }
}

impl Default for RenderQueue {
    fn default() -> Self {
        Self::new()
    }
}

impl RenderQueue {
    pub fn new() -> Self {
        Self {
            opaque_queue: Vec::new(),
            transparent_queue: Vec::new(),
            ui_queue: Vec::new(),
            current_id: 1,
        }
    }

    pub fn add_opaque(&mut self, material_id: u64, mesh_id: u64, transform: Mat4, bounding_box: BoundingBox) -> RenderableId {
        let id = self.current_id;
        self.current_id += 1;

        self.opaque_queue.push(RenderCommand {
            id,
            material_id,
            mesh_id,
            transform,
            layer: 0,
            bounding_box,
            cast_shadows: true,
            receive_shadows: true,
            is_ui: false,
        });

        id
    }

    pub fn add_transparent(&mut self, material_id: u64, mesh_id: u64, transform: Mat4, bounding_box: BoundingBox) -> RenderableId {
        let id = self.current_id;
        self.current_id += 1;

        self.transparent_queue.push(RenderCommand {
            id,
            material_id,
            mesh_id,
            transform,
            layer: 0,
            bounding_box,
            cast_shadows: false,
            receive_shadows: true,
            is_ui: false,
        });

        id
    }

    pub fn add_ui(&mut self, material_id: u64, mesh_id: u64, transform: Mat4) -> RenderableId {
        let id = self.current_id;
        self.current_id += 1;

        self.ui_queue.push(RenderCommand {
            id,
            material_id,
            mesh_id,
            transform,
            layer: 100,
            bounding_box: BoundingBox::new(Vec3::zero(), Vec3::zero()),
            cast_shadows: false,
            receive_shadows: false,
            is_ui: true,
        });

        id
    }

    pub fn sort_by_material(&mut self) {
        self.opaque_queue.sort_by(|a, b| a.material_id.cmp(&b.material_id));
        self.transparent_queue.sort_by(|a, b| a.material_id.cmp(&b.material_id));
    }

    pub fn sort_by_depth(&mut self, camera_position: Vec3) {
        self.transparent_queue.sort_by(|a, b| {
            let dist_a = (a.bounding_box.center() - camera_position).mag_sq();
            let dist_b = (b.bounding_box.center() - camera_position).mag_sq();
            dist_b.partial_cmp(&dist_a).unwrap()
        });
    }

    pub fn clear(&mut self) {
        self.opaque_queue.clear();
        self.transparent_queue.clear();
        self.ui_queue.clear();
    }

    pub fn get_opaque_commands(&self) -> &[RenderCommand] {
        &self.opaque_queue
    }

    pub fn get_transparent_commands(&self) -> &[RenderCommand] {
        &self.transparent_queue
    }

    pub fn get_ui_commands(&self) -> &[RenderCommand] {
        &self.ui_queue
    }
}

/// Frustum for view frustum culling
#[derive(Debug, Clone, Copy)]
pub struct Frustum {
    pub planes: [Plane; 6],
}

#[derive(Debug, Clone, Copy)]
pub struct Plane {
    pub normal: Vec3,
    pub distance: f32,
}

impl Plane {
    pub fn new(normal: Vec3, distance: f32) -> Self {
        Self {
            normal: normal.normalized(),
            distance,
        }
    }

    pub fn distance_to_point(&self, point: Vec3) -> f32 {
        self.normal.dot(point) + self.distance
    }

    pub fn contains_point(&self, point: Vec3) -> bool {
        self.distance_to_point(point) >= 0.0
    }

    pub fn intersects_sphere(&self, center: Vec3, radius: f32) -> bool {
        self.distance_to_point(center) >= -radius
    }
}

impl Frustum {
    pub fn from_matrix(matrix: &Mat4) -> Self {
        let m = matrix.as_array();

        let planes = [
            // Left
            Plane::new(
                Vec3::new(m[0][3] + m[0][0], m[1][3] + m[1][0], m[2][3] + m[2][0]),
                m[3][3] + m[3][0],
            ),
            // Right
            Plane::new(
                Vec3::new(m[0][3] - m[0][0], m[1][3] - m[1][0], m[2][3] - m[2][0]),
                m[3][3] - m[3][0],
            ),
            // Bottom
            Plane::new(
                Vec3::new(m[0][3] + m[0][1], m[1][3] + m[1][1], m[2][3] + m[2][1]),
                m[3][3] + m[3][1],
            ),
            // Top
            Plane::new(
                Vec3::new(m[0][3] - m[0][1], m[1][3] - m[1][1], m[2][3] - m[2][1]),
                m[3][3] - m[3][1],
            ),
            // Near
            Plane::new(
                Vec3::new(m[0][3] + m[0][2], m[1][3] + m[1][2], m[2][3] + m[2][2]),
                m[3][3] + m[3][2],
            ),
            // Far
            Plane::new(
                Vec3::new(m[0][3] - m[0][2], m[1][3] - m[1][2], m[2][3] - m[2][2]),
                m[3][3] - m[3][2],
            ),
        ];

        Self { planes }
    }

    pub fn contains_point(&self, point: Vec3) -> bool {
        self.planes.iter().all(|plane| plane.contains_point(point))
    }

    pub fn contains_sphere(&self, center: Vec3, radius: f32) -> bool {
        self.planes.iter().all(|plane| plane.intersects_sphere(center, radius))
    }

    pub fn contains_bounding_box(&self, bbox: &BoundingBox) -> bool {
        for plane in &self.planes {
            let corners = [
                Vec3::new(bbox.min.x, bbox.min.y, bbox.min.z),
                Vec3::new(bbox.max.x, bbox.min.y, bbox.min.z),
                Vec3::new(bbox.min.x, bbox.max.y, bbox.min.z),
                Vec3::new(bbox.max.x, bbox.max.y, bbox.min.z),
                Vec3::new(bbox.min.x, bbox.min.y, bbox.max.z),
                Vec3::new(bbox.max.x, bbox.min.y, bbox.max.z),
                Vec3::new(bbox.min.x, bbox.max.y, bbox.max.z),
                Vec3::new(bbox.max.x, bbox.max.y, bbox.max.z),
            ];

            let mut all_outside = true;
            for corner in &corners {
                if plane.contains_point(*corner) {
                    all_outside = false;
                    break;
                }
            }

            if all_outside {
                return false;
            }
        }

        true
    }
}

/// Culling system
#[derive(Debug)]
pub struct CullingSystem {
    frustum: Frustum,
    occlusion_enabled: bool,
    small_object_culling: bool,
    small_object_threshold: f32,
}

impl Default for CullingSystem {
    fn default() -> Self {
        Self {
            frustum: Frustum::from_matrix(&Mat4::identity()),
            occlusion_enabled: false,
            small_object_culling: true,
            small_object_threshold: 2.0,
        }
    }
}

impl CullingSystem {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn update_frustum(&mut self, view_projection: &Mat4) {
        self.frustum = Frustum::from_matrix(view_projection);
    }

    pub fn is_visible(&self, bounding_box: &BoundingBox) -> bool {
        if bounding_box.is_empty() {
            return true;
        }

        if !self.frustum.contains_bounding_box(bounding_box) {
            return false;
        }

        if self.small_object_culling {
            let size = bounding_box.size();
            let screen_size = size.x.max(size.y).max(size.z);
            if screen_size < self.small_object_threshold {
                return false;
            }
        }

        true
    }

    pub fn cull_render_queue(&self, queue: &mut RenderQueue) {
        queue.opaque_queue.retain(|cmd| self.is_visible(&cmd.bounding_box));
        queue.transparent_queue.retain(|cmd| self.is_visible(&cmd.bounding_box));
    }
}

/// Instanced rendering batch
#[derive(Debug)]
pub struct InstancedBatch {
    pub material_id: u64,
    pub mesh_id: u64,
    pub instances: Vec<InstanceData>,
}

#[derive(Debug, Clone, Copy)]
pub struct InstanceData {
    pub transform: Mat4,
    pub color: Vec4,
    pub custom_data: [f32; 4],
}

impl Default for InstanceData {
    fn default() -> Self {
        Self {
            transform: Mat4::identity(),
            color: Vec4::one(),
            custom_data: [0.0; 4],
        }
    }
}

/// Instancing system for efficient rendering
#[derive(Debug)]
pub struct InstancingSystem {
    batches: HashMap<(u64, u64), InstancedBatch>,
    max_instances_per_batch: usize,
}

impl Default for InstancingSystem {
    fn default() -> Self {
        Self {
            batches: HashMap::new(),
            max_instances_per_batch: 1000,
        }
    }
}

impl InstancingSystem {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_max_instances(mut self, max: usize) -> Self {
        self.max_instances_per_batch = max;
        self
    }

    pub fn add_instance(&mut self, material_id: u64, mesh_id: u64, transform: Mat4, color: Vec4) {
        let key = (material_id, mesh_id);

        let batch = self.batches.entry(key).or_insert(InstancedBatch {
            material_id,
            mesh_id,
            instances: Vec::new(),
        });

        if batch.instances.len() < self.max_instances_per_batch {
            batch.instances.push(InstanceData {
                transform,
                color,
                custom_data: [0.0; 4],
            });
        }
    }

    pub fn get_batches(&self) -> Vec<&InstancedBatch> {
        self.batches.values().collect()
    }

    pub fn clear(&mut self) {
        self.batches.clear();
    }

    pub fn batch_count(&self) -> usize {
        self.batches.len()
    }

    pub fn total_instance_count(&self) -> usize {
        self.batches.values().map(|b| b.instances.len()).sum()
    }
}

/// GPU-driven rendering configuration
#[derive(Debug, Clone, Copy)]
pub struct GPUDrivenConfig {
    pub enabled: bool,
    pub max_draw_commands: u32,
    pub use_indirect_draw: bool,
    pub use_compute_culling: bool,
}

impl Default for GPUDrivenConfig {
    fn default() -> Self {
        Self {
            enabled: false,
            max_draw_commands: 65536,
            use_indirect_draw: true,
            use_compute_culling: false,
        }
    }
}

/// High-performance renderer combining all optimizations
#[derive(Debug)]
pub struct HighPerformanceRenderer {
    pub render_queue: RenderQueue,
    pub culling: CullingSystem,
    pub instancing: InstancingSystem,
    pub gpu_driven: GPUDrivenConfig,
    pub stats: RenderStats,
}

#[derive(Debug, Clone, Copy, Default)]
pub struct RenderStats {
    pub objects_submitted: u32,
    pub objects_culled: u32,
    pub draw_calls: u32,
    pub instanced_draw_calls: u32,
    pub triangles_rendered: u32,
    pub instances_rendered: u32,
}

impl Default for HighPerformanceRenderer {
    fn default() -> Self {
        Self::new()
    }
}

impl HighPerformanceRenderer {
    pub fn new() -> Self {
        Self {
            render_queue: RenderQueue::new(),
            culling: CullingSystem::new(),
            instancing: InstancingSystem::new(),
            gpu_driven: GPUDrivenConfig::default(),
            stats: RenderStats::default(),
        }
    }

    pub fn begin_frame(&mut self) {
        self.render_queue.clear();
        self.instancing.clear();
        self.stats = RenderStats::default();
    }

    pub fn submit_object(&mut self, material_id: u64, mesh_id: u64, transform: Mat4, bounding_box: BoundingBox, is_transparent: bool) {
        self.stats.objects_submitted += 1;

        if !self.culling.is_visible(&bounding_box) {
            self.stats.objects_culled += 1;
            return;
        }

        if is_transparent {
            self.render_queue.add_transparent(material_id, mesh_id, transform, bounding_box);
        } else {
            self.render_queue.add_opaque(material_id, mesh_id, transform, bounding_box);
        }
    }

    pub fn submit_instanced(&mut self, material_id: u64, mesh_id: u64, transform: Mat4, color: Vec4) {
        self.instancing.add_instance(material_id, mesh_id, transform, color);
    }

    pub fn end_frame(&mut self, camera_position: Vec3) {
        self.render_queue.sort_by_material();
        self.render_queue.sort_by_depth(camera_position);

        self.stats.draw_calls = self.render_queue.get_opaque_commands().len() as u32 +
                                self.render_queue.get_transparent_commands().len() as u32;
        self.stats.instanced_draw_calls = self.instancing.batch_count() as u32;
        self.stats.instances_rendered = self.instancing.total_instance_count() as u32;
    }

    pub fn get_stats(&self) -> RenderStats {
        self.stats
    }
}

/// Render graph for complex multi-pass rendering
#[derive(Debug)]
pub struct RenderGraph {
    nodes: Vec<RenderNode>,
    edges: Vec<(usize, usize)>,
}

#[derive(Debug)]
pub struct RenderNode {
    pub name: String,
    pub pass_type: RenderPassType,
    pub inputs: Vec<String>,
    pub outputs: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum RenderPassType {
    ShadowMap,
    DepthPrepass,
    Opaque,
    Transparent,
    PostProcess,
    UI,
    Present,
}

impl RenderGraph {
    pub fn new() -> Self {
        Self {
            nodes: Vec::new(),
            edges: Vec::new(),
        }
    }

    pub fn add_node(&mut self, name: impl Into<String>, pass_type: RenderPassType) -> usize {
        let index = self.nodes.len();
        self.nodes.push(RenderNode {
            name: name.into(),
            pass_type,
            inputs: Vec::new(),
            outputs: Vec::new(),
        });
        index
    }

    pub fn add_edge(&mut self, from: usize, to: usize) {
        self.edges.push((from, to));
    }

    pub fn topological_sort(&self) -> Vec<usize> {
        let mut visited = vec![false; self.nodes.len()];
        let mut result = Vec::new();

        fn visit(
            node: usize,
            visited: &mut [bool],
            result: &mut Vec<usize>,
            edges: &[(usize, usize)],
            nodes: &[RenderNode],
        ) {
            if visited[node] {
                return;
            }
            visited[node] = true;

            for &(from, to) in edges {
                if from == node {
                    visit(to, visited, result, edges, nodes);
                }
            }

            result.push(node);
        }

        for i in 0..self.nodes.len() {
            visit(i, &mut visited, &mut result, &self.edges, &self.nodes);
        }

        result.reverse();
        result
    }
}
