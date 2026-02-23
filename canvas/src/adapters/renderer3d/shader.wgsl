struct CameraUniform {
    view_proj: mat4x4<f32>,
}
@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct LightUniform {
    position: vec3<f32>,
    color: vec3<f32>,
}
@group(1) @binding(0)
var<uniform> light: LightUniform;

struct ModelUniform {
    model: mat4x4<f32>,
}
@group(2) @binding(0)
var<uniform> model_uniform: ModelUniform;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) color: vec3<f32>,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) world_normal: vec3<f32>,
    @location(1) world_position: vec3<f32>,
    @location(2) color: vec3<f32>,
}

@vertex
fn vs_main(model: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    let model_matrix = model_uniform.model;
    out.world_position = (model_matrix * vec4<f32>(model.position, 1.0)).xyz;
    out.world_normal = (model_matrix * vec4<f32>(model.normal, 0.0)).xyz;
    out.clip_position = camera.view_proj * vec4<f32>(out.world_position, 1.0);
    out.color = model.color;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let ambient_strength = 0.1;
    let ambient_color = light.color * ambient_strength;

    let light_dir = normalize(light.position - in.world_position);
    let normal = normalize(in.world_normal);

    let diffuse_strength = max(dot(normal, light_dir), 0.0);
    let diffuse_color = light.color * diffuse_strength;

    let result = (ambient_color + diffuse_color) * in.color;
    return vec4<f32>(result, 1.0);
}
