//! 2D WebGPU client - shape rendering methods

use wasm_bindgen::prelude::*;
use std::sync::Arc;

use crate::adapters::renderer::{
    client::Client,
    font::atlas::FontAtlas,
};
use crate::types::instance::InstanceData;

/// Shape rendering methods for Client
#[wasm_bindgen]
impl Client {
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

    /// Adds a quad with custom shader
    #[wasm_bindgen(js_name = addCustomShaderQuad)]
    pub fn add_custom_shader_quad(&mut self, shader_code: &str) {
        self.scene
            .add_custom_shader_quad(&self.device, self.config.format, shader_code);
    }

    /// Adds an instanced quad
    pub fn add_instanced_quad(&mut self, image_bytes: &[u8], instances_data: &[InstanceData]) {
        self.scene.add_instanced_quad(
            &self.device,
            &self.queue,
            image_bytes,
            instances_data,
            self.config.format,
        );
    }
}
