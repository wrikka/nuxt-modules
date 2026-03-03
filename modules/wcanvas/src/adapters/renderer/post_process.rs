use wgpu::util::DeviceExt;

use crate::adapters::renderer::{pipeline, vertex::Vertex};

// A full-screen quad
const POST_PROCESS_VERTICES: &[Vertex] = &[
    Vertex {
        position: [-1.0, 1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 0.0],
    }, // Top-left
    Vertex {
        position: [-1.0, -1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 1.0],
    }, // Bottom-left
    Vertex {
        position: [1.0, -1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 1.0],
    }, // Bottom-right
    Vertex {
        position: [1.0, 1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 0.0],
    }, // Top-right
];

const POST_PROCESS_INDICES: &[u16] = &[0, 1, 2, 0, 2, 3];

#[derive(Debug)]
#[allow(dead_code)]
pub struct PostProcess {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    render_pipeline: wgpu::RenderPipeline,
}

impl PostProcess {
    pub fn new(
        device: &wgpu::Device,
        surface_format: wgpu::TextureFormat,
        texture_bind_group_layout: &wgpu::BindGroupLayout,
    ) -> Self {
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Post-Process Vertex Buffer"),
            contents: bytemuck::cast_slice(POST_PROCESS_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Post-Process Index Buffer"),
            contents: bytemuck::cast_slice(POST_PROCESS_INDICES),
            usage: wgpu::BufferUsages::INDEX,
        });

        let shader = device.create_shader_module(wgpu::include_wgsl!("post_process_shader.wgsl"));

        let render_pipeline = pipeline::create_render_pipeline(
            device,
            surface_format,
            &shader,
            &[Vertex::desc()],
            &[texture_bind_group_layout],
        );

        Self {
            vertex_buffer,
            index_buffer,
            num_indices: POST_PROCESS_INDICES.len() as u32,
            render_pipeline,
        }
    }

    // The draw method for PostProcess is special, it needs the bind group to draw
    pub fn draw<'a>(
        &'a self,
        render_pass: &mut wgpu::RenderPass<'a>,
        frame_buffer_bind_group: &'a wgpu::BindGroup,
    ) {
        render_pass.set_pipeline(&self.render_pipeline);
        render_pass.set_bind_group(0, frame_buffer_bind_group, &[]);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.num_indices, 0, 0..1);
    }
}
