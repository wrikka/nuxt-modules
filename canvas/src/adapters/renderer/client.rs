use wasm_bindgen::prelude::*;

use std::{collections::HashMap, sync::Arc};

use crate::adapters::renderer::{
    font::atlas::FontAtlas,
    frame_buffer::FrameBuffer,
    post_process::PostProcess,
    renderable::Renderable,
    scene::Scene,
    shapes::{
        custom_shader_quad::CustomShaderQuad,
        hexagon::Hexagon,
        instanced_quad::{Instance, InstancedQuad},
        quad::Quad,
        star::Star,
        sticky_note::StickyNote,
        text::Text,
        textured_quad::TexturedQuad,
        triangle::Triangle,
    },
    wgpu_setup,
};
use crate::components::input::state::InputState;
use crate::constants::colors::CLEAR_COLOR;
use crate::types::instance::InstanceData;
use crate::types::Size;

/// WebGPU canvas client for high-performance rendering
#[wasm_bindgen]
pub struct Client {
    surface: wgpu::Surface<'static>,
    device: wgpu::Device,
    queue: wgpu::Queue,
    config: wgpu::SurfaceConfiguration,
    size: Size,
    scene: Scene,
    font_cache: HashMap<String, Arc<FontAtlas>>,
    frame_buffer: FrameBuffer,
    post_process_pass: PostProcess,
    input_state: InputState,
}

#[wasm_bindgen(js_name = "createClient")]
#[cfg(target_arch = "wasm32")]
pub async fn create_client(canvas: web_sys::HtmlCanvasElement) -> Result<Client, JsValue> {
    Client::create_impl(canvas).await
}

#[wasm_bindgen]
impl Client {
    #[allow(deprecated)]
    #[cfg(target_arch = "wasm32")]
    async fn create_impl(canvas: web_sys::HtmlCanvasElement) -> Result<Client, JsValue> {
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
        } = wgpu_setup::init(canvas).await?;

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

    /// Adds a new triangle to the scene
    #[wasm_bindgen]
    pub fn add_triangle(&mut self) {
        self.scene.add_triangle(&self.device, self.config.format);
    }

    /// Adds a new quad to the scene
    #[wasm_bindgen]
    pub fn add_quad(&mut self) {
        self.scene.add_quad(&self.device, self.config.format);
    }

    /// Adds a new star to the scene
    #[wasm_bindgen]
    pub fn add_star(&mut self) {
        self.scene.add_star(&self.device, self.config.format);
    }

    /// Adds a new hexagon to the scene
    #[wasm_bindgen]
    pub fn add_hexagon(&mut self) {
        self.scene.add_hexagon(&self.device, self.config.format);
    }

    /// Adds a new sticky note to the scene
    #[wasm_bindgen]
    pub fn add_sticky_note(&mut self) {
        self.scene.add_sticky_note(&self.device, self.config.format);
    }

    /// Adds a new textured quad to the scene
    #[wasm_bindgen]
    pub fn add_textured_quad(&mut self, image_bytes: &[u8]) {
        self.scene
            .add_textured_quad(&self.device, &self.queue, image_bytes, self.config.format);
    }

    /// Adds a new text to the scene
    #[wasm_bindgen]
    pub fn add_text(
        &mut self,
        font_name: &str,
        text: &str,
        atlas_json_bytes: &[u8],
        atlas_image_bytes: &[u8],
    ) {
        let font_atlas = self
            .font_cache
            .entry(font_name.to_string())
            .or_insert_with(|| {
                let atlas = FontAtlas::new(
                    &self.device,
                    &self.queue,
                    atlas_json_bytes,
                    atlas_image_bytes,
                )
                .expect("Failed to load font atlas");
                Arc::new(atlas)
            });

        self.scene.add_text(
            &self.device,
            text,
            Arc::clone(font_atlas),
            self.config.format,
        );
    }

    #[wasm_bindgen(js_name = addCustomShaderQuad)]
    pub fn add_custom_shader_quad(&mut self, shader_code: &str) {
        self.scene
            .add_custom_shader_quad(&self.device, self.config.format, shader_code);
    }

    #[wasm_bindgen(js_name = updateMouseState)]
    pub fn update_mouse_state(
        &mut self,
        x: f32,
        y: f32,
        left_button: bool,
        middle_button: bool,
        right_button: bool,
    ) {
        self.input_state.mouse.x = x;
        self.input_state.mouse.y = y;
        self.input_state.mouse.left_button_pressed = left_button;
        self.input_state.mouse.middle_button_pressed = middle_button;
        self.input_state.mouse.right_button_pressed = right_button;
    }

    pub fn add_instanced_quad(&mut self, image_bytes: &[u8], instances_data: &[InstanceData]) {
        self.scene.add_instanced_quad(
            &self.device,
            &self.queue,
            image_bytes,
            instances_data,
            self.config.format,
        );
    }

    /// Resizes the canvas
    #[wasm_bindgen]
    pub fn resize(&mut self, width: u32, height: u32) {
        if width > 0 && height > 0 {
            self.size = Size { width, height };
            self.config.width = width;
            self.config.height = height;
            self.surface.configure(&self.device, &self.config);
            self.frame_buffer =
                FrameBuffer::new(&self.device, &self.queue, width, height, self.config.format);
            self.post_process_pass = PostProcess::new(
                &self.device,
                self.config.format,
                &self.frame_buffer.texture.bind_group_layout,
            );
        }
    }

    /// Renders a frame
    pub fn draw(&mut self) {
        let output = match self.surface.get_current_texture() {
            Ok(output) => output,
            Err(wgpu::SurfaceError::Lost) => {
                tracing::warn!("Surface lost, reconfiguring...");
                self.resize(self.size.width, self.size.height);
                return;
            }
            Err(e) => {
                tracing::error!("Failed to get current texture: {:?}", e);
                return;
            }
        };

        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());
        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("Render Encoder"),
            });

        // Offscreen pass
        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Offscreen Render Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &self.frame_buffer.texture.view,
                    resolve_target: None,
                    depth_slice: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Clear(CLEAR_COLOR),
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
                multiview_mask: None,
            });

            self.scene.draw(&mut render_pass);
        }

        // Post-processing pass (draw to screen)
        {
            let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
                label: Some("Post-Process Render Pass"),
                color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                    view: &view,
                    resolve_target: None,
                    depth_slice: None,
                    ops: wgpu::Operations {
                        load: wgpu::LoadOp::Load,
                        store: wgpu::StoreOp::Store,
                    },
                })],
                depth_stencil_attachment: None,
                timestamp_writes: None,
                occlusion_query_set: None,
                multiview_mask: None,
            });

            self.post_process_pass
                .draw(&mut render_pass, &self.frame_buffer.texture.bind_group);
        }

        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
    }
}
