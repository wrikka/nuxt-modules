use crate::adapters::renderer3d::{
    model,
    pipeline::{self, ModelUniform},
};
use crate::physics::world::PhysicsWorld;
use rapier3d::prelude::{ColliderSet, RigidBodySet};
use ultraviolet::{Mat4, Vec3};

pub(crate) struct RenderableMesh {
    pub(crate) mesh: model::Mesh,
    pub(crate) model_uniform_buffer: wgpu::Buffer,
    pub(crate) model_bind_group: wgpu::BindGroup,
}

pub(crate) struct RenderableModel {
    pub(crate) meshes: Vec<RenderableMesh>,
}

pub(crate) struct ModelHandler {
    pub(crate) models: Vec<RenderableModel>,
    pub(crate) bind_group_layout: wgpu::BindGroupLayout,
}

impl ModelHandler {
    pub(crate) fn new(bind_group_layout: wgpu::BindGroupLayout) -> Self {
        Self {
            models: Vec::new(),
            bind_group_layout,
        }
    }

    pub(crate) async fn load_obj(
        &mut self,
        device: &wgpu::Device,
        obj_data: &str,
        rigid_body_set: &mut RigidBodySet,
        collider_set: &mut ColliderSet,
    ) {
        let model = model::load_model(obj_data, device, rigid_body_set, collider_set)
            .await
            .unwrap();

        let renderable_meshes = model
            .meshes
            .into_iter()
            .map(|mesh| {
                let model_uniform = ModelUniform {
                    model: Mat4::identity().into(),
                };
                let model_uniform_buffer =
                    pipeline::create_uniform_buffer(device, "Model Uniform Buffer", &model_uniform);
                let model_bind_group = pipeline::create_bind_group(
                    device,
                    &self.bind_group_layout,
                    &model_uniform_buffer,
                );
                RenderableMesh {
                    mesh,
                    model_uniform_buffer,
                    model_bind_group,
                }
            })
            .collect();

        self.models.push(RenderableModel {
            meshes: renderable_meshes,
        });
    }

    pub(crate) fn draw<'a>(
        &'a self,
        pass: &mut wgpu::RenderPass<'a>,
        queue: &wgpu::Queue,
        physics_world: &'a PhysicsWorld,
    ) {
        for model in &self.models {
            for renderable_mesh in &model.meshes {
                let rigid_body =
                    &physics_world.rigid_body_set[renderable_mesh.mesh.rigid_body_handle];
                let pos = rigid_body.translation();
                let rot = rigid_body.rotation();
                let model_matrix = Mat4::from_translation(Vec3::new(pos.x, pos.y, pos.z))
                    * Mat4::from(rot.to_rotation_matrix().to_homogeneous());

                let model_uniform = ModelUniform {
                    model: model_matrix.into(),
                };
                queue.write_buffer(
                    &renderable_mesh.model_uniform_buffer,
                    0,
                    bytemuck::bytes_of(&model_uniform),
                );

                pass.set_bind_group(2, &renderable_mesh.model_bind_group, &[]);
                pass.set_vertex_buffer(0, renderable_mesh.mesh.vertex_buffer.slice(..));
                pass.set_index_buffer(
                    renderable_mesh.mesh.index_buffer.slice(..),
                    wgpu::IndexFormat::Uint16,
                );
                pass.draw_indexed(0..renderable_mesh.mesh.num_indices, 0, 0..1);
            }
        }
    }
}
