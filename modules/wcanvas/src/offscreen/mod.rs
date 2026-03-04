//! Offscreen rendering for Web Workers

use std::sync::{Arc, Mutex, mpsc};
use std::thread;

/// Render command types
#[derive(Debug, Clone)]
pub enum RenderCommand {
    Clear([f32; 4]),
    Draw { id: u64, transform: [f32; 16] },
    Present,
    Resize { width: u32, height: u32 },
    SetViewport { x: i32, y: i32, width: i32, height: i32 },
    SetScissor { x: i32, y: i32, width: i32, height: i32 },
}

/// Render result data
#[derive(Debug, Clone)]
pub struct RenderResult {
    pub buffer: Vec<u8>,
    pub width: u32,
    pub height: u32,
    pub format: PixelFormat,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PixelFormat {
    Rgba8,
    Rgb8,
    Rgba16f,
    Rgba32f,
    Bgra8,
}

/// Offscreen render configuration
#[derive(Debug, Clone, Copy)]
pub struct OffscreenConfig {
    pub width: u32,
    pub height: u32,
    pub pixel_format: PixelFormat,
    pub multisample: u32,
    pub depth_bits: u32,
    pub stencil_bits: u32,
    pub premultiplied_alpha: bool,
}

impl Default for OffscreenConfig {
    fn default() -> Self {
        Self {
            width: 1024,
            height: 1024,
            pixel_format: PixelFormat::Rgba8,
            multisample: 4,
            depth_bits: 24,
            stencil_bits: 8,
            premultiplied_alpha: true,
        }
    }
}

impl OffscreenConfig {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            ..Default::default()
        }
    }

    pub fn with_format(mut self, format: PixelFormat) -> Self {
        self.pixel_format = format;
        self
    }

    pub fn with_multisample(mut self, samples: u32) -> Self {
        self.multisample = samples;
        self
    }

    pub fn with_depth_bits(mut self, bits: u32) -> Self {
        self.depth_bits = bits;
        self
    }
}

/// Offscreen render target
#[derive(Debug)]
pub struct OffscreenTarget {
    pub config: OffscreenConfig,
    pub frame_buffer: Vec<u8>,
    pub depth_buffer: Vec<f32>,
    pub frame_count: u64,
}

impl OffscreenTarget {
    pub fn new(config: OffscreenConfig) -> Self {
        let pixel_count = (config.width * config.height) as usize;
        let bytes_per_pixel = match config.pixel_format {
            PixelFormat::Rgba8 | PixelFormat::Bgra8 => 4,
            PixelFormat::Rgb8 => 3,
            PixelFormat::Rgba16f => 8,
            PixelFormat::Rgba32f => 16,
        };

        Self {
            config,
            frame_buffer: vec![0; pixel_count * bytes_per_pixel],
            depth_buffer: vec![0.0; pixel_count],
            frame_count: 0,
        }
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.config.width = width;
        self.config.height = height;

        let pixel_count = (width * height) as usize;
        let bytes_per_pixel = match self.config.pixel_format {
            PixelFormat::Rgba8 | PixelFormat::Bgra8 => 4,
            PixelFormat::Rgb8 => 3,
            PixelFormat::Rgba16f => 8,
            PixelFormat::Rgba32f => 16,
        };

        self.frame_buffer.resize(pixel_count * bytes_per_pixel, 0);
        self.depth_buffer.resize(pixel_count, 0.0);
    }

    pub fn clear(&mut self, color: [f32; 4]) {
        let pixel_count = (self.config.width * self.config.height) as usize;
        let bytes_per_pixel = match self.config.pixel_format {
            PixelFormat::Rgba8 | PixelFormat::Bgra8 => 4,
            PixelFormat::Rgb8 => 3,
            PixelFormat::Rgba16f => 8,
            PixelFormat::Rgba32f => 16,
        };

        match self.config.pixel_format {
            PixelFormat::Rgba8 => {
                for i in 0..pixel_count {
                    let offset = i * bytes_per_pixel;
                    self.frame_buffer[offset] = (color[0] * 255.0) as u8;
                    self.frame_buffer[offset + 1] = (color[1] * 255.0) as u8;
                    self.frame_buffer[offset + 2] = (color[2] * 255.0) as u8;
                    self.frame_buffer[offset + 3] = (color[3] * 255.0) as u8;
                }
            }
            PixelFormat::Rgb8 => {
                for i in 0..pixel_count {
                    let offset = i * bytes_per_pixel;
                    self.frame_buffer[offset] = (color[0] * 255.0) as u8;
                    self.frame_buffer[offset + 1] = (color[1] * 255.0) as u8;
                    self.frame_buffer[offset + 2] = (color[2] * 255.0) as u8;
                }
            }
            _ => {}
        }

        for depth in &mut self.depth_buffer {
            *depth = 1.0;
        }
    }

    pub fn get_framebuffer(&self) -> &[u8] {
        &self.frame_buffer
    }

    pub fn get_depthbuffer(&self) -> &[f32] {
        &self.depth_buffer
    }

    pub fn get_result(&self) -> RenderResult {
        RenderResult {
            buffer: self.frame_buffer.clone(),
            width: self.config.width,
            height: self.config.height,
            format: self.config.pixel_format,
        }
    }
}

/// Web Worker render thread
pub struct WorkerRenderThread {
    pub config: OffscreenConfig,
    pub target: OffscreenTarget,
    pub command_receiver: mpsc::Receiver<RenderCommand>,
    pub result_sender: mpsc::Sender<RenderResult>,
    pub running: Arc<Mutex<bool>>,
}

impl WorkerRenderThread {
    pub fn new(
        config: OffscreenConfig,
        command_receiver: mpsc::Receiver<RenderCommand>,
        result_sender: mpsc::Sender<RenderResult>,
    ) -> Self {
        let target = OffscreenTarget::new(config);

        Self {
            config,
            target,
            command_receiver,
            result_sender,
            running: Arc::new(Mutex::new(true)),
        }
    }

    pub fn run(&mut self) {
        while let Ok(running) = self.running.lock() {
            if !*running {
                break;
            }
            drop(running);

            while let Ok(command) = self.command_receiver.try_recv() {
                self.process_command(command);
            }

            thread::sleep(std::time::Duration::from_millis(1));
        }
    }

    fn process_command(&mut self, command: RenderCommand) {
        match command {
            RenderCommand::Clear(color) => {
                self.target.clear(color);
            }
            RenderCommand::Present => {
                let result = self.target.get_result();
                let _ = self.result_sender.send(result);
                self.target.frame_count += 1;
            }
            RenderCommand::Resize { width, height } => {
                self.target.resize(width, height);
            }
            _ => {}
        }
    }

    pub fn stop(&self) {
        if let Ok(mut running) = self.running.lock() {
            *running = false;
        }
    }
}

/// Offscreen render manager
#[derive(Debug)]
pub struct OffscreenManager {
    targets: Vec<OffscreenTarget>,
    configs: Vec<OffscreenConfig>,
    active_target: Option<usize>,
    worker_threads: Vec<thread::JoinHandle<()>>,
}

impl Default for OffscreenManager {
    fn default() -> Self {
        Self {
            targets: Vec::new(),
            configs: Vec::new(),
            active_target: None,
            worker_threads: Vec::new(),
        }
    }
}

impl OffscreenManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn create_target(&mut self, config: OffscreenConfig) -> usize {
        let index = self.targets.len();
        let target = OffscreenTarget::new(config);
        self.targets.push(target);
        self.configs.push(config);
        index
    }

    pub fn set_active_target(&mut self, index: usize) -> bool {
        if index < self.targets.len() {
            self.active_target = Some(index);
            true
        } else {
            false
        }
    }

    pub fn get_active_target(&self) -> Option<&OffscreenTarget> {
        self.active_target.map(|i| &self.targets[i])
    }

    pub fn get_active_target_mut(&mut self) -> Option<&mut OffscreenTarget> {
        self.active_target.map(|i| &mut self.targets[i])
    }

    pub fn get_target(&self, index: usize) -> Option<&OffscreenTarget> {
        self.targets.get(index)
    }

    pub fn get_target_mut(&mut self, index: usize) -> Option<&mut OffscreenTarget> {
        self.targets.get_mut(index)
    }

    pub fn clear_active(&mut self, color: [f32; 4]) {
        if let Some(target) = self.get_active_target_mut() {
            target.clear(color);
        }
    }

    pub fn resize_target(&mut self, index: usize, width: u32, height: u32) -> bool {
        if let Some(target) = self.targets.get_mut(index) {
            target.resize(width, height);
            true
        } else {
            false
        }
    }

    pub fn get_result(&self, index: usize) -> Option<RenderResult> {
        self.targets.get(index).map(|t| t.get_result())
    }

    pub fn create_worker_thread(&mut self, config: OffscreenConfig) -> (mpsc::Sender<RenderCommand>, mpsc::Receiver<RenderResult>) {
        let (cmd_tx, cmd_rx) = mpsc::channel();
        let (result_tx, result_rx) = mpsc::channel();

        let mut thread = WorkerRenderThread::new(config, cmd_rx, result_tx);

        let handle = thread::spawn(move || {
            thread.run();
        });

        self.worker_threads.push(handle);

        (cmd_tx, result_rx)
    }

    pub fn stop_all_workers(self) {
        for handle in self.worker_threads {
            let _ = handle.join();
        }
    }

    pub fn target_count(&self) -> usize {
        self.targets.len()
    }
}

/// Image export utilities
pub mod export {
    use super::*;

    pub fn to_png(buffer: &[u8], width: u32, height: u32) -> Vec<u8> {
        let mut png_data = Vec::new();

        png_data.extend_from_slice(&[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

        png_data.extend_from_slice(&create_ihdr_chunk(width, height));

        let mut raw_data = Vec::new();
        for row in 0..height {
            raw_data.push(0);
            for col in 0..width {
                let idx = ((row * width + col) * 4) as usize;
                if idx + 3 < buffer.len() {
                    raw_data.push(buffer[idx]);
                    raw_data.push(buffer[idx + 1]);
                    raw_data.push(buffer[idx + 2]);
                    raw_data.push(buffer[idx + 3]);
                }
            }
        }

        let compressed = miniz_oxide::deflate::compress_to_vec_zlib(&raw_data, 6);
        png_data.extend_from_slice(&create_idat_chunk(&compressed));

        png_data.extend_from_slice(&create_iend_chunk());

        png_data
    }

    fn create_ihdr_chunk(width: u32, height: u32) -> Vec<u8> {
        let mut data = Vec::new();
        data.extend_from_slice(&width.to_be_bytes());
        data.extend_from_slice(&height.to_be_bytes());
        data.push(8);
        data.push(6);
        data.push(0);
        data.push(0);
        data.push(0);
        create_chunk(b"IHDR", &data)
    }

    fn create_idat_chunk(data: &[u8]) -> Vec<u8> {
        create_chunk(b"IDAT", data)
    }

    fn create_iend_chunk() -> Vec<u8> {
        create_chunk(b"IEND", &[])
    }

    fn create_chunk(chunk_type: &[u8], data: &[u8]) -> Vec<u8> {
        let mut chunk = Vec::new();
        let len = data.len() as u32;
        chunk.extend_from_slice(&len.to_be_bytes());
        chunk.extend_from_slice(chunk_type);
        chunk.extend_from_slice(data);

        let mut crc_data = Vec::new();
        crc_data.extend_from_slice(chunk_type);
        crc_data.extend_from_slice(data);
        let crc = crc32fast::hash(&crc_data);
        chunk.extend_from_slice(&crc.to_be_bytes());

        chunk
    }

    pub fn to_jpeg(buffer: &[u8], width: u32, height: u32, quality: u8) -> Vec<u8> {
        let mut jpeg_data = Vec::new();

        jpeg_data.extend_from_slice(&[0xFF, 0xD8]);

        jpeg_data.extend_from_slice(&create_jfif_marker());

        jpeg_data.extend_from_slice(&create_dqt_marker());

        jpeg_data.extend_from_slice(&create_sof0_marker(width, height));

        jpeg_data.extend_from_slice(&create_dht_marker());

        jpeg_data.extend_from_slice(&create_sos_marker());

        let _ = quality;

        jpeg_data.extend_from_slice(&[0xFF, 0xD9]);

        jpeg_data
    }

    fn create_jfif_marker() -> Vec<u8> {
        let data = vec![
            0x4A, 0x46, 0x49, 0x46, 0x00,
            0x01, 0x01,
            0x00,
            0x00, 0x01, 0x00, 0x01,
            0x00, 0x00,
        ];
        create_jpeg_segment(0xE0, &data)
    }

    fn create_dqt_marker() -> Vec<u8> {
        let data = vec![
            0x00,
            0x10, 0x0B, 0x0C, 0x0E, 0x0C, 0x0A, 0x10, 0x0E,
            0x0D, 0x0E, 0x12, 0x11, 0x10, 0x13, 0x18, 0x28,
            0x1A, 0x18, 0x16, 0x16, 0x18, 0x31, 0x23, 0x25,
            0x1D, 0x28, 0x3A, 0x33, 0x3D, 0x3C, 0x39, 0x33,
            0x38, 0x37, 0x40, 0x48, 0x5C, 0x4E, 0x40, 0x44,
            0x57, 0x45, 0x37, 0x38, 0x50, 0x6D, 0x51, 0x57,
            0x5F, 0x62, 0x67, 0x68, 0x67, 0x3E, 0x4D, 0x71,
            0x79, 0x70, 0x64, 0x78, 0x5C, 0x65, 0x67, 0x63,
        ];
        create_jpeg_segment(0xDB, &data)
    }

    fn create_sof0_marker(width: u32, height: u32) -> Vec<u8> {
        let mut data = vec![
            0x08,
            (height >> 8) as u8, height as u8,
            (width >> 8) as u8, width as u8,
            0x03,
            0x01, 0x22, 0x00,
            0x02, 0x11, 0x01,
            0x03, 0x11, 0x01,
        ];
        create_jpeg_segment(0xC0, &data)
    }

    fn create_dht_marker() -> Vec<u8> {
        let data = vec![
            0x00,
            0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B,
        ];
        create_jpeg_segment(0xC4, &data)
    }

    fn create_sos_marker() -> Vec<u8> {
        let data = vec![
            0x03,
            0x01, 0x00, 0x02, 0x11, 0x03, 0x11,
            0x00, 0x3F, 0x00,
        ];
        create_jpeg_segment(0xDA, &data)
    }

    fn create_jpeg_segment(marker: u8, data: &[u8]) -> Vec<u8> {
        let mut segment = vec![0xFF, marker];
        let len = data.len() + 2;
        segment.push((len >> 8) as u8);
        segment.push(len as u8);
        segment.extend_from_slice(data);
        segment
    }
}
