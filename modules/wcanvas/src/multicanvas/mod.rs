//! Multi-canvas support for rendering to multiple canvases

use std::collections::HashMap;

/// Canvas ID
pub type CanvasId = u64;

/// Canvas configuration
#[derive(Debug, Clone, Copy)]
pub struct CanvasConfig {
    pub width: u32,
    pub height: u32,
    pub pixel_ratio: f32,
    pub alpha: bool,
    pub antialias: bool,
    pub depth: bool,
    pub stencil: bool,
    pub premultiplied_alpha: bool,
    pub preserve_drawing_buffer: bool,
    pub power_preference: PowerPreference,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PowerPreference {
    Default,
    HighPerformance,
    LowPower,
}

impl Default for CanvasConfig {
    fn default() -> Self {
        Self {
            width: 800,
            height: 600,
            pixel_ratio: 1.0,
            alpha: true,
            antialias: true,
            depth: true,
            stencil: false,
            premultiplied_alpha: true,
            preserve_drawing_buffer: false,
            power_preference: PowerPreference::HighPerformance,
        }
    }
}

impl CanvasConfig {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            ..Default::default()
        }
    }

    pub fn with_pixel_ratio(mut self, ratio: f32) -> Self {
        self.pixel_ratio = ratio;
        self
    }

    pub fn with_alpha(mut self, alpha: bool) -> Self {
        self.alpha = alpha;
        self
    }

    pub fn with_antialias(mut self, antialias: bool) -> Self {
        self.antialias = antialias;
        self
    }

    pub fn with_depth(mut self, depth: bool) -> Self {
        self.depth = depth;
        self
    }

    pub fn with_power_preference(mut self, preference: PowerPreference) -> Self {
        self.power_preference = preference;
        self
    }
}

/// Canvas render target
#[derive(Debug, Clone)]
pub struct CanvasTarget {
    pub id: CanvasId,
    pub config: CanvasConfig,
    pub name: String,
    pub active: bool,
    pub auto_resize: bool,
    pub z_index: i32,
    pub clear_color: [f32; 4],
}

impl CanvasTarget {
    pub fn new(id: CanvasId, name: impl Into<String>, config: CanvasConfig) -> Self {
        Self {
            id,
            config,
            name: name.into(),
            active: true,
            auto_resize: true,
            z_index: 0,
            clear_color: [0.06, 0.08, 0.10, 1.0],
        }
    }

    pub fn with_z_index(mut self, z_index: i32) -> Self {
        self.z_index = z_index;
        self
    }

    pub fn with_clear_color(mut self, r: f32, g: f32, b: f32, a: f32) -> Self {
        self.clear_color = [r, g, b, a];
        self
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.config.width = width;
        self.config.height = height;
    }
}

/// Multi-canvas manager
#[derive(Debug)]
pub struct MultiCanvasManager {
    canvases: HashMap<CanvasId, CanvasTarget>,
    next_id: CanvasId,
    active_canvas: Option<CanvasId>,
    primary_canvas: Option<CanvasId>,
}

impl Default for MultiCanvasManager {
    fn default() -> Self {
        Self {
            canvases: HashMap::new(),
            next_id: 1,
            active_canvas: None,
            primary_canvas: None,
        }
    }
}

impl MultiCanvasManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn create_canvas(&mut self, name: impl Into<String>, config: CanvasConfig) -> CanvasId {
        let id = self.next_id;
        self.next_id += 1;

        let canvas = CanvasTarget::new(id, name, config);
        self.canvases.insert(id, canvas);

        if self.primary_canvas.is_none() {
            self.primary_canvas = Some(id);
        }

        id
    }

    pub fn remove_canvas(&mut self, id: CanvasId) -> bool {
        let removed = self.canvases.remove(&id).is_some();

        if self.active_canvas == Some(id) {
            self.active_canvas = None;
        }

        if self.primary_canvas == Some(id) {
            self.primary_canvas = self.canvases.keys().next().copied();
        }

        removed
    }

    pub fn get_canvas(&self, id: CanvasId) -> Option<&CanvasTarget> {
        self.canvases.get(&id)
    }

    pub fn get_canvas_mut(&mut self, id: CanvasId) -> Option<&mut CanvasTarget> {
        self.canvases.get_mut(&id)
    }

    pub fn set_active_canvas(&mut self, id: CanvasId) -> bool {
        if self.canvases.contains_key(&id) {
            self.active_canvas = Some(id);
            true
        } else {
            false
        }
    }

    pub fn get_active_canvas(&self) -> Option<CanvasId> {
        self.active_canvas
    }

    pub fn get_active_canvas_target(&self) -> Option<&CanvasTarget> {
        self.active_canvas.and_then(|id| self.canvases.get(&id))
    }

    pub fn set_primary_canvas(&mut self, id: CanvasId) -> bool {
        if self.canvases.contains_key(&id) {
            self.primary_canvas = Some(id);
            true
        } else {
            false
        }
    }

    pub fn get_primary_canvas(&self) -> Option<CanvasId> {
        self.primary_canvas
    }

    pub fn resize_canvas(&mut self, id: CanvasId, width: u32, height: u32) -> bool {
        if let Some(canvas) = self.canvases.get_mut(&id) {
            canvas.resize(width, height);
            true
        } else {
            false
        }
    }

    pub fn resize_all(&mut self, width: u32, height: u32) {
        for canvas in self.canvases.values_mut() {
            if canvas.auto_resize {
                canvas.resize(width, height);
            }
        }
    }

    pub fn enable_canvas(&mut self, id: CanvasId) -> bool {
        if let Some(canvas) = self.canvases.get_mut(&id) {
            canvas.active = true;
            true
        } else {
            false
        }
    }

    pub fn disable_canvas(&mut self, id: CanvasId) -> bool {
        if let Some(canvas) = self.canvases.get_mut(&id) {
            canvas.active = false;
            true
        } else {
            false
        }
    }

    pub fn is_canvas_active(&self, id: CanvasId) -> bool {
        self.canvases.get(&id).map(|c| c.active).unwrap_or(false)
    }

    pub fn get_all_canvases(&self) -> Vec<CanvasId> {
        self.canvases.keys().copied().collect()
    }

    pub fn get_active_canvases(&self) -> Vec<CanvasId> {
        self.canvases
            .iter()
            .filter(|(_, c)| c.active)
            .map(|(id, _)| *id)
            .collect()
    }

    pub fn iter_canvases(&self) -> impl Iterator<Item = (CanvasId, &CanvasTarget)> {
        self.canvases.iter().map(|(id, canvas)| (*id, canvas))
    }

    pub fn iter_canvases_mut(&mut self) -> impl Iterator<Item = (CanvasId, &mut CanvasTarget)> {
        self.canvases.iter_mut().map(|(id, canvas)| (*id, canvas))
    }

    pub fn get_canvas_count(&self) -> usize {
        self.canvases.len()
    }

    pub fn get_active_count(&self) -> usize {
        self.canvases.values().filter(|c| c.active).count()
    }

    pub fn clear(&mut self) {
        self.canvases.clear();
        self.active_canvas = None;
        self.primary_canvas = None;
    }

    pub fn swap_canvas_order(&mut self, id1: CanvasId, id2: CanvasId) -> bool {
        let canvas1 = self.canvases.get(&id1)?.clone();
        let canvas2 = self.canvases.get(&id2)?.clone();

        if let Some(c1) = self.canvases.get_mut(&id1) {
            c1.z_index = canvas2.z_index;
        }
        if let Some(c2) = self.canvases.get_mut(&id2) {
            c2.z_index = canvas1.z_index;
        }

        true
    }

    pub fn bring_to_front(&mut self, id: CanvasId) -> bool {
        let max_z = self.canvases.values().map(|c| c.z_index).max().unwrap_or(0);

        if let Some(canvas) = self.canvases.get_mut(&id) {
            canvas.z_index = max_z + 1;
            true
        } else {
            false
        }
    }

    pub fn send_to_back(&mut self, id: CanvasId) -> bool {
        let min_z = self.canvases.values().map(|c| c.z_index).min().unwrap_or(0);

        if let Some(canvas) = self.canvases.get_mut(&id) {
            canvas.z_index = min_z - 1;
            true
        } else {
            false
        }
    }
}

/// Canvas synchronization mode
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum SyncMode {
    Independent,
    Lockstep,
    MasterSlave { master: CanvasId },
}

/// Canvas group for synchronized rendering
#[derive(Debug, Clone)]
pub struct CanvasGroup {
    pub name: String,
    pub canvases: Vec<CanvasId>,
    pub sync_mode: SyncMode,
    pub shared_context: bool,
}

impl CanvasGroup {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            canvases: Vec::new(),
            sync_mode: SyncMode::Independent,
            shared_context: false,
        }
    }

    pub fn add_canvas(&mut self, id: CanvasId) {
        if !self.canvases.contains(&id) {
            self.canvases.push(id);
        }
    }

    pub fn remove_canvas(&mut self, id: CanvasId) {
        self.canvases.retain(|&c| c != id);
    }

    pub fn with_sync_mode(mut self, mode: SyncMode) -> Self {
        self.sync_mode = mode;
        self
    }

    pub fn with_shared_context(mut self, shared: bool) -> Self {
        self.shared_context = shared;
        self
    }
}
