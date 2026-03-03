// Vertex shader
struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) color: vec3<f32>,
    @location(2) tex_coords: vec2<f32>,
}

struct GlyphInstance {
    @location(5) position: vec3<f32>,
    @location(6) uv_top_left: vec2<f32>,
    @location(7) uv_bottom_right: vec2<f32>,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(1) tex_coords: vec2<f32>,
}

struct Uniforms {
    transform: mat4x4<f32>,
}
@group(1) @binding(0)
var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(model: VertexInput, instance: GlyphInstance) -> VertexOutput {
    var out: VertexOutput;

    // Calculate the vertex position in the quad based on the instance's UV mapping
    let tex_coord_x = model.tex_coords.x * (instance.uv_bottom_right.x - instance.uv_top_left.x) + instance.uv_top_left.x;
    let tex_coord_y = model.tex_coords.y * (instance.uv_bottom_right.y - instance.uv_top_left.y) + instance.uv_top_left.y;
    out.tex_coords = vec2<f32>(tex_coord_x, tex_coord_y);

    // Calculate the world position of the glyph
    let world_position = vec4<f32>(model.position.x + instance.position.x, model.position.y + instance.position.y, instance.position.z, 1.0);

    out.clip_position = uniforms.transform * world_position;
    return out;
}

// Fragment shader
@group(0) @binding(0)
var t_diffuse: texture_2d<f32>;
@group(0) @binding(1)
var s_diffuse: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return textureSample(t_diffuse, s_diffuse, in.tex_coords);
}
