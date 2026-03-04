//! 2D WebGPU client builder pattern

use wasm_bindgen::prelude::*;
use std::{collections::HashMap, sync::Arc};

use crate::adapters::renderer::{
    client::Client,
    font::atlas::FontAtlas,
    frame_buffer::FrameBuffer,
    post_process::PostProcess,
    scene::Scene,
    wgpu_setup,
};
use crate::components::input::state::InputState;
use crate::types::Size;

/// Builder for constructing Client instances
pub struct ClientBuilder {
    canvas: web_sys::HtmlCanvasElement,
}

impl ClientBuilder {
    /// Create a new client builder with a canvas element
    pub fn new(canvas: web_sys::HtmlCanvasElement) -> Self {
        Self { canvas }
    }

    /// Build the client with full initialization
    #[allow(deprecated)]
    #[cfg(target_arch = "wasm32")]
    pub async fn build(self) -> Result<Client, JsValue> {
        use crate::telemetry::{init_subscriber, set_panic_hook};
        init_subscriber();
        set_panic_hook();

        let wgpu_setup::WgpuContext {
            surface,
            device,
            queue,
            config,
            surface_format: _,
            size,
        } = wgpu_setup::init(self.canvas).await?;

        let frame_buffer =
            FrameBuffer::new(&device, &queue, size.width, size.height, config.format);
        let post_process_pass = PostProcess::new(
            &device,
            config.format,
            &frame_buffer.texture.bind_group_layout,
        );

        Ok(Client {
            surface,
            device,
            queue,
            config,
            size,
            scene: Scene::new(),
            font_cache: HashMap::new(),
            frame_buffer,
            post_process_pass,
            input_state: InputState::default(),
        })
    }
}
