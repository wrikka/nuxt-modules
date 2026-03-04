//! WebGL2 fallback for browsers without WebGPU support

use wasm_bindgen::prelude::*;
use web_sys::{WebGl2RenderingContext, HtmlCanvasElement, WebGlProgram, WebGlBuffer, WebGlTexture, WebGlFramebuffer, WebGlUniformLocation};

/// WebGL2 context wrapper
pub struct WebGLContext {
    pub gl: WebGl2RenderingContext,
    canvas: HtmlCanvasElement,
    width: u32,
    height: u32,
}

impl WebGLContext {
    pub fn new(canvas: HtmlCanvasElement) -> Result<Self, JsValue> {
        let gl = canvas
            .get_context("webgl2")?
            .ok_or_else(|| JsValue::from_str("Failed to get WebGL2 context"))?
            .dyn_into::<WebGl2RenderingContext>()?;

        let width = canvas.width();
        let height = canvas.height();

        gl.enable(WebGl2RenderingContext::DEPTH_TEST);
        gl.enable(WebGl2RenderingContext::BLEND);
        gl.blend_func(WebGl2RenderingContext::SRC_ALPHA, WebGl2RenderingContext::ONE_MINUS_SRC_ALPHA);
        gl.clear_color(0.06, 0.08, 0.10, 1.0);

        Ok(Self {
            gl,
            canvas,
            width,
            height,
        })
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
        self.canvas.set_width(width);
        self.canvas.set_height(height);
        self.gl.viewport(0, 0, width as i32, height as i32);
    }

    pub fn clear(&self) {
        self.gl.clear(WebGl2RenderingContext::COLOR_BUFFER_BIT | WebGl2RenderingContext::DEPTH_BUFFER_BIT);
    }
}

/// Shader program for WebGL2
pub struct ShaderProgram {
    pub program: WebGlProgram,
    pub uniforms: std::collections::HashMap<String, WebGlUniformLocation>,
}

impl ShaderProgram {
    pub fn new(gl: &WebGl2RenderingContext, vertex_source: &str, fragment_source: &str) -> Result<Self, JsValue> {
        let vertex_shader = Self::compile_shader(gl, WebGl2RenderingContext::VERTEX_SHADER, vertex_source)?;
        let fragment_shader = Self::compile_shader(gl, WebGl2RenderingContext::FRAGMENT_SHADER, fragment_source)?;

        let program = gl.create_program().ok_or("Unable to create shader program")?;
        gl.attach_shader(&program, &vertex_shader);
        gl.attach_shader(&program, &fragment_shader);
        gl.link_program(&program);

        if !gl.get_program_parameter(&program, WebGl2RenderingContext::LINK_STATUS)
            .as_bool()
            .unwrap_or(false)
        {
            let info = gl.get_program_info_log(&program).unwrap_or_default();
            return Err(JsValue::from_str(&format!("Shader link error: {}", info)));
        }

        let mut uniforms = std::collections::HashMap::new();
        let uniform_count = gl.get_program_parameter(&program, WebGl2RenderingContext::ACTIVE_UNIFORMS)
            .as_f64()
            .unwrap_or(0.0) as u32;

        for i in 0..uniform_count {
            if let Some(info) = gl.get_active_uniform(&program, i) {
                let name = info.name();
                if let Some(location) = gl.get_uniform_location(&program, &name) {
                    uniforms.insert(name, location);
                }
            }
        }

        gl.delete_shader(Some(&vertex_shader));
        gl.delete_shader(Some(&fragment_shader));

        Ok(Self { program, uniforms })
    }

    fn compile_shader(gl: &WebGl2RenderingContext, shader_type: u32, source: &str) -> Result<web_sys::WebGlShader, JsValue> {
        let shader = gl.create_shader(shader_type).ok_or("Unable to create shader")?;
        gl.shader_source(&shader, source);
        gl.compile_shader(&shader);

        if !gl.get_shader_parameter(&shader, WebGl2RenderingContext::COMPILE_STATUS)
            .as_bool()
            .unwrap_or(false)
        {
            let info = gl.get_shader_info_log(&shader).unwrap_or_default();
            gl.delete_shader(Some(&shader));
            return Err(JsValue::from_str(&format!("Shader compile error: {}", info)));
        }

        Ok(shader)
    }

    pub fn use_program(&self, gl: &WebGl2RenderingContext) {
        gl.use_program(Some(&self.program));
    }

    pub fn get_uniform_location(&self, name: &str) -> Option<&WebGlUniformLocation> {
        self.uniforms.get(name)
    }
}

/// Vertex buffer for WebGL2
pub struct VertexBuffer {
    pub buffer: WebGlBuffer,
    pub count: i32,
    pub vao: Option<web_sys::WebGlVertexArrayObject>,
}

impl VertexBuffer {
    pub fn new(gl: &WebGl2RenderingContext, data: &[f32], attributes: &[(u32, i32, i32, i32)]) -> Result<Self, JsValue> {
        let vao = gl.create_vertex_array();
        gl.bind_vertex_array(vao.as_ref());

        let buffer = gl.create_buffer().ok_or("Failed to create buffer")?;
        gl.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, Some(&buffer));

        unsafe {
            let view = js_sys::Float32Array::view(data);
            gl.buffer_data_with_array_buffer_view(
                WebGl2RenderingContext::ARRAY_BUFFER,
                &view,
                WebGl2RenderingContext::STATIC_DRAW,
            );
        }

        let mut stride = 0;
        for (_, size, _, _) in attributes {
            stride += size * 4;
        }

        let mut offset = 0;
        for (index, size, _type, normalized) in attributes {
            gl.vertex_attrib_pointer_with_i32(
                *index,
                *size,
                *_type,
                *normalized != 0,
                stride,
                offset,
            );
            gl.enable_vertex_attrib_array(*index);
            offset += size * 4;
        }

        gl.bind_vertex_array(None);
        gl.bind_buffer(WebGl2RenderingContext::ARRAY_BUFFER, None);

        let count = data.len() as i32 / (stride / 4);

        Ok(Self {
            buffer,
            count,
            vao,
        })
    }

    pub fn bind(&self, gl: &WebGl2RenderingContext) {
        gl.bind_vertex_array(self.vao.as_ref());
    }

    pub fn draw(&self, gl: &WebGl2RenderingContext, mode: u32) {
        gl.draw_arrays(mode, 0, self.count);
    }
}

/// Texture for WebGL2
pub struct Texture {
    pub texture: WebGlTexture,
    pub width: i32,
    pub height: i32,
}

impl Texture {
    pub fn from_image(gl: &WebGl2RenderingContext, image_data: &[u8]) -> Result<Self, JsValue> {
        let texture = gl.create_texture().ok_or("Failed to create texture")?;
        gl.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(&texture));

        let image = image::load_from_memory(image_data)
            .map_err(|e| JsValue::from_str(&format!("Image load error: {}", e)))?;

        let rgba = image.to_rgba8();
        let width = image.width() as i32;
        let height = image.height() as i32;

        gl.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array(
            WebGl2RenderingContext::TEXTURE_2D,
            0,
            WebGl2RenderingContext::RGBA as i32,
            width,
            height,
            0,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE,
            Some(&rgba.as_raw()),
        )?;

        gl.generate_mipmap(WebGl2RenderingContext::TEXTURE_2D);
        gl.tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MIN_FILTER,
            WebGl2RenderingContext::LINEAR_MIPMAP_LINEAR as i32,
        );
        gl.tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MAG_FILTER,
            WebGl2RenderingContext::LINEAR as i32,
        );

        gl.bind_texture(WebGl2RenderingContext::TEXTURE_2D, None);

        Ok(Self {
            texture,
            width,
            height,
        })
    }

    pub fn bind(&self, gl: &WebGl2RenderingContext, unit: u32) {
        gl.active_texture(WebGl2RenderingContext::TEXTURE0 + unit);
        gl.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(&self.texture));
    }
}

/// Framebuffer for offscreen rendering
pub struct Framebuffer {
    pub framebuffer: WebGlFramebuffer,
    pub texture: Texture,
    pub depth_renderbuffer: Option<web_sys::WebGlRenderbuffer>,
}

impl Framebuffer {
    pub fn new(gl: &WebGl2RenderingContext, width: i32, height: i32, with_depth: bool) -> Result<Self, JsValue> {
        let framebuffer = gl.create_framebuffer().ok_or("Failed to create framebuffer")?;
        gl.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&framebuffer));

        let texture = gl.create_texture().ok_or("Failed to create texture")?;
        gl.bind_texture(WebGl2RenderingContext::TEXTURE_2D, Some(&texture));

        gl.tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_array_buffer_view(
            WebGl2RenderingContext::TEXTURE_2D,
            0,
            WebGl2RenderingContext::RGBA as i32,
            width,
            height,
            0,
            WebGl2RenderingContext::RGBA,
            WebGl2RenderingContext::UNSIGNED_BYTE,
            None,
        )?;

        gl.tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MIN_FILTER,
            WebGl2RenderingContext::LINEAR as i32,
        );
        gl.tex_parameteri(
            WebGl2RenderingContext::TEXTURE_2D,
            WebGl2RenderingContext::TEXTURE_MAG_FILTER,
            WebGl2RenderingContext::LINEAR as i32,
        );

        gl.framebuffer_texture_2d(
            WebGl2RenderingContext::FRAMEBUFFER,
            WebGl2RenderingContext::COLOR_ATTACHMENT0,
            WebGl2RenderingContext::TEXTURE_2D,
            Some(&texture),
            0,
        );

        let depth_renderbuffer = if with_depth {
            let rb = gl.create_renderbuffer().ok_or("Failed to create renderbuffer")?;
            gl.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, Some(&rb));
            gl.renderbuffer_storage(
                WebGl2RenderingContext::RENDERBUFFER,
                WebGl2RenderingContext::DEPTH_COMPONENT16,
                width,
                height,
            );
            gl.framebuffer_renderbuffer(
                WebGl2RenderingContext::FRAMEBUFFER,
                WebGl2RenderingContext::DEPTH_ATTACHMENT,
                WebGl2RenderingContext::RENDERBUFFER,
                Some(&rb),
            );
            gl.bind_renderbuffer(WebGl2RenderingContext::RENDERBUFFER, None);
            Some(rb)
        } else {
            None
        };

        let status = gl.check_framebuffer_status(WebGl2RenderingContext::FRAMEBUFFER);
        if status != WebGl2RenderingContext::FRAMEBUFFER_COMPLETE {
            return Err(JsValue::from_str(&format!("Framebuffer incomplete: {}", status)));
        }

        gl.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);
        gl.bind_texture(WebGl2RenderingContext::TEXTURE_2D, None);

        Ok(Self {
            framebuffer,
            texture: Texture { texture, width, height },
            depth_renderbuffer,
        })
    }

    pub fn bind(&self, gl: &WebGl2RenderingContext) {
        gl.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, Some(&self.framebuffer));
        gl.viewport(0, 0, self.texture.width, self.texture.height);
    }

    pub fn unbind(gl: &WebGl2RenderingContext, width: i32, height: i32) {
        gl.bind_framebuffer(WebGl2RenderingContext::FRAMEBUFFER, None);
        gl.viewport(0, 0, width, height);
    }
}

/// Standard vertex shader for 2D rendering
pub const VERTEX_SHADER_2D: &str = r#"#version 300 es
in vec2 a_position;
in vec2 a_texcoord;
in vec4 a_color;

uniform mat3 u_transform;
uniform mat3 u_projection;

out vec2 v_texcoord;
out vec4 v_color;

void main() {
    vec3 pos = u_projection * u_transform * vec3(a_position, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
    v_color = a_color;
}
"#;

/// Standard fragment shader for 2D rendering
pub const FRAGMENT_SHADER_2D: &str = r#"#version 300 es
precision mediump float;

in vec2 v_texcoord;
in vec4 v_color;

uniform sampler2D u_texture;
uniform float u_opacity;
uniform int u_use_texture;

out vec4 fragColor;

void main() {
    vec4 color = v_color;
    if (u_use_texture == 1) {
        color = texture(u_texture, v_texcoord) * v_color;
    }
    fragColor = vec4(color.rgb, color.a * u_opacity);
}
"#;

/// Vertex shader for 3D rendering
pub const VERTEX_SHADER_3D: &str = r#"#version 300 es
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texcoord;
in vec4 a_color;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat3 u_normal_matrix;

out vec3 v_position;
out vec3 v_normal;
out vec2 v_texcoord;
out vec4 v_color;

void main() {
    vec4 world_pos = u_model * vec4(a_position, 1.0);
    v_position = world_pos.xyz;
    v_normal = normalize(u_normal_matrix * a_normal);
    v_texcoord = a_texcoord;
    v_color = a_color;
    gl_Position = u_projection * u_view * world_pos;
}
"#;

/// Fragment shader for 3D rendering with basic lighting
pub const FRAGMENT_SHADER_3D: &str = r#"#version 300 es
precision mediump float;

in vec3 v_position;
in vec3 v_normal;
in vec2 v_texcoord;
in vec4 v_color;

uniform sampler2D u_texture;
uniform vec3 u_light_position;
uniform vec3 u_light_color;
uniform vec3 u_ambient_color;
uniform vec3 u_camera_position;
uniform float u_shininess;
uniform int u_use_texture;

out vec4 fragColor;

void main() {
    vec3 color = v_color.rgb;
    if (u_use_texture == 1) {
        color = texture(u_texture, v_texcoord).rgb * v_color.rgb;
    }
    
    vec3 ambient = u_ambient_color * color;
    
    vec3 light_dir = normalize(u_light_position - v_position);
    float diff = max(dot(v_normal, light_dir), 0.0);
    vec3 diffuse = u_light_color * diff * color;
    
    vec3 view_dir = normalize(u_camera_position - v_position);
    vec3 reflect_dir = reflect(-light_dir, v_normal);
    float spec = pow(max(dot(view_dir, reflect_dir), 0.0), u_shininess);
    vec3 specular = u_light_color * spec * 0.5;
    
    vec3 result = ambient + diffuse + specular;
    fragColor = vec4(result, v_color.a);
}
"#;
