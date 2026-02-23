use wgpu::util::DeviceExt;

use crate::adapters::renderer::{pipeline, renderable::Renderable, vertex::Vertex};

const HEXAGON_VERTICES: &[Vertex] = &[
    // Center vertex
    Vertex {
        position: [0.0, 0.0, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.5, 0.5],
    },
    // Outer vertices (6 points)
    Vertex {
        position: [0.5, 0.0, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [1.0, 0.5],
    }, // Right
    Vertex {
        position: [0.25, 0.433, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.75, 0.067],
    }, // Top-right
    Vertex {
        position: [-0.25, 0.433, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.25, 0.067],
    }, // Top-left
    Vertex {
        position: [-0.5, 0.0, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.0, 0.5],
    }, // Left
    Vertex {
        position: [-0.25, -0.433, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.25, 0.933],
    }, // Bottom-left
    Vertex {
        position: [0.25, -0.433, 0.0],
        color: [0.0, 1.0, 0.0],
        tex_coords: [0.75, 0.933],
    }, // Bottom-right
];

const HEXAGON_INDICES: &[u16] = &[0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1];

#[allow(dead_code)]
pub struct Hexagon {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    render_pipeline: wgpu::RenderPipeline,
}

impl Hexagon {
    pub fn new(device: &wgpu::Device, surface_format: wgpu::TextureFormat) -> Self {
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Hexagon Vertex Buffer"),
            contents: bytemuck::cast_slice(HEXAGON_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Hexagon Index Buffer"),
            contents: bytemuck::cast_slice(HEXAGON_INDICES),
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
            num_indices: HEXAGON_INDICES.len() as u32,
            render_pipeline,
        }
    }
}

impl Renderable for Hexagon {
    fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        render_pass.set_pipeline(&self.render_pipeline);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.num_indices, 0, 0..1);
    }
}
