use std::sync::Arc;
use wgpu::util::DeviceExt;

use crate::adapters::renderer::{
    font::atlas::FontAtlas, renderable::Renderable, uniforms::Uniforms, vertex::Vertex,
};

// A single quad vertex buffer, all characters will reuse this
const TEXT_QUAD_VERTICES: &[Vertex] = &[
    Vertex {
        position: [0.0, 1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 0.0],
    }, // Top-left
    Vertex {
        position: [0.0, 0.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 1.0],
    }, // Bottom-left
    Vertex {
        position: [1.0, 0.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 1.0],
    }, // Bottom-right
    Vertex {
        position: [1.0, 1.0, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 0.0],
    }, // Top-right
];

const TEXT_QUAD_INDICES: &[u16] = &[0, 1, 2, 0, 2, 3];

// Instance data for a single character glyph
#[repr(C)]
#[derive(Copy, Clone, bytemuck::Pod, bytemuck::Zeroable)]
struct GlyphInstance {
    position: [f32; 3],
    uv_top_left: [f32; 2],
    uv_bottom_right: [f32; 2],
}

impl GlyphInstance {
    fn desc() -> wgpu::VertexBufferLayout<'static> {
        use std::mem;
        wgpu::VertexBufferLayout {
            array_stride: mem::size_of::<GlyphInstance>() as wgpu::BufferAddress,
            step_mode: wgpu::VertexStepMode::Instance,
            attributes: &[
                wgpu::VertexAttribute {
                    offset: 0,
                    shader_location: 5,
                    format: wgpu::VertexFormat::Float32x3,
                },
                wgpu::VertexAttribute {
                    offset: mem::size_of::<[f32; 3]>() as wgpu::BufferAddress,
                    shader_location: 6,
                    format: wgpu::VertexFormat::Float32x2,
                },
                wgpu::VertexAttribute {
                    offset: mem::size_of::<[f32; 5]>() as wgpu::BufferAddress,
                    shader_location: 7,
                    format: wgpu::VertexFormat::Float32x2,
                },
            ],
        }
    }
}

#[allow(dead_code)]
pub struct Text {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    font_atlas: Arc<FontAtlas>,
    uniforms: Uniforms,
    uniform_buffer: wgpu::Buffer,
    uniform_bind_group: wgpu::BindGroup,
    instance_buffer: wgpu::Buffer,
    num_instances: u32,
    render_pipeline: wgpu::RenderPipeline,
}

impl Text {
    pub fn new(
        device: &wgpu::Device,
        text: &str,
        font_atlas: Arc<FontAtlas>,
        surface_format: wgpu::TextureFormat,
    ) -> Self {
        // Create vertex and index buffers for a single quad
        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Text Vertex Buffer"),
            contents: bytemuck::cast_slice(TEXT_QUAD_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Text Index Buffer"),
            contents: bytemuck::cast_slice(TEXT_QUAD_INDICES),
            usage: wgpu::BufferUsages::INDEX,
        });

        // Create uniform buffer and bind group
        let uniforms = Uniforms::new(); // Identity matrix for now
        let uniform_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Text Uniform Buffer"),
            contents: bytemuck::cast_slice(&[uniforms]),
            usage: wgpu::BufferUsages::UNIFORM | wgpu::BufferUsages::COPY_DST,
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

        let uniform_bind_group = device.create_bind_group(&wgpu::BindGroupDescriptor {
            layout: &uniform_bind_group_layout,
            entries: &[wgpu::BindGroupEntry {
                binding: 0,
                resource: uniform_buffer.as_entire_binding(),
            }],
            label: Some("uniform_bind_group"),
        });

        // Create the render pipeline specifically for text
        let render_pipeline = Self::create_render_pipeline(
            device,
            surface_format,
            &font_atlas.texture.as_ref().unwrap().bind_group_layout,
            &uniform_bind_group_layout,
        );

        // Generate instance data from the text string
        let instance_data = Self::generate_instances(text, &font_atlas);

        let instance_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Text Instance Buffer"),
            contents: bytemuck::cast_slice(&instance_data),
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
        });

        Self {
            vertex_buffer,
            index_buffer,
            num_indices: TEXT_QUAD_INDICES.len() as u32,
            font_atlas,
            uniforms,
            uniform_buffer,
            uniform_bind_group,
            instance_buffer,
            num_instances: instance_data.len() as u32,
            render_pipeline,
        }
    }

    fn create_render_pipeline(
        device: &wgpu::Device,
        surface_format: wgpu::TextureFormat,
        texture_bind_group_layout: &wgpu::BindGroupLayout,
        uniform_bind_group_layout: &wgpu::BindGroupLayout,
    ) -> wgpu::RenderPipeline {
        let shader = device.create_shader_module(wgpu::include_wgsl!("../text_shader.wgsl"));

        let render_pipeline_layout =
            device.create_pipeline_layout(&wgpu::PipelineLayoutDescriptor {
                label: Some("Text Pipeline Layout"),
                bind_group_layouts: &[texture_bind_group_layout, uniform_bind_group_layout],
                push_constant_ranges: &[],
            });

        device.create_render_pipeline(&wgpu::RenderPipelineDescriptor {
            label: Some("Text Render Pipeline"),
            layout: Some(&render_pipeline_layout),
            vertex: wgpu::VertexState {
                module: &shader,
                entry_point: "vs_main",
                buffers: &[Vertex::desc(), GlyphInstance::desc()],
            },
            fragment: Some(wgpu::FragmentState {
                module: &shader,
                entry_point: "fs_main",
                targets: &[Some(wgpu::ColorTargetState {
                    format: surface_format,
                    blend: Some(wgpu::BlendState::ALPHA_BLENDING),
                    write_mask: wgpu::ColorWrites::ALL,
                })],
            }),
            primitive: wgpu::PrimitiveState {
                topology: wgpu::PrimitiveTopology::TriangleList,
                strip_index_format: None,
                front_face: wgpu::FrontFace::Ccw,
                cull_mode: Some(wgpu::Face::Back),
                polygon_mode: wgpu::PolygonMode::Fill,
                unclipped_depth: false,
                conservative: false,
            },
            depth_stencil: None,
            multisample: wgpu::MultisampleState {
                count: 1,
                mask: !0,
                alpha_to_coverage_enabled: false,
            },
            multiview: None,
        })
    }

    fn generate_instances(text: &str, font_atlas: &FontAtlas) -> Vec<GlyphInstance> {
        let mut instances = Vec::new();
        let mut cursor_x = 0.0;
        let _line_height = font_atlas.metrics_info.line_height as f32;

        for char_code in text.chars() {
            if let Some(glyph) = font_atlas.get_glyph(char_code) {
                if let (Some(plane_bounds), Some(atlas_bounds)) =
                    (&glyph.plane_bounds, &glyph.atlas_bounds)
                {
                    let instance = GlyphInstance {
                        position: [
                            cursor_x + plane_bounds.left as f32,
                            // Adjust for baseline
                            (plane_bounds.bottom as f32)
                                - (font_atlas.metrics_info.descender as f32),
                            0.0,
                        ],
                        uv_top_left: [
                            atlas_bounds.left as f32 / font_atlas.atlas_info.width as f32,
                            atlas_bounds.top as f32 / font_atlas.atlas_info.height as f32,
                        ],
                        uv_bottom_right: [
                            atlas_bounds.right as f32 / font_atlas.atlas_info.width as f32,
                            atlas_bounds.bottom as f32 / font_atlas.atlas_info.height as f32,
                        ],
                    };
                    instances.push(instance);
                }
                cursor_x += glyph.advance as f32;
            }
        }
        instances
    }
}

impl Renderable for Text {
    fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        if let Some(texture) = &self.font_atlas.texture {
            render_pass.set_pipeline(&self.render_pipeline);
            render_pass.set_bind_group(0, &texture.bind_group, &[]);
            render_pass.set_bind_group(1, &self.uniform_bind_group, &[]);
            render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
            render_pass.set_vertex_buffer(1, self.instance_buffer.slice(..));
            render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
            render_pass.draw_indexed(0..self.num_indices, 0, 0..self.num_instances);
        }
    }
}
