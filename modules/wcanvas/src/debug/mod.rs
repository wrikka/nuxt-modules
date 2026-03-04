//! Debug tools and performance stats

use std::collections::VecDeque;
use std::time::{Duration, Instant};

/// Performance metrics collector
#[derive(Debug)]
pub struct PerformanceStats {
    frame_times: VecDeque<f32>,
    max_samples: usize,
    last_update: Instant,
    frame_count: u32,
    current_fps: f32,
    average_fps: f32,
    min_fps: f32,
    max_fps: f32,
    total_frames: u64,
    start_time: Instant,
}

impl Default for PerformanceStats {
    fn default() -> Self {
        Self {
            frame_times: VecDeque::with_capacity(120),
            max_samples: 120,
            last_update: Instant::now(),
            frame_count: 0,
            current_fps: 0.0,
            average_fps: 0.0,
            min_fps: f32::INFINITY,
            max_fps: 0.0,
            total_frames: 0,
            start_time: Instant::now(),
        }
    }
}

impl PerformanceStats {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_max_samples(mut self, samples: usize) -> Self {
        self.max_samples = samples;
        self.frame_times = VecDeque::with_capacity(samples);
        self
    }

    pub fn record_frame(&mut self, delta_time: f32) {
        let frame_time_ms = delta_time * 1000.0;

        if self.frame_times.len() >= self.max_samples {
            self.frame_times.pop_front();
        }
        self.frame_times.push_back(frame_time_ms);

        self.frame_count += 1;
        self.total_frames += 1;

        let elapsed = self.last_update.elapsed();
        if elapsed >= Duration::from_secs(1) {
            self.current_fps = self.frame_count as f32 / elapsed.as_secs_f32();
            self.update_statistics();
            self.frame_count = 0;
            self.last_update = Instant::now();
        }
    }

    fn update_statistics(&mut self) {
        if self.frame_times.is_empty() {
            return;
        }

        let sum: f32 = self.frame_times.iter().sum();
        let avg_frame_time = sum / self.frame_times.len() as f32;
        self.average_fps = 1000.0 / avg_frame_time;

        let min_frame_time = self.frame_times.iter().fold(f32::INFINITY, |a, &b| a.min(b));
        let max_frame_time = self.frame_times.iter().fold(0.0f32, |a, &b| a.max(b));

        self.min_fps = self.min_fps.min(1000.0 / max_frame_time);
        self.max_fps = self.max_fps.max(1000.0 / min_frame_time);
    }

    pub fn get_current_fps(&self) -> f32 {
        self.current_fps
    }

    pub fn get_average_fps(&self) -> f32 {
        self.average_fps
    }

    pub fn get_min_fps(&self) -> f32 {
        if self.min_fps == f32::INFINITY { 0.0 } else { self.min_fps }
    }

    pub fn get_max_fps(&self) -> f32 {
        self.max_fps
    }

    pub fn get_frame_time_ms(&self) -> f32 {
        self.frame_times.back().copied().unwrap_or(0.0)
    }

    pub fn get_average_frame_time_ms(&self) -> f32 {
        if self.frame_times.is_empty() {
            0.0
        } else {
            self.frame_times.iter().sum::<f32>() / self.frame_times.len() as f32
        }
    }

    pub fn get_percentile_frame_time(&self, percentile: f32) -> f32 {
        if self.frame_times.is_empty() {
            return 0.0;
        }

        let mut sorted: Vec<f32> = self.frame_times.iter().copied().collect();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

        let index = ((percentile / 100.0) * (sorted.len() - 1) as f32) as usize;
        sorted[index.min(sorted.len() - 1)]
    }

    pub fn get_total_frames(&self) -> u64 {
        self.total_frames
    }

    pub fn get_uptime_seconds(&self) -> f64 {
        self.start_time.elapsed().as_secs_f64()
    }

    pub fn reset(&mut self) {
        self.frame_times.clear();
        self.frame_count = 0;
        self.current_fps = 0.0;
        self.average_fps = 0.0;
        self.min_fps = f32::INFINITY;
        self.max_fps = 0.0;
        self.total_frames = 0;
        self.start_time = Instant::now();
        self.last_update = Instant::now();
    }

    pub fn get_formatted_stats(&self) -> String {
        format!(
            "FPS: {:.1} (avg: {:.1}, min: {:.1}, max: {:.1}) | Frame: {:.2}ms (avg: {:.2}ms, p99: {:.2}ms) | Frames: {} | Uptime: {:.1}s",
            self.get_current_fps(),
            self.get_average_fps(),
            self.get_min_fps(),
            self.get_max_fps(),
            self.get_frame_time_ms(),
            self.get_average_frame_time_ms(),
            self.get_percentile_frame_time(99.0),
            self.total_frames,
            self.get_uptime_seconds()
        )
    }
}

/// GPU memory stats
#[derive(Debug, Clone, Copy)]
pub struct GPUMemoryStats {
    pub total_bytes: u64,
    pub used_bytes: u64,
    pub buffer_bytes: u64,
    pub texture_bytes: u64,
    pub render_target_bytes: u64,
}

impl Default for GPUMemoryStats {
    fn default() -> Self {
        Self {
            total_bytes: 0,
            used_bytes: 0,
            buffer_bytes: 0,
            texture_bytes: 0,
            render_target_bytes: 0,
        }
    }
}

impl GPUMemoryStats {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_used_mb(&self) -> f32 {
        self.used_bytes as f32 / (1024.0 * 1024.0)
    }

    pub fn get_total_mb(&self) -> f32 {
        self.total_bytes as f32 / (1024.0 * 1024.0)
    }

    pub fn get_usage_percentage(&self) -> f32 {
        if self.total_bytes == 0 {
            0.0
        } else {
            (self.used_bytes as f32 / self.total_bytes as f32) * 100.0
        }
    }

    pub fn add_buffer(&mut self, bytes: u64) {
        self.buffer_bytes += bytes;
        self.used_bytes += bytes;
    }

    pub fn remove_buffer(&mut self, bytes: u64) {
        self.buffer_bytes = self.buffer_bytes.saturating_sub(bytes);
        self.used_bytes = self.used_bytes.saturating_sub(bytes);
    }

    pub fn add_texture(&mut self, bytes: u64) {
        self.texture_bytes += bytes;
        self.used_bytes += bytes;
    }

    pub fn remove_texture(&mut self, bytes: u64) {
        self.texture_bytes = self.texture_bytes.saturating_sub(bytes);
        self.used_bytes = self.used_bytes.saturating_sub(bytes);
    }

    pub fn add_render_target(&mut self, bytes: u64) {
        self.render_target_bytes += bytes;
        self.used_bytes += bytes;
    }

    pub fn remove_render_target(&mut self, bytes: u64) {
        self.render_target_bytes = self.render_target_bytes.saturating_sub(bytes);
        self.used_bytes = self.used_bytes.saturating_sub(bytes);
    }
}

/// Draw call statistics
#[derive(Debug, Clone, Copy, Default)]
pub struct DrawCallStats {
    pub draw_calls: u32,
    pub triangles: u32,
    pub vertices: u32,
    pub instances: u32,
    pub shader_switches: u32,
    pub texture_switches: u32,
    pub state_changes: u32,
}

impl DrawCallStats {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reset(&mut self) {
        *self = Self::default();
    }

    pub fn add_draw_call(&mut self, triangles: u32, vertices: u32) {
        self.draw_calls += 1;
        self.triangles += triangles;
        self.vertices += vertices;
    }

    pub fn add_instanced_draw_call(&mut self, triangles: u32, vertices: u32, instances: u32) {
        self.draw_calls += 1;
        self.triangles += triangles * instances;
        self.vertices += vertices * instances;
        self.instances += instances;
    }

    pub fn add_shader_switch(&mut self) {
        self.shader_switches += 1;
    }

    pub fn add_texture_switch(&mut self) {
        self.texture_switches += 1;
    }

    pub fn add_state_change(&mut self) {
        self.state_changes += 1;
    }
}

/// Debug visualizer modes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum DebugMode {
    None,
    Wireframe,
    Normals,
    UVs,
    Tangents,
    BoundingBoxes,
    Colliders,
    Skeleton,
    Particles,
    Lighting,
    Shadows,
    GBuffer,
    Depth,
    Velocity,
}

/// Debug visualization settings
#[derive(Debug, Clone)]
pub struct DebugSettings {
    pub mode: DebugMode,
    pub show_fps: bool,
    pub show_stats: bool,
    pub show_memory: bool,
    pub show_draw_calls: bool,
    pub show_bounding_boxes: bool,
    pub show_grid: bool,
    pub show_axis: bool,
    pub show_lights: bool,
    pub show_cameras: bool,
    pub wireframe_opacity: f32,
    pub gizmo_size: f32,
    pub grid_size: f32,
    pub grid_divisions: u32,
}

impl Default for DebugSettings {
    fn default() -> Self {
        Self {
            mode: DebugMode::None,
            show_fps: true,
            show_stats: true,
            show_memory: false,
            show_draw_calls: true,
            show_bounding_boxes: false,
            show_grid: false,
            show_axis: true,
            show_lights: false,
            show_cameras: false,
            wireframe_opacity: 0.5,
            gizmo_size: 1.0,
            grid_size: 10.0,
            grid_divisions: 10,
        }
    }
}

impl DebugSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn toggle_fps(&mut self) {
        self.show_fps = !self.show_fps;
    }

    pub fn toggle_stats(&mut self) {
        self.show_stats = !self.show_stats;
    }

    pub fn toggle_memory(&mut self) {
        self.show_memory = !self.show_memory;
    }

    pub fn toggle_draw_calls(&mut self) {
        self.show_draw_calls = !self.show_draw_calls;
    }

    pub fn toggle_wireframe(&mut self) {
        self.mode = if self.mode == DebugMode::Wireframe {
            DebugMode::None
        } else {
            DebugMode::Wireframe
        };
    }

    pub fn toggle_bounding_boxes(&mut self) {
        self.show_bounding_boxes = !self.show_bounding_boxes;
    }

    pub fn toggle_grid(&mut self) {
        self.show_grid = !self.show_grid;
    }

    pub fn toggle_axis(&mut self) {
        self.show_axis = !self.show_axis;
    }

    pub fn set_mode(&mut self, mode: DebugMode) {
        self.mode = mode;
    }
}

/// Debug console for logging
#[derive(Debug)]
pub struct DebugConsole {
    messages: VecDeque<DebugMessage>,
    max_messages: usize,
    visible: bool,
    scroll_to_bottom: bool,
}

#[derive(Debug, Clone)]
pub struct DebugMessage {
    pub level: LogLevel,
    pub message: String,
    pub timestamp: Instant,
    pub category: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum LogLevel {
    Debug,
    Info,
    Warning,
    Error,
}

impl LogLevel {
    pub fn color(&self) -> [f32; 4] {
        match self {
            Self::Debug => [0.7, 0.7, 0.7, 1.0],
            Self::Info => [1.0, 1.0, 1.0, 1.0],
            Self::Warning => [1.0, 0.8, 0.2, 1.0],
            Self::Error => [1.0, 0.2, 0.2, 1.0],
        }
    }
}

impl Default for DebugConsole {
    fn default() -> Self {
        Self {
            messages: VecDeque::with_capacity(100),
            max_messages: 100,
            visible: false,
            scroll_to_bottom: true,
        }
    }
}

impl DebugConsole {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn log(&mut self, level: LogLevel, category: impl Into<String>, message: impl Into<String>) {
        let msg = DebugMessage {
            level,
            message: message.into(),
            timestamp: Instant::now(),
            category: category.into(),
        };

        if self.messages.len() >= self.max_messages {
            self.messages.pop_front();
        }
        self.messages.push_back(msg);
    }

    pub fn debug(&mut self, category: impl Into<String>, message: impl Into<String>) {
        self.log(LogLevel::Debug, category, message);
    }

    pub fn info(&mut self, category: impl Into<String>, message: impl Into<String>) {
        self.log(LogLevel::Info, category, message);
    }

    pub fn warn(&mut self, category: impl Into<String>, message: impl Into<String>) {
        self.log(LogLevel::Warning, category, message);
    }

    pub fn error(&mut self, category: impl Into<String>, message: impl Into<String>) {
        self.log(LogLevel::Error, category, message);
    }

    pub fn clear(&mut self) {
        self.messages.clear();
    }

    pub fn toggle_visibility(&mut self) {
        self.visible = !self.visible;
    }

    pub fn is_visible(&self) -> bool {
        self.visible
    }

    pub fn show(&mut self) {
        self.visible = true;
    }

    pub fn hide(&mut self) {
        self.visible = false;
    }

    pub fn get_messages(&self) -> &VecDeque<DebugMessage> {
        &self.messages
    }

    pub fn get_messages_filtered(&self, level: LogLevel) -> Vec<&DebugMessage> {
        self.messages
            .iter()
            .filter(|m| m.level as i32 >= level as i32)
            .collect()
    }
}

/// Complete debug manager
#[derive(Debug)]
pub struct DebugManager {
    pub performance: PerformanceStats,
    pub gpu_memory: GPUMemoryStats,
    pub draw_calls: DrawCallStats,
    pub settings: DebugSettings,
    pub console: DebugConsole,
}

impl Default for DebugManager {
    fn default() -> Self {
        Self {
            performance: PerformanceStats::new(),
            gpu_memory: GPUMemoryStats::new(),
            draw_calls: DrawCallStats::new(),
            settings: DebugSettings::new(),
            console: DebugConsole::new(),
        }
    }
}

impl DebugManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn begin_frame(&mut self) {
        self.draw_calls.reset();
    }

    pub fn end_frame(&mut self, delta_time: f32) {
        self.performance.record_frame(delta_time);
    }

    pub fn record_draw_call(&mut self, triangles: u32, vertices: u32) {
        self.draw_calls.add_draw_call(triangles, vertices);
    }

    pub fn record_instanced_draw_call(&mut self, triangles: u32, vertices: u32, instances: u32) {
        self.draw_calls.add_instanced_draw_call(triangles, vertices, instances);
    }

    pub fn get_fps(&self) -> f32 {
        self.performance.get_current_fps()
    }

    pub fn get_formatted_stats(&self) -> String {
        self.performance.get_formatted_stats()
    }

    pub fn log(&mut self, level: LogLevel, category: impl Into<String>, message: impl Into<String>) {
        self.console.log(level, category, message);
    }

    pub fn toggle_console(&mut self) {
        self.console.toggle_visibility();
    }
}
