use wgpu::util::DeviceExt;

use crate::adapters::renderer::{pipeline, renderable::Renderable, vertex::Vertex};

const STICKY_NOTE_VERTICES: &[Vertex] = &[
    Vertex {
        position: [-0.5, 0.5, 0.0],
        color: [1.0, 0.96, 0.69], // A nice yellow color
        tex_coords: [0.0, 0.0],
    }, // Top-left
    Vertex {
        position: [-0.5, -0.5, 0.0],
        color: [1.0, 0.96, 0.69],
        tex_coords: [0.0, 1.0],
    }, // Bottom-left
    Vertex {
        position: [0.5, -0.5, 0.0],
        color: [1.0, 0.96, 0.69],
        tex_coords: [1.0, 1.0],
    }, // Bottom-right
    Vertex {
        position: [0.5, 0.5, 0.0],
        color: [1.0, 0.96, 0.69],
        tex_coords: [1.0, 0.0],
    }, // Top-right
];

const STICKY_NOTE_INDICES: &[u16] = &[
    0, 1, 2, // First triangle
    0, 2, 3, // Second triangle
];

#[allow(dead_code)]
pub struct StickyNote {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    render_pipeline: wgpu::RenderPipeline,
}

impl StickyNote {
    pub fn new(device: &wgpu::Device, surface_format: wgpu::TextureFormat) -> Self {
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("StickyNote Vertex Buffer"),
            contents: bytemuck::cast_slice(STICKY_NOTE_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("StickyNote Index Buffer"),
            contents: bytemuck::cast_slice(STICKY_NOTE_INDICES),
            usage: wgpu::BufferUsages::INDEX,
        });

        let shader = device.create_shader_module(wgpu::include_wgsl!("../shader.wgsl"));

        let texture_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                entries: &[
                    wgpu::BindGroupLayoutEntry {
                        binding: 0,
                        visibility: wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Texture {
                            multisampled: false,
                            view_dimension: wgpu::TextureViewDimension::D2,
                            sample_type: wgpu::TextureSampleType::Float { filterable: true },
                        },
                        count: None,
                    },
                    wgpu::BindGroupLayoutEntry {
                        binding: 1,
                        visibility: wgpu::ShaderStages::FRAGMENT,
                        ty: wgpu::BindingType::Sampler(wgpu::SamplerBindingType::Filtering),
                        count: None,
                    },
                ],
                label: Some("texture_bind_group_layout"),
            });

        let uniform_bind_group_layout =
            device.create_bind_group_layout(&wgpu::BindGroupLayoutDescriptor {
                entries: &[wgpu::BindGroupLayoutEntry {
                    binding: 0,
                    visibility: wgpu::ShaderStages::VERTEX,
                    ty: wgpu::BindingType::Buffer {
                        ty: wgpu::BufferBindingType::Uniform,
                        has_dynamic_offset: false,
                        min_binding_size: None,
                    },
                    count: None,
                }],
                label: Some("uniform_bind_group_layout"),
            });

        let render_pipeline = pipeline::create_render_pipeline(
            device,
            surface_format,
            &shader,
            &[Vertex::desc()],
            &[&texture_bind_group_layout, &uniform_bind_group_layout],
        );

        Self {
            vertex_buffer,
            index_buffer,
            num_indices: STICKY_NOTE_INDICES.len() as u32,
            render_pipeline,
        }
    }
}

impl Renderable for StickyNote {
    fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        render_pass.set_pipeline(&self.render_pipeline);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.num_indices, 0, 0..1);
    }
}
