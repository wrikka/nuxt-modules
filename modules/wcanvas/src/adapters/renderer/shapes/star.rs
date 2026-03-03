use wgpu::util::DeviceExt;

use crate::adapters::renderer::{pipeline, renderable::Renderable, vertex::Vertex};

const STAR_VERTICES: &[Vertex] = &[
    // Center vertex
    Vertex {
        position: [0.0, 0.0, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.5, 0.5],
    },
    // Outer vertices (5 points)
    Vertex {
        position: [0.0, 0.5, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.5, 0.0],
    }, // Top
    Vertex {
        position: [-0.4755, 0.1545, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.024, 0.345],
    }, // Top-left
    Vertex {
        position: [-0.2939, -0.4045, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.206, 0.905],
    }, // Bottom-left
    Vertex {
        position: [0.2939, -0.4045, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.794, 0.905],
    }, // Bottom-right
    Vertex {
        position: [0.4755, 0.1545, 0.0],
        color: [1.0, 1.0, 0.0],
        tex_coords: [0.976, 0.345],
    }, // Top-right
];

const STAR_INDICES: &[u16] = &[0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 1];

#[allow(dead_code)]
pub struct Star {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    render_pipeline: wgpu::RenderPipeline,
}

impl Star {
    pub fn new(device: &wgpu::Device, surface_format: wgpu::TextureFormat) -> Self {
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Star Vertex Buffer"),
            contents: bytemuck::cast_slice(STAR_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Star Index Buffer"),
            contents: bytemuck::cast_slice(STAR_INDICES),
            usage: wgpu::BufferUsages::INDEX,
        });

        let shader = device.create_shader_module(wgpu::include_wgsl!("../shader.wgsl"));

        let render_pipeline = pipeline::create_render_pipeline(
            device,
            surface_format,
            &shader,
            &[Vertex::desc()],
            &[],
        );

        Self {
            vertex_buffer,
            index_buffer,
            num_indices: STAR_INDICES.len() as u32,
            render_pipeline,
        }
    }
}

impl Renderable for Star {
    fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        render_pass.set_pipeline(&self.render_pipeline);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.num_indices, 0, 0..1);
    }
}
