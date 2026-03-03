use super::vertex::Vertex3d;
use wgpu::util::DeviceExt;

pub(crate) const CUBE_VERTICES: &[Vertex3d] = &[
    // Front
    Vertex3d {
        position: [-0.5, -0.5, 0.5],
        normal: [0.0, 0.0, 1.0],
        color: [1.0, 0.0, 0.0],
    },
    Vertex3d {
        position: [0.5, -0.5, 0.5],
        normal: [0.0, 0.0, 1.0],
        color: [0.0, 1.0, 0.0],
    },
    Vertex3d {
        position: [0.5, 0.5, 0.5],
        normal: [0.0, 0.0, 1.0],
        color: [0.0, 0.0, 1.0],
    },
    Vertex3d {
        position: [-0.5, 0.5, 0.5],
        normal: [0.0, 0.0, 1.0],
        color: [1.0, 1.0, 0.0],
    },
    // Back
    Vertex3d {
        position: [-0.5, -0.5, -0.5],
        normal: [0.0, 0.0, -1.0],
        color: [1.0, 0.0, 1.0],
    },
    Vertex3d {
        position: [0.5, -0.5, -0.5],
        normal: [0.0, 0.0, -1.0],
        color: [0.0, 1.0, 1.0],
    },
    Vertex3d {
        position: [0.5, 0.5, -0.5],
        normal: [0.0, 0.0, -1.0],
        color: [1.0, 1.0, 1.0],
    },
    Vertex3d {
        position: [-0.5, 0.5, -0.5],
        normal: [0.0, 0.0, -1.0],
        color: [0.2, 0.2, 0.2],
    },
    // Right
    Vertex3d {
        position: [0.5, -0.5, 0.5],
        normal: [1.0, 0.0, 0.0],
        color: [0.0, 1.0, 0.0],
    },
    Vertex3d {
        position: [0.5, -0.5, -0.5],
        normal: [1.0, 0.0, 0.0],
        color: [0.0, 1.0, 1.0],
    },
    Vertex3d {
        position: [0.5, 0.5, -0.5],
        normal: [1.0, 0.0, 0.0],
        color: [1.0, 1.0, 1.0],
    },
    Vertex3d {
        position: [0.5, 0.5, 0.5],
        normal: [1.0, 0.0, 0.0],
        color: [0.0, 0.0, 1.0],
    },
    // Left
    Vertex3d {
        position: [-0.5, -0.5, 0.5],
        normal: [-1.0, 0.0, 0.0],
        color: [1.0, 0.0, 0.0],
    },
    Vertex3d {
        position: [-0.5, 0.5, 0.5],
        normal: [-1.0, 0.0, 0.0],
        color: [1.0, 1.0, 0.0],
    },
    Vertex3d {
        position: [-0.5, 0.5, -0.5],
        normal: [-1.0, 0.0, 0.0],
        color: [0.2, 0.2, 0.2],
    },
    Vertex3d {
        position: [-0.5, -0.5, -0.5],
        normal: [-1.0, 0.0, 0.0],
        color: [1.0, 0.0, 1.0],
    },
    // Top
    Vertex3d {
        position: [0.5, 0.5, 0.5],
        normal: [0.0, 1.0, 0.0],
        color: [0.0, 0.0, 1.0],
    },
    Vertex3d {
        position: [0.5, 0.5, -0.5],
        normal: [0.0, 1.0, 0.0],
        color: [1.0, 1.0, 1.0],
    },
    Vertex3d {
        position: [-0.5, 0.5, -0.5],
        normal: [0.0, 1.0, 0.0],
        color: [0.2, 0.2, 0.2],
    },
    Vertex3d {
        position: [-0.5, 0.5, 0.5],
        normal: [0.0, 1.0, 0.0],
        color: [1.0, 1.0, 0.0],
    },
    // Bottom
    Vertex3d {
        position: [0.5, -0.5, 0.5],
        normal: [0.0, -1.0, 0.0],
        color: [0.0, 1.0, 0.0],
    },
    Vertex3d {
        position: [-0.5, -0.5, 0.5],
        normal: [0.0, -1.0, 0.0],
        color: [1.0, 0.0, 0.0],
    },
    Vertex3d {
        position: [-0.5, -0.5, -0.5],
        normal: [0.0, -1.0, 0.0],
        color: [1.0, 0.0, 1.0],
    },
    Vertex3d {
        position: [0.5, -0.5, -0.5],
        normal: [0.0, -1.0, 0.0],
        color: [0.0, 1.0, 1.0],
    },
];

pub(crate) const CUBE_INDICES: &[u16] = &[
    0, 1, 2, 0, 2, 3, // front
    1, 5, 6, 1, 6, 2, // right
    5, 4, 7, 5, 7, 6, // back
    4, 0, 3, 4, 3, 7, // left
    3, 2, 6, 3, 6, 7, // top
    4, 5, 1, 4, 1, 0, // bottom
];

pub(crate) fn create_mesh_buffers(device: &wgpu::Device) -> (wgpu::Buffer, wgpu::Buffer, u32) {
    let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("3D Vertex Buffer"),
        contents: bytemuck::cast_slice(CUBE_VERTICES),
        usage: wgpu::BufferUsages::VERTEX,
    });

    let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
        label: Some("3D Index Buffer"),
        contents: bytemuck::cast_slice(CUBE_INDICES),
        usage: wgpu::BufferUsages::INDEX,
    });

    (vertex_buffer, index_buffer, CUBE_INDICES.len() as u32)
}
