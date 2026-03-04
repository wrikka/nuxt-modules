//! 3D model format loaders (glTF, FBX)

use std::collections::HashMap;

/// Supported 3D model formats
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ModelFormat {
    Obj,
    Gltf,
    Glb,
    Fbx,
    Ply,
    Stl,
}

impl ModelFormat {
    pub fn from_extension(ext: &str) -> Option<Self> {
        match ext.to_lowercase().as_str() {
            "obj" => Some(Self::Obj),
            "gltf" => Some(Self::Gltf),
            "glb" => Some(Self::Glb),
            "fbx" => Some(Self::Fbx),
            "ply" => Some(Self::Ply),
            "stl" => Some(Self::Stl),
            _ => None,
        }
    }
}

/// 3D vertex with all attributes
#[derive(Debug, Clone, Copy)]
pub struct ModelVertex {
    pub position: [f32; 3],
    pub normal: [f32; 3],
    pub uv: [f32; 2],
    pub tangent: [f32; 4],
    pub color: [f32; 4],
    pub bone_indices: [u16; 4],
    pub bone_weights: [f32; 4],
}

impl Default for ModelVertex {
    fn default() -> Self {
        Self {
            position: [0.0; 3],
            normal: [0.0; 3],
            uv: [0.0; 2],
            tangent: [0.0; 4],
            color: [1.0; 4],
            bone_indices: [0; 4],
            bone_weights: [0.0; 4],
        }
    }
}

/// Mesh primitive (submesh)
#[derive(Debug, Clone)]
pub struct MeshPrimitive {
    pub vertices: Vec<ModelVertex>,
    pub indices: Vec<u32>,
    pub material_index: Option<usize>,
}

/// Mesh data
#[derive(Debug, Clone)]
pub struct Mesh {
    pub name: String,
    pub primitives: Vec<MeshPrimitive>,
    pub transform: [[f32; 4]; 4],
}

/// Material data
#[derive(Debug, Clone)]
pub struct Material {
    pub name: String,
    pub base_color_factor: [f32; 4],
    pub metallic_factor: f32,
    pub roughness_factor: f32,
    pub emissive_factor: [f32; 3],
    pub normal_scale: f32,
    pub occlusion_strength: f32,
    pub alpha_mode: AlphaMode,
    pub alpha_cutoff: f32,
    pub double_sided: bool,
    pub base_color_texture: Option<TextureInfo>,
    pub metallic_roughness_texture: Option<TextureInfo>,
    pub normal_texture: Option<TextureInfo>,
    pub occlusion_texture: Option<TextureInfo>,
    pub emissive_texture: Option<TextureInfo>,
}

/// Alpha blending mode
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AlphaMode {
    Opaque,
    Mask,
    Blend,
}

/// Texture reference
#[derive(Debug, Clone)]
pub struct TextureInfo {
    pub index: usize,
    pub tex_coord: u32,
}

/// Node in the scene hierarchy
#[derive(Debug, Clone)]
pub struct Node {
    pub name: String,
    pub mesh_index: Option<usize>,
    pub skin_index: Option<usize>,
    pub children: Vec<usize>,
    pub transform: [[f32; 4]; 4],
}

/// Animation sampler interpolation
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Interpolation {
    Linear,
    Step,
    CubicSpline,
}

/// Animation channel target
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AnimationTarget {
    Translation,
    Rotation,
    Scale,
    Weights,
}

/// Animation channel
#[derive(Debug, Clone)]
pub struct AnimationChannel {
    pub sampler_index: usize,
    pub target_node: usize,
    pub target_property: AnimationTarget,
}

/// Animation sampler
#[derive(Debug, Clone)]
pub struct AnimationSampler {
    pub input_times: Vec<f32>,
    pub output_values: Vec<f32>,
    pub interpolation: Interpolation,
}

/// Animation clip
#[derive(Debug, Clone)]
pub struct Animation {
    pub name: String,
    pub channels: Vec<AnimationChannel>,
    pub samplers: Vec<AnimationSampler>,
}

/// Skin/joint data for skeletal animation
#[derive(Debug, Clone)]
pub struct Skin {
    pub name: String,
    pub joints: Vec<usize>,
    pub inverse_bind_matrices: Vec<[[f32; 4]; 4]>,
}

/// Complete 3D model data
#[derive(Debug, Clone)]
pub struct Model {
    pub meshes: Vec<Mesh>,
    pub materials: Vec<Material>,
    pub nodes: Vec<Node>,
    pub animations: Vec<Animation>,
    pub skins: Vec<Skin>,
    pub textures: Vec<Vec<u8>>,
}

/// glTF loader
pub mod gltf {
    use super::*;

    pub fn load(data: &[u8]) -> Result<Model, String> {
        let gltf_data = gltf::Gltf::from_slice(data)
            .map_err(|e| format!("Failed to parse glTF: {:?}", e))?;

        let mut model = Model {
            meshes: Vec::new(),
            materials: Vec::new(),
            nodes: Vec::new(),
            animations: Vec::new(),
            skins: Vec::new(),
            textures: Vec::new(),
        };

        for mesh in gltf_data.meshes() {
            let mut mesh_data = Mesh {
                name: mesh.name().unwrap_or("unnamed").to_string(),
                primitives: Vec::new(),
                transform: identity_matrix(),
            };

            for primitive in mesh.primitives() {
                let reader = primitive.reader(|buffer| Some(&data[buffer.offset()..buffer.offset() + buffer.length()]));

                let positions: Vec<[f32; 3]> = reader.read_positions()
                    .map(|iter| iter.collect())
                    .unwrap_or_default();

                let normals: Vec<[f32; 3]> = reader.read_normals()
                    .map(|iter| iter.collect())
                    .unwrap_or_default();

                let uvs: Vec<[f32; 2]> = reader.read_tex_coords(0)
                    .map(|iter| match iter {
                        gltf::mesh::util::ReadTexCoords::U8(iter) => iter.map(|uv| [uv[0] as f32, uv[1] as f32]).collect(),
                        gltf::mesh::util::ReadTexCoords::U16(iter) => iter.map(|uv| [uv[0] as f32, uv[1] as f32]).collect(),
                        gltf::mesh::util::ReadTexCoords::F32(iter) => iter.collect(),
                    })
                    .unwrap_or_default();

                let indices: Vec<u32> = reader.read_indices()
                    .map(|iter| match iter {
                        gltf::mesh::util::ReadIndices::U8(iter) => iter.map(|i| i as u32).collect(),
                        gltf::mesh::util::ReadIndices::U16(iter) => iter.map(|i| i as u32).collect(),
                        gltf::mesh::util::ReadIndices::U32(iter) => iter.collect(),
                    })
                    .unwrap_or_default();

                let mut vertices = Vec::new();
                for i in 0..positions.len() {
                    let mut vertex = ModelVertex::default();
                    vertex.position = positions[i];
                    if i < normals.len() {
                        vertex.normal = normals[i];
                    }
                    if i < uvs.len() {
                        vertex.uv = uvs[i];
                    }
                    vertices.push(vertex);
                }

                let primitive_data = MeshPrimitive {
                    vertices,
                    indices,
                    material_index: primitive.material().index(),
                };

                mesh_data.primitives.push(primitive_data);
            }

            model.meshes.push(mesh_data);
        }

        for material in gltf_data.materials() {
            let pbr = material.pbr_metallic_roughness();

            let mat = Material {
                name: material.name().unwrap_or("unnamed").to_string(),
                base_color_factor: pbr.base_color_factor(),
                metallic_factor: pbr.metallic_factor(),
                roughness_factor: pbr.roughness_factor(),
                emissive_factor: material.emissive_factor(),
                normal_scale: material.normal_texture().map(|t| t.scale()).unwrap_or(1.0),
                occlusion_strength: material.occlusion_texture().map(|t| t.strength()).unwrap_or(1.0),
                alpha_mode: match material.alpha_mode() {
                    gltf::material::AlphaMode::Opaque => AlphaMode::Opaque,
                    gltf::material::AlphaMode::Mask => AlphaMode::Mask,
                    gltf::material::AlphaMode::Blend => AlphaMode::Blend,
                },
                alpha_cutoff: material.alpha_cutoff(),
                double_sided: material.double_sided(),
                base_color_texture: pbr.base_color_texture().map(|t| TextureInfo {
                    index: t.texture().source().index(),
                    tex_coord: t.tex_coord(),
                }),
                metallic_roughness_texture: pbr.metallic_roughness_texture().map(|t| TextureInfo {
                    index: t.texture().source().index(),
                    tex_coord: t.tex_coord(),
                }),
                normal_texture: material.normal_texture().map(|t| TextureInfo {
                    index: t.texture().source().index(),
                    tex_coord: t.tex_coord(),
                }),
                occlusion_texture: material.occlusion_texture().map(|t| TextureInfo {
                    index: t.texture().source().index(),
                    tex_coord: t.tex_coord(),
                }),
                emissive_texture: material.emissive_texture().map(|t| TextureInfo {
                    index: t.texture().source().index(),
                    tex_coord: t.tex_coord(),
                }),
            };

            model.materials.push(mat);
        }

        for node in gltf_data.nodes() {
            let transform: [[f32; 4]; 4] = match node.transform() {
                gltf::scene::Transform::Matrix { matrix } => {
                    let mut mat = [[0.0; 4]; 4];
                    for i in 0..4 {
                        for j in 0..4 {
                            mat[i][j] = matrix[i * 4 + j];
                        }
                    }
                    mat
                }
                gltf::scene::Transform::Decomposed { translation, rotation, scale } => {
                    compose_transform(translation, rotation, scale)
                }
            };

            let node_data = Node {
                name: node.name().unwrap_or("unnamed").to_string(),
                mesh_index: node.mesh().map(|m| m.index()),
                skin_index: node.skin().map(|s| s.index()),
                children: node.children().map(|c| c.index()).collect(),
                transform,
            };

            model.nodes.push(node_data);
        }

        Ok(model)
    }

    fn identity_matrix() -> [[f32; 4]; 4] {
        [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ]
    }

    fn compose_transform(translation: [f32; 3], rotation: [f32; 4], scale: [f32; 3]) -> [[f32; 4]; 4] {
        let x = rotation[0];
        let y = rotation[1];
        let z = rotation[2];
        let w = rotation[3];

        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;
        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        let mut mat = [[0.0; 4]; 4];
        mat[0][0] = (1.0 - (yy + zz)) * scale[0];
        mat[0][1] = (xy + wz) * scale[0];
        mat[0][2] = (xz - wy) * scale[0];
        mat[0][3] = 0.0;

        mat[1][0] = (xy - wz) * scale[1];
        mat[1][1] = (1.0 - (xx + zz)) * scale[1];
        mat[1][2] = (yz + wx) * scale[1];
        mat[1][3] = 0.0;

        mat[2][0] = (xz + wy) * scale[2];
        mat[2][1] = (yz - wx) * scale[2];
        mat[2][2] = (1.0 - (xx + yy)) * scale[2];
        mat[2][3] = 0.0;

        mat[3][0] = translation[0];
        mat[3][1] = translation[1];
        mat[3][2] = translation[2];
        mat[3][3] = 1.0;

        mat
    }
}

/// GLB (binary glTF) loader
pub fn load_glb(data: &[u8]) -> Result<Model, String> {
    gltf::load(data)
}

/// Unified model loader
pub fn load_model(data: &[u8], format: ModelFormat) -> Result<Model, String> {
    match format {
        ModelFormat::Gltf | ModelFormat::Glb => gltf::load(data),
        ModelFormat::Obj => load_obj(data),
        _ => Err(format!("Format {:?} not yet implemented", format)),
    }
}

/// Simple OBJ loader for fallback
fn load_obj(data: &[u8]) -> Result<Model, String> {
    let obj_str = std::str::from_utf8(data)
        .map_err(|_| "Invalid UTF-8 in OBJ file")?;

    let mut vertices: Vec<[f32; 3]> = Vec::new();
    let mut normals: Vec<[f32; 3]> = Vec::new();
    let mut uvs: Vec<[f32; 2]> = Vec::new();
    let mut indices: Vec<u32> = Vec::new();

    for line in obj_str.lines() {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.is_empty() {
            continue;
        }

        match parts[0] {
            "v" => {
                if parts.len() >= 4 {
                    vertices.push([
                        parts[1].parse().unwrap_or(0.0),
                        parts[2].parse().unwrap_or(0.0),
                        parts[3].parse().unwrap_or(0.0),
                    ]);
                }
            }
            "vn" => {
                if parts.len() >= 4 {
                    normals.push([
                        parts[1].parse().unwrap_or(0.0),
                        parts[2].parse().unwrap_or(0.0),
                        parts[3].parse().unwrap_or(0.0),
                    ]);
                }
            }
            "vt" => {
                if parts.len() >= 3 {
                    uvs.push([
                        parts[1].parse().unwrap_or(0.0),
                        parts[2].parse().unwrap_or(0.0),
                    ]);
                }
            }
            "f" => {
                for i in 1..parts.len() {
                    let face_parts: Vec<&str> = parts[i].split('/').collect();
                    if let Ok(idx) = face_parts[0].parse::<usize>() {
                        indices.push((idx - 1) as u32);
                    }
                }
            }
            _ => {}
        }
    }

    let mut model_vertices = Vec::new();
    for i in 0..vertices.len() {
        let mut v = ModelVertex::default();
        v.position = vertices[i];
        if i < normals.len() {
            v.normal = normals[i];
        }
        if i < uvs.len() {
            v.uv = uvs[i];
        }
        model_vertices.push(v);
    }

    let primitive = MeshPrimitive {
        vertices: model_vertices,
        indices,
        material_index: None,
    };

    let mesh = Mesh {
        name: "obj_mesh".to_string(),
        primitives: vec![primitive],
        transform: [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ],
    };

    Ok(Model {
        meshes: vec![mesh],
        materials: Vec::new(),
        nodes: Vec::new(),
        animations: Vec::new(),
        skins: Vec::new(),
        textures: Vec::new(),
    })
}
