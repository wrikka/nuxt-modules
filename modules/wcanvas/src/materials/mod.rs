//! PBR Material system for realistic rendering

/// PBR material properties
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct PbrMaterial {
    pub base_color: [f32; 4],
    pub metallic: f32,
    pub roughness: f32,
    pub emissive: [f32; 3],
    pub emissive_intensity: f32,
    pub specular: f32,
    pub specular_tint: f32,
    pub sheen: f32,
    pub sheen_tint: [f32; 3],
    pub clearcoat: f32,
    pub clearcoat_roughness: f32,
    pub ior: f32,
    pub transmission: f32,
    pub thickness: f32,
    pub attenuation_color: [f32; 3],
    pub attenuation_distance: f32,
    pub subsurface: f32,
    pub anisotropic: f32,
    pub anisotropic_direction: [f32; 3],
}

impl Default for PbrMaterial {
    fn default() -> Self {
        Self {
            base_color: [1.0, 1.0, 1.0, 1.0],
            metallic: 0.0,
            roughness: 0.5,
            emissive: [0.0, 0.0, 0.0],
            emissive_intensity: 1.0,
            specular: 0.5,
            specular_tint: 0.0,
            sheen: 0.0,
            sheen_tint: [0.5, 0.5, 0.5],
            clearcoat: 0.0,
            clearcoat_roughness: 0.03,
            ior: 1.5,
            transmission: 0.0,
            thickness: 0.0,
            attenuation_color: [1.0, 1.0, 1.0],
            attenuation_distance: std::f32::INFINITY,
            subsurface: 0.0,
            anisotropic: 0.0,
            anisotropic_direction: [1.0, 0.0, 0.0],
        }
    }
}

impl PbrMaterial {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_base_color(mut self, r: f32, g: f32, b: f32, a: f32) -> Self {
        self.base_color = [r, g, b, a];
        self
    }

    pub fn with_metallic(mut self, metallic: f32) -> Self {
        self.metallic = metallic.clamp(0.0, 1.0);
        self
    }

    pub fn with_roughness(mut self, roughness: f32) -> Self {
        self.roughness = roughness.clamp(0.0, 1.0);
        self
    }

    pub fn with_emissive(mut self, r: f32, g: f32, b: f32, intensity: f32) -> Self {
        self.emissive = [r, g, b];
        self.emissive_intensity = intensity;
        self
    }

    pub fn with_clearcoat(mut self, clearcoat: f32, roughness: f32) -> Self {
        self.clearcoat = clearcoat.clamp(0.0, 1.0);
        self.clearcoat_roughness = roughness.clamp(0.0, 1.0);
        self
    }

    pub fn with_transmission(mut self, transmission: f32, ior: f32, thickness: f32) -> Self {
        self.transmission = transmission.clamp(0.0, 1.0);
        self.ior = ior;
        self.thickness = thickness;
        self
    }

    pub fn with_subsurface(mut self, subsurface: f32) -> Self {
        self.subsurface = subsurface.clamp(0.0, 1.0);
        self
    }

    pub fn with_anisotropic(mut self, anisotropic: f32, dx: f32, dy: f32, dz: f32) -> Self {
        self.anisotropic = anisotropic.clamp(0.0, 1.0);
        self.anisotropic_direction = [dx, dy, dz];
        self
    }

    /// Preset: Plastic
    pub fn plastic() -> Self {
        Self::default()
            .with_metallic(0.0)
            .with_roughness(0.1)
    }

    /// Preset: Metal
    pub fn metal() -> Self {
        Self::default()
            .with_metallic(1.0)
            .with_roughness(0.2)
    }

    /// Preset: Gold
    pub fn gold() -> Self {
        Self::default()
            .with_base_color(1.0, 0.78, 0.34, 1.0)
            .with_metallic(1.0)
            .with_roughness(0.1)
    }

    /// Preset: Silver
    pub fn silver() -> Self {
        Self::default()
            .with_base_color(0.97, 0.96, 0.91, 1.0)
            .with_metallic(1.0)
            .with_roughness(0.1)
    }

    /// Preset: Copper
    pub fn copper() -> Self {
        Self::default()
            .with_base_color(0.96, 0.64, 0.38, 1.0)
            .with_metallic(1.0)
            .with_roughness(0.15)
    }

    /// Preset: Iron
    pub fn iron() -> Self {
        Self::default()
            .with_base_color(0.77, 0.78, 0.78, 1.0)
            .with_metallic(1.0)
            .with_roughness(0.4)
    }

    /// Preset: Glass
    pub fn glass() -> Self {
        Self::default()
            .with_metallic(0.0)
            .with_roughness(0.0)
            .with_transmission(1.0, 1.5, 0.0)
    }

    /// Preset: Water
    pub fn water() -> Self {
        Self::default()
            .with_base_color(0.0, 0.3, 0.8, 0.7)
            .with_metallic(0.0)
            .with_roughness(0.0)
            .with_transmission(0.8, 1.33, 0.0)
    }

    /// Preset: Diamond
    pub fn diamond() -> Self {
        Self::default()
            .with_metallic(0.0)
            .with_roughness(0.0)
            .with_transmission(1.0, 2.42, 0.0)
    }

    /// Preset: Rubber
    pub fn rubber() -> Self {
        Self::default()
            .with_metallic(0.0)
            .with_roughness(0.9)
    }

    /// Preset: Concrete
    pub fn concrete() -> Self {
        Self::default()
            .with_base_color(0.63, 0.63, 0.63, 1.0)
            .with_metallic(0.0)
            .with_roughness(0.9)
    }

    /// Preset: Wood
    pub fn wood() -> Self {
        Self::default()
            .with_base_color(0.55, 0.27, 0.07, 1.0)
            .with_metallic(0.0)
            .with_roughness(0.6)
    }

    /// Preset: Fabric
    pub fn fabric() -> Self {
        Self::default()
            .with_metallic(0.0)
            .with_roughness(1.0)
            .with_sheen(1.0, 0.5, 0.5, 0.5)
    }

    /// Preset: Velvet
    pub fn velvet() -> Self {
        Self::default()
            .with_base_color(0.5, 0.0, 0.1, 1.0)
            .with_metallic(0.0)
            .with_roughness(1.0)
            .with_sheen(1.0, 0.8, 0.2, 0.2)
    }

    /// Preset: Chrome
    pub fn chrome() -> Self {
        Self::default()
            .with_base_color(0.95, 0.95, 0.95, 1.0)
            .with_metallic(1.0)
            .with_roughness(0.05)
    }

    fn with_sheen(mut self, sheen: f32, r: f32, g: f32, b: f32) -> Self {
        self.sheen = sheen;
        self.sheen_tint = [r, g, b];
        self
    }
}

/// Texture maps for PBR material
#[derive(Debug, Clone)]
pub struct MaterialTextures {
    pub base_color: Option<Vec<u8>>,
    pub metallic_roughness: Option<Vec<u8>>,
    pub normal: Option<Vec<u8>>,
    pub emissive: Option<Vec<u8>>,
    pub occlusion: Option<Vec<u8>>,
    pub sheen: Option<Vec<u8>>,
    pub clearcoat: Option<Vec<u8>>,
    pub transmission: Option<Vec<u8>>,
    pub subsurface: Option<Vec<u8>>,
}

impl Default for MaterialTextures {
    fn default() -> Self {
        Self {
            base_color: None,
            metallic_roughness: None,
            normal: None,
            emissive: None,
            occlusion: None,
            sheen: None,
            clearcoat: None,
            transmission: None,
            subsurface: None,
        }
    }
}

/// Material uniform data for shaders
#[repr(C)]
#[derive(Debug, Clone, Copy, bytemuck::Pod, bytemuck::Zeroable)]
pub struct MaterialUniforms {
    pub base_color: [f32; 4],
    pub metallic_roughness_emissive: [f32; 4],
    pub emissive_color: [f32; 4],
    pub specular_sheen_clearcoat: [f32; 4],
    pub transmission_ior: [f32; 4],
    pub subsurface_anisotropic: [f32; 4],
    pub texture_flags: [u32; 4],
}

impl From<&PbrMaterial> for MaterialUniforms {
    fn from(mat: &PbrMaterial) -> Self {
        Self {
            base_color: mat.base_color,
            metallic_roughness_emissive: [
                mat.metallic,
                mat.roughness,
                mat.emissive_intensity,
                mat.specular,
            ],
            emissive_color: [
                mat.emissive[0],
                mat.emissive[1],
                mat.emissive[2],
                1.0,
            ],
            specular_sheen_clearcoat: [
                mat.specular_tint,
                mat.sheen,
                mat.clearcoat,
                mat.clearcoat_roughness,
            ],
            transmission_ior: [
                mat.transmission,
                mat.ior,
                mat.thickness,
                mat.attenuation_distance,
            ],
            subsurface_anisotropic: [
                mat.subsurface,
                mat.anisotropic,
                0.0,
                0.0,
            ],
            texture_flags: [0; 4],
        }
    }
}
