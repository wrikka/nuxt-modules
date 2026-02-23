use crate::adapters::renderer3d::pipeline::{self, Light};

pub(crate) struct LightHandler {
    pub(crate) light: Light,
    pub(crate) uniform_buffer: wgpu::Buffer,
    pub(crate) bind_group: wgpu::BindGroup,
}

impl LightHandler {
    pub(crate) fn new(device: &wgpu::Device, bind_group_layout: &wgpu::BindGroupLayout) -> Self {
        let light = Light {
            position: [2.0, 2.0, 2.0],
            _padding: 0,
            color: [1.0, 1.0, 1.0],
            _padding2: 0,
        };
        let uniform_buffer =
            pipeline::create_uniform_buffer(device, "Light Uniform Buffer", &light);
        let bind_group = pipeline::create_bind_group(device, bind_group_layout, &uniform_buffer);

        Self {
            light,
            uniform_buffer,
            bind_group,
        }
    }

    pub(crate) fn update_position(&mut self, queue: &wgpu::Queue, position: &[f32]) {
        self.light.position = [position[0], position[1], position[2]];
        queue.write_buffer(&self.uniform_buffer, 0, bytemuck::bytes_of(&self.light));
    }
}
