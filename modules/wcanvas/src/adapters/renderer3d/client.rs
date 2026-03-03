use wasm_bindgen::prelude::*;

use crate::adapters::renderer::wgpu_setup;
use crate::adapters::renderer3d::{
    camera_handler::CameraHandler, input_handler::InputHandler, light_handler::LightHandler,
    model_handler::ModelHandler, pipeline, resources,
};
use crate::physics::world::PhysicsWorld;
use crate::types::Size;

#[wasm_bindgen]
pub struct Client3d {
    surface: wgpu::Surface<'static>,
    device: wgpu::Device,
    queue: wgpu::Queue,
    config: wgpu::SurfaceConfiguration,
    size: Size,

    pipeline: wgpu::RenderPipeline,
    depth_texture: wgpu::Texture,
    depth_view: wgpu::TextureView,

    input_handler: InputHandler,
    camera_handler: CameraHandler,
    light_handler: LightHandler,
    model_handler: ModelHandler,

    physics_world: PhysicsWorld,
}

#[wasm_bindgen(js_name = "createClient3d")]
pub async fn create_client_3d(canvas: web_sys::HtmlCanvasElement) -> Result<Client3d, JsValue> {
    Client3d::create_impl(canvas).await
}

#[wasm_bindgen]
impl Client3d {
    async fn create_impl(canvas: web_sys::HtmlCanvasElement) -> Result<Client3d, JsValue> {
        let wgpu_setup::WgpuContext {
            surface,
            device,
            queue,
            config,
            surface_format,
            size,
        } = wgpu_setup::init(canvas).await.unwrap();

        let (pipeline, camera_bgl, light_bgl, model_bgl) =
            pipeline::create_pipeline(&device, surface_format);

        let camera_handler = CameraHandler::new(&device, size, &camera_bgl);
        let light_handler = LightHandler::new(&device, &light_bgl);
        let model_handler = ModelHandler::new(model_bgl);

        let (depth_texture, depth_view) = resources::create_depth_texture(&device, &config);

        Ok(Client3d {
            surface,
            device,
            queue,
            config,
            size,
            pipeline,
            depth_texture,
            depth_view,
            input_handler: InputHandler::new(),
            camera_handler,
            light_handler,
            model_handler,
            physics_world: PhysicsWorld::new(),
        })
    }

    #[wasm_bindgen(js_name = updateCameraView)]
    pub fn update_camera_view(&mut self, eye: &[f32], target: &[f32]) {
        self.camera_handler.update_view(eye, target);
    }

    #[wasm_bindgen(js_name = updateCameraProj)]
    pub fn update_camera_proj(&mut self, fovy_degrees: f32) {
        self.camera_handler.update_proj(fovy_degrees);
    }

    #[wasm_bindgen(js_name = loadObj)]
    pub async fn load_obj(&mut self, obj_data: &str) {
        self.model_handler
            .load_obj(
                &self.device,
                obj_data,
                &mut self.physics_world.rigid_body_set,
                &mut self.physics_world.collider_set,
            )
            .await;
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
        self.input_handler
            .update_mouse_state(x, y, left_button, middle_button, right_button);
    }

    #[wasm_bindgen(js_name = updateLightPosition)]
    pub fn update_light_position(&mut self, position: &[f32]) {
        self.light_handler.update_position(&self.queue, position);
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        if width > 0 && height > 0 {
            self.size = Size { width, height };
            self.config.width = width;
            self.config.height = height;
            self.surface.configure(&self.device, &self.config);
            self.camera_handler.resize(width, height);
            let (depth_texture, depth_view) =
                resources::create_depth_texture(&self.device, &self.config);
            self.depth_texture = depth_texture;
            self.depth_view = depth_view;
        }
    }

    pub fn draw(&mut self) {
        self.physics_world.step();
        self.camera_handler.update(&self.queue, &self.input_handler);
        self.input_handler.after_update();

        let output = self.surface.get_current_texture().unwrap();
        let view = output
            .texture
            .create_view(&wgpu::TextureViewDescriptor::default());

        let mut encoder = self
            .device
            .create_command_encoder(&wgpu::CommandEncoderDescriptor {
                label: Some("3D Render Encoder"),
            });

        {
            let mut pass = self.begin_render_pass(&mut encoder, &view);
            pass.set_pipeline(&self.pipeline);
            pass.set_bind_group(0, &self.camera_handler.bind_group, &[]);
            pass.set_bind_group(1, &self.light_handler.bind_group, &[]);
            self.model_handler
                .draw(&mut pass, &self.queue, &self.physics_world);
        }

        self.queue.submit(std::iter::once(encoder.finish()));
        output.present();
    }

    fn begin_render_pass<'a>(
        &'a self,
        encoder: &'a mut wgpu::CommandEncoder,
        view: &'a wgpu::TextureView,
    ) -> wgpu::RenderPass<'a> {
        encoder.begin_render_pass(&wgpu::RenderPassDescriptor {
            label: Some("3D Render Pass"),
            color_attachments: &[Some(wgpu::RenderPassColorAttachment {
                view,
                resolve_target: None,
                ops: wgpu::Operations {
                    load: wgpu::LoadOp::Clear(wgpu::Color {
                        r: 0.06,
                        g: 0.08,
                        b: 0.10,
                        a: 1.0,
                    }),
                    store: wgpu::StoreOp::Store,
                },
            })],
            depth_stencil_attachment: Some(wgpu::RenderPassDepthStencilAttachment {
                view: &self.depth_view,
                depth_ops: Some(wgpu::Operations {
                    load: wgpu::LoadOp::Clear(1.0),
                    store: wgpu::StoreOp::Store,
                }),
                stencil_ops: None,
            }),
            timestamp_writes: None,
            occlusion_query_set: None,
            multiview_mask: None,
        })
    }
}
