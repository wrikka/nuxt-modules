//! 2D WebGPU client - rendering and resize methods

use wasm_bindgen::prelude::*;
use crate::adapters::renderer::{
    client::Client,
    frame_buffer::FrameBuffer,
    post_process::PostProcess,
};
use crate::constants::colors::CLEAR_COLOR;
use crate::types::Size;

/// Rendering and resize methods for Client
#[wasm_bindgen]
impl Client {
    /// Resizes the canvas
    #[wasm_bindgen]
    pub fn resize(&mut self, width: u32, height: u32) {
        if width == 0 || height == 0 {
            return;
        }

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

        self.render_offscreen(&mut encoder);
        self.render_post_process(&mut encoder, &view);

        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
    }
}

impl Client {
    fn render_offscreen(&self, encoder: &mut wgpu::CommandEncoder) {
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

    fn render_post_process(
        &self,
        encoder: &mut wgpu::CommandEncoder,
        view: &wgpu::TextureView,
    ) {
        let mut render_pass = encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
            label: Some("Post-Process Render Pass"),
            color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                view,
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
}
