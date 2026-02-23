use wgpu::util::DeviceExt;

use crate::adapters::renderer::{
    instance::InstanceRaw, pipeline, renderable::Renderable, texture::Texture, uniforms::Uniforms,
    vertex::Vertex,
};

// We can reuse the vertices and indices from TexturedQuad
const INSTANCED_QUAD_VERTICES: &[Vertex] = &[
    Vertex {
        position: [-0.5, 0.5, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 0.0],
    }, // Top-left
    Vertex {
        position: [-0.5, -0.5, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [0.0, 1.0],
    }, // Bottom-left
    Vertex {
        position: [0.5, -0.5, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 1.0],
    }, // Bottom-right
    Vertex {
        position: [0.5, 0.5, 0.0],
        color: [1.0, 1.0, 1.0],
        tex_coords: [1.0, 0.0],
    }, // Top-right
];

const INSTANCED_QUAD_INDICES: &[u16] = &[
    0, 1, 2, // First triangle
    0, 2, 3, // Second triangle
];

// A higher-level representation of an instance
#[allow(dead_code)]
pub struct Instance {
    pub position: [f32; 3],
    // pub rotation: [f32; 4], // Quaternion - for future use
}

impl Instance {
    fn to_raw(&self) -> InstanceRaw {
        // This is a simplified conversion. A real implementation would use a math library
        // to convert position and rotation (quaternion) to a 4x4 model matrix.
        // For now, we'll just use a simple translation matrix.
        let transform = [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [self.position[0], self.position[1], self.position[2], 1.0],
        ];
        InstanceRaw { model: transform }
    }
}

#[allow(dead_code)]
pub struct InstancedQuad {
    vertex_buffer: wgpu::Buffer,
    index_buffer: wgpu::Buffer,
    num_indices: u32,
    texture: Texture,
    uniforms: Uniforms,
    uniform_buffer: wgpu::Buffer,
    uniform_bind_group: wgpu::BindGroup,
    instances: Vec<Instance>,
    instance_buffer: wgpu::Buffer,
    render_pipeline: wgpu::RenderPipeline,
}

impl InstancedQuad {
    pub fn new(
        device: &wgpu::Device,
        queue: &wgpu::Queue,
        image_bytes: &[u8],
        instances: Vec<Instance>,
        surface_format: wgpu::TextureFormat,
    ) -> Self {
        let texture = Texture::from_bytes(device, queue, image_bytes, "instanced_quad").unwrap();

        let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Instanced Quad Vertex Buffer"),
            contents: bytemuck::cast_slice(INSTANCED_QUAD_VERTICES),
            usage: wgpu::BufferUsages::VERTEX,
        });

        let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Instanced Quad Index Buffer"),
            contents: bytemuck::cast_slice(INSTANCED_QUAD_INDICES),
            usage: wgpu::BufferUsages::INDEX,
        });

        let uniforms = Uniforms::new();
        let uniform_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Uniform Buffer"),
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

        let instance_data = instances.iter().map(Instance::to_raw).collect::<Vec<_>>();
        let instance_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
            label: Some("Instance Buffer"),
            contents: bytemuck::cast_slice(&instance_data),
            usage: wgpu::BufferUsages::VERTEX | wgpu::BufferUsages::COPY_DST,
        });

        let shader = device.create_shader_module(wgpu::include_wgsl!("../shader.wgsl"));

        let render_pipeline = pipeline::create_render_pipeline(
            device,
            surface_format,
            &shader,
            &[Vertex::desc(), InstanceRaw::desc()],
            &[&texture.bind_group_layout, &uniform_bind_group_layout],
        );

        Self {
            vertex_buffer,
            index_buffer,
            num_indices: INSTANCED_QUAD_INDICES.len() as u32,
            texture,
            uniforms,
            uniform_buffer,
            uniform_bind_group,
            instances,
            instance_buffer,
            render_pipeline,
        }
    }
}

impl Renderable for InstancedQuad {
    fn draw<'a>(&'a self, render_pass: &mut wgpu::RenderPass<'a>) {
        render_pass.set_pipeline(&self.render_pipeline);
        render_pass.set_bind_group(0, &self.texture.bind_group, &[]);
        render_pass.set_bind_group(1, &self.uniform_bind_group, &[]);
        render_pass.set_vertex_buffer(0, self.vertex_buffer.slice(..));
        render_pass.set_vertex_buffer(1, self.instance_buffer.slice(..));
        render_pass.set_index_buffer(self.index_buffer.slice(..), wgpu::IndexFormat::Uint16);
        render_pass.draw_indexed(0..self.num_indices, 0, 0..self.instances.len() as u32);
    }
}
