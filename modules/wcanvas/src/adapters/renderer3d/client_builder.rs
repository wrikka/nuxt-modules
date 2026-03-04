//! 3D WebGPU client builder

use wasm_bindgen::prelude::*;
use crate::adapters::renderer::wgpu_setup;
use crate::adapters::renderer3d::{
    client::Client3d,
    camera_handler::CameraHandler,
    input_handler::InputHandler,
    light_handler::LightHandler,
    model_handler::ModelHandler,
    pipeline, resources,
};
use crate::physics::world::PhysicsWorld;

/// Builder for constructing Client3d instances
pub struct Client3dBuilder {
    canvas: web_sys::HtmlCanvasElement,
}

impl Client3dBuilder {
    /// Create new builder with canvas
    pub fn new(canvas: web_sys::HtmlCanvasElement) -> Self {
        Self { canvas }
    }

    /// Build the 3D client
    pub async fn build(self) -> Result<Client3d, JsValue> {
        let wgpu_setup::WgpuContext {
            surface,
            device,
            queue,
            config,
            surface_format,
            size,
        } = wgpu_setup::init(self.canvas).await.map_err(|e| {
            JsValue::from_str(&format!("Failed to initialize WebGPU: {:?}", e))
        })?;

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
}
