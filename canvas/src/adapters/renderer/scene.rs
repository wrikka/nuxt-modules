use std::sync::Arc;

use crate::adapters::renderer::renderable::Renderable;
use crate::adapters::renderer::shapes::{
    custom_shader_quad::CustomShaderQuad,
    hexagon::Hexagon,
    instanced_quad::{Instance, InstancedQuad},
    quad::Quad,
    star::Star,
    sticky_note::StickyNote,
    text::Text,
    textured_quad::TexturedQuad,
    triangle::Triangle,
};
use crate::types::instance::InstanceData;

use super::font::atlas::FontAtlas;

pub struct Scene {
    renderables: Vec<Box<dyn Renderable>>,
}

impl Scene {
    pub fn new() -> Self {
        Self {
            renderables: Vec::new(),
        }
    }

    pub fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        for renderable in &self.renderables {
            renderable.draw(render_pass);
        }
    }

    pub fn add_triangle(&mut self, device: &wgpu::Device, format: wgpu::TextureFormat) {
        let triangle = Triangle::new(device, format);
        self.renderables.push(Box::new(triangle));
    }

    pub fn add_quad(&mut self, device: &wgpu::Device, format: wgpu::TextureFormat) {
        let quad = Quad::new(device, format);
        self.renderables.push(Box::new(quad));
    }

    pub fn add_star(&mut self, device: &wgpu::Device, format: wgpu::TextureFormat) {
        let star = Star::new(device, format);
        self.renderables.push(Box::new(star));
    }

    pub fn add_hexagon(&mut self, device: &wgpu::Device, format: wgpu::TextureFormat) {
        let hexagon = Hexagon::new(device, format);
        self.renderables.push(Box::new(hexagon));
    }

    pub fn add_sticky_note(&mut self, device: &wgpu::Device, format: wgpu::TextureFormat) {
        let sticky_note = StickyNote::new(device, format);
        self.renderables.push(Box::new(sticky_note));
    }

    pub fn add_textured_quad(
        &mut self,
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        image_bytes: &[u8],
        format: wgpu::TextureFormat,
    ) {
        let textured_quad = TexturedQuad::new(device, queue, image_bytes, format);
        self.renderables.push(Box::new(textured_quad));
    }

    pub fn add_text(
        &mut self,
        device: &wgpu::Device,
        text: &str,
        font_atlas: Arc<FontAtlas>,
        format: wgpu::TextureFormat,
    ) {
        let text_renderable = Text::new(device, text, font_atlas, format);
        self.renderables.push(Box::new(text_renderable));
    }

    pub fn add_custom_shader_quad(
        &mut self,
        device: &wgpu::Device,
        format: wgpu::TextureFormat,
        shader_code: &str,
    ) {
        let quad = CustomShaderQuad::new(device, format, shader_code);
        self.renderables.push(Box::new(quad));
    }

    pub fn add_instanced_quad(
        &mut self,
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        image_bytes: &[u8],
        instances_data: &[InstanceData],
        format: wgpu::TextureFormat,
    ) {
        let instances = instances_data
            .iter()
            .map(|data| Instance {
                position: [data.x, data.y, data.z],
            })
            .collect();

        let instanced_quad = InstancedQuad::new(device, queue, image_bytes, instances, format);
        self.renderables.push(Box::new(instanced_quad));
    }
}

impl Default for Scene {
    fn default() -> Self {
        Self::new()
    }
}
