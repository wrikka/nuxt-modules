use crate::adapters::renderer3d::{camera::Camera, pipeline};
use crate::input_handler::InputHandler;
use crate::types::Size;
use ultraviolet::{Mat4, Vec3};

pub(crate) struct CameraHandler {
    pub(crate) camera: Camera,
    pub(crate) uniform_buffer: wgpu::Buffer,
    pub(crate) bind_group: wgpu::BindGroup,
}

impl CameraHandler {
    pub(crate) fn new(
        device: &wgpu::Device,
        size: Size,
        bind_group_layout: &wgpu::BindGroupLayout,
    ) -> Self {
        let camera = Camera {
            eye: Vec3::new(0.0, 1.0, 2.0),
            target: Vec3::new(0.0, 0.0, 0.0),
            up: Vec3::unit_y(),
            aspect: size.width as f32 / size.height as f32,
            fovy: 45.0f32.to_radians(),
            znear: 0.1,
            zfar: 100.0,
        };

        let uniform = pipeline::CameraUniform {
            view_proj: camera.build_view_projection_matrix().into(),
        };
        let uniform_buffer =
            pipeline::create_uniform_buffer(device, "Camera Uniform Buffer", &uniform);
        let bind_group = pipeline::create_bind_group(device, bind_group_layout, &uniform_buffer);

        Self {
            camera,
            uniform_buffer,
            bind_group,
        }
    }

    pub(crate) fn update_view(&mut self, eye: &[f32], target: &[f32]) {
        self.camera.eye = Vec3::new(eye[0], eye[1], eye[2]);
        self.camera.target = Vec3::new(target[0], target[1], target[2]);
    }

    pub(crate) fn update_proj(&mut self, fovy_degrees: f32) {
        self.camera.fovy = fovy_degrees.to_radians();
    }

    pub(crate) fn resize(&mut self, width: u32, height: u32) {
        self.camera.aspect = width as f32 / height as f32;
    }

    pub(crate) fn update(&mut self, queue: &wgpu::Queue, input: &InputHandler) {
        if input.state.mouse.left_button_pressed {
            let dx = input.state.mouse.x - input.last_mouse_pos.0;
            let dy = input.state.mouse.y - input.last_mouse_pos.1;

            let rotation_speed = 0.005;
            let eye = self.camera.eye;
            let target = self.camera.target;
            let up = self.camera.up;

            let dir = (eye - target).normalized();
            let right = up.cross(dir).normalized();

            let rot_y = Mat4::from_rotation_around(up, -dx * rotation_speed);
            let rot_x = Mat4::from_rotation_around(right, -dy * rotation_speed);

            let new_eye = rot_x * rot_y * (eye - target) + target;
            self.camera.eye = new_eye;
        }

        let uniform = pipeline::CameraUniform {
            view_proj: self.camera.build_view_projection_matrix().into(),
        };
        queue.write_buffer(&self.uniform_buffer, 0, bytemuck::bytes_of(&uniform));
    }
}
