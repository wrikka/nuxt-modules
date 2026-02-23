use crate::adapters::renderer3d::pipeline::Vertex3d;
use rapier3d::prelude::*;
use wgpu::util::DeviceExt;

pub struct Model {
    pub meshes: Vec<Mesh>,
}

pub struct Mesh {
    pub vertex_buffer: wgpu::Buffer,
    pub index_buffer: wgpu::Buffer,
    pub num_indices: u32,
    pub rigid_body_handle: RigidBodyHandle,
}

pub async fn load_model(
    obj_data: &str,
    device: &wgpu::Device,
    rigid_body_set: &mut RigidBodySet,
    collider_set: &mut ColliderSet,
) -> anyhow::Result<Model> {
    let (models, _materials) = tobj::load_obj_buf_async(
        &mut obj_data.as_bytes(),
        &tobj::LoadOptions {
            single_index: true,
            triangulate: true,
            ..Default::default()
        },
        |_p| async move { Err(tobj::LoadError::GenericFailure) },
    )
    .await?;

    let meshes = models
        .into_iter()
        .map(|m| {
            let rigid_body = RigidBodyBuilder::dynamic().build();
            let collider = ColliderBuilder::trimesh(
                m.mesh
                    .positions
                    .chunks(3)
                    .map(|v| point![v[0], v[1], v[2]])
                    .collect(),
                m.mesh
                    .indices
                    .chunks(3)
                    .map(|i| [i[0] as u32, i[1] as u32, i[2] as u32])
                    .collect(),
            )
            .build();
            let rigid_body_handle = rigid_body_set.insert(rigid_body);
            collider_set.insert_with_parent(collider, rigid_body_handle, rigid_body_set);

            let vertices = (0..m.mesh.positions.len() / 3)
                .map(|i| Vertex3d {
                    position: [
                        m.mesh.positions[i * 3],
                        m.mesh.positions[i * 3 + 1],
                        m.mesh.positions[i * 3 + 2],
                    ],
                    normal: [
                        m.mesh.normals[i * 3],
                        m.mesh.normals[i * 3 + 1],
                        m.mesh.normals[i * 3 + 2],
                    ],
                    color: [1.0, 1.0, 1.0], // Default color
                })
                .collect::<Vec<_>>();

            let vertex_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some(&format!("{:?} Vertex Buffer", m.name)),
                contents: bytemuck::cast_slice(&vertices),
                usage: wgpu::BufferUsages::VERTEX,
            });

            let index_buffer = device.create_buffer_init(&wgpu::util::BufferInitDescriptor {
                label: Some(&format!("{:?} Index Buffer", m.name)),
                contents: bytemuck::cast_slice(&m.mesh.indices),
                usage: wgpu::BufferUsages::INDEX,
            });

            Mesh {
                vertex_buffer,
                index_buffer,
                num_indices: m.mesh.indices.len() as u32,
                rigid_body_handle,
            }
        })
        .collect::<Vec<_>>();

    Ok(Model { meshes })
}
