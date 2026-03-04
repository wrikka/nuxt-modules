//! Post-processing effects (Bloom, SSAO, etc.)

/// Post-processing effect types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PostProcessEffect {
    None,
    Bloom,
    SSAO,
    DepthOfField,
    MotionBlur,
    ChromaticAberration,
    Vignette,
    ColorGrading,
    ToneMapping,
    FXAA,
    SMAA,
    Outline,
    Cartoon,
    Fog,
    SSR,
    GodRays,
}

/// Bloom effect settings
#[derive(Debug, Clone, Copy)]
pub struct BloomSettings {
    pub enabled: bool,
    pub intensity: f32,
    pub threshold: f32,
    pub radius: f32,
    pub iterations: u32,
}

impl Default for BloomSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            intensity: 0.5,
            threshold: 0.8,
            radius: 0.5,
            iterations: 4,
        }
    }
}

impl BloomSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_intensity(mut self, intensity: f32) -> Self {
        self.intensity = intensity;
        self
    }

    pub fn with_threshold(mut self, threshold: f32) -> Self {
        self.threshold = threshold;
        self
    }

    pub fn with_radius(mut self, radius: f32) -> Self {
        self.radius = radius;
        self
    }

    pub fn with_iterations(mut self, iterations: u32) -> Self {
        self.iterations = iterations;
        self
    }
}

/// SSAO (Screen Space Ambient Occlusion) settings
#[derive(Debug, Clone, Copy)]
pub struct SSAOSettings {
    pub enabled: bool,
    pub radius: f32,
    pub bias: f32,
    pub intensity: f32,
    pub blur_radius: u32,
    pub sample_count: u32,
}

impl Default for SSAOSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            radius: 0.5,
            bias: 0.025,
            intensity: 1.5,
            blur_radius: 2,
            sample_count: 16,
        }
    }
}

impl SSAOSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_radius(mut self, radius: f32) -> Self {
        self.radius = radius;
        self
    }

    pub fn with_bias(mut self, bias: f32) -> Self {
        self.bias = bias;
        self
    }

    pub fn with_intensity(mut self, intensity: f32) -> Self {
        self.intensity = intensity;
        self
    }
}

/// Depth of Field settings
#[derive(Debug, Clone, Copy)]
pub struct DepthOfFieldSettings {
    pub enabled: bool,
    pub focal_distance: f32,
    pub focal_range: f32,
    pub bokeh_radius: f32,
    pub bokeh_quality: u32,
}

impl Default for DepthOfFieldSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            focal_distance: 10.0,
            focal_range: 5.0,
            bokeh_radius: 10.0,
            bokeh_quality: 16,
        }
    }
}

impl DepthOfFieldSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_focal_distance(mut self, distance: f32) -> Self {
        self.focal_distance = distance;
        self
    }

    pub fn with_focal_range(mut self, range: f32) -> Self {
        self.focal_range = range;
        self
    }
}

/// Motion Blur settings
#[derive(Debug, Clone, Copy)]
pub struct MotionBlurSettings {
    pub enabled: bool,
    pub intensity: f32,
    pub sample_count: u32,
    pub max_velocity: f32,
}

impl Default for MotionBlurSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            intensity: 0.5,
            sample_count: 8,
            max_velocity: 20.0,
        }
    }
}

impl MotionBlurSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_intensity(mut self, intensity: f32) -> Self {
        self.intensity = intensity.clamp(0.0, 1.0);
        self
    }
}

/// Chromatic Aberration settings
#[derive(Debug, Clone, Copy)]
pub struct ChromaticAberrationSettings {
    pub enabled: bool,
    pub intensity: f32,
}

impl Default for ChromaticAberrationSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            intensity: 0.05,
        }
    }
}

/// Vignette settings
#[derive(Debug, Clone, Copy)]
pub struct VignetteSettings {
    pub enabled: bool,
    pub intensity: f32,
    pub smoothness: f32,
    pub color: [f32; 3],
}

impl Default for VignetteSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            intensity: 0.5,
            smoothness: 0.5,
            color: [0.0, 0.0, 0.0],
        }
    }
}

impl VignetteSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_intensity(mut self, intensity: f32) -> Self {
        self.intensity = intensity;
        self
    }

    pub fn with_color(mut self, r: f32, g: f32, b: f32) -> Self {
        self.color = [r, g, b];
        self
    }
}

/// Color Grading settings
#[derive(Debug, Clone, Copy)]
pub struct ColorGradingSettings {
    pub enabled: bool,
    pub saturation: f32,
    pub contrast: f32,
    pub brightness: f32,
    pub temperature: f32,
    pub tint: f32,
    pub lift: [f32; 3],
    pub gamma: [f32; 3],
    pub gain: [f32; 3],
}

impl Default for ColorGradingSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            saturation: 1.0,
            contrast: 1.0,
            brightness: 0.0,
            temperature: 0.0,
            tint: 0.0,
            lift: [0.0, 0.0, 0.0],
            gamma: [1.0, 1.0, 1.0],
            gain: [1.0, 1.0, 1.0],
        }
    }
}

impl ColorGradingSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_saturation(mut self, saturation: f32) -> Self {
        self.saturation = saturation;
        self
    }

    pub fn with_contrast(mut self, contrast: f32) -> Self {
        self.contrast = contrast;
        self
    }

    pub fn with_brightness(mut self, brightness: f32) -> Self {
        self.brightness = brightness;
        self
    }
}

/// Tone Mapping modes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ToneMappingMode {
    None,
    Reinhard,
    ReinhardExtended,
    ACES,
    Filmic,
    Uncharted2,
    AGX,
}

/// Tone Mapping settings
#[derive(Debug, Clone, Copy)]
pub struct ToneMappingSettings {
    pub enabled: bool,
    pub mode: ToneMappingMode,
    pub exposure: f32,
    pub white_point: f32,
}

impl Default for ToneMappingSettings {
    fn default() -> Self {
        Self {
            enabled: true,
            mode: ToneMappingMode::ACES,
            exposure: 1.0,
            white_point: 1.0,
        }
    }
}

impl ToneMappingSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_mode(mut self, mode: ToneMappingMode) -> Self {
        self.mode = mode;
        self
    }

    pub fn with_exposure(mut self, exposure: f32) -> Self {
        self.exposure = exposure;
        self
    }
}

/// FXAA settings
#[derive(Debug, Clone, Copy)]
pub struct FXAASettings {
    pub enabled: bool,
    pub quality: u32,
    pub threshold: f32,
    pub threshold_min: f32,
}

impl Default for FXAASettings {
    fn default() -> Self {
        Self {
            enabled: true,
            quality: 12,
            threshold: 0.166,
            threshold_min: 0.0833,
        }
    }
}

/// Outline effect settings
#[derive(Debug, Clone, Copy)]
pub struct OutlineSettings {
    pub enabled: bool,
    pub color: [f32; 3],
    pub thickness: f32,
    pub threshold: f32,
    pub depth_based: bool,
}

impl Default for OutlineSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            color: [0.0, 0.0, 0.0],
            thickness: 1.0,
            threshold: 0.1,
            depth_based: true,
        }
    }
}

/// Cartoon/Cel-shading settings
#[derive(Debug, Clone, Copy)]
pub struct CartoonSettings {
    pub enabled: bool,
    pub color_levels: u32,
    pub outline_enabled: bool,
    pub shading_steps: u32,
}

impl Default for CartoonSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            color_levels: 4,
            outline_enabled: true,
            shading_steps: 3,
        }
    }
}

/// Fog settings
#[derive(Debug, Clone, Copy)]
pub struct FogSettings {
    pub enabled: bool,
    pub mode: FogMode,
    pub color: [f32; 3],
    pub density: f32,
    pub start_distance: f32,
    pub end_distance: f32,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum FogMode {
    Linear,
    Exponential,
    ExponentialSquared,
}

impl Default for FogSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            mode: FogMode::Exponential,
            color: [0.5, 0.6, 0.7],
            density: 0.01,
            start_distance: 10.0,
            end_distance: 100.0,
        }
    }
}

/// SSR (Screen Space Reflections) settings
#[derive(Debug, Clone, Copy)]
pub struct SSRSettings {
    pub enabled: bool,
    pub max_steps: u32,
    pub step_size: f32,
    pub max_distance: f32,
    pub thickness: f32,
    pub fade_distance: f32,
}

impl Default for SSRSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            max_steps: 64,
            step_size: 0.1,
            max_distance: 100.0,
            thickness: 0.5,
            fade_distance: 10.0,
        }
    }
}

/// God Rays settings
#[derive(Debug, Clone, Copy)]
pub struct GodRaysSettings {
    pub enabled: bool,
    pub intensity: f32,
    pub decay: f32,
    pub density: f32,
    pub weight: f32,
    pub samples: u32,
}

impl Default for GodRaysSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            intensity: 0.5,
            decay: 0.95,
            density: 0.5,
            weight: 0.5,
            samples: 64,
        }
    }
}

/// Complete post-process settings
#[derive(Debug, Clone, Copy)]
pub struct PostProcessSettings {
    pub bloom: BloomSettings,
    pub ssao: SSAOSettings,
    pub depth_of_field: DepthOfFieldSettings,
    pub motion_blur: MotionBlurSettings,
    pub chromatic_aberration: ChromaticAberrationSettings,
    pub vignette: VignetteSettings,
    pub color_grading: ColorGradingSettings,
    pub tone_mapping: ToneMappingSettings,
    pub fxaa: FXAASettings,
    pub outline: OutlineSettings,
    pub cartoon: CartoonSettings,
    pub fog: FogSettings,
    pub ssr: SSRSettings,
    pub god_rays: GodRaysSettings,
}

impl Default for PostProcessSettings {
    fn default() -> Self {
        Self {
            bloom: BloomSettings::new(),
            ssao: SSAOSettings::new(),
            depth_of_field: DepthOfFieldSettings::new(),
            motion_blur: MotionBlurSettings::new(),
            chromatic_aberration: ChromaticAberrationSettings::default(),
            vignette: VignetteSettings::new(),
            color_grading: ColorGradingSettings::new(),
            tone_mapping: ToneMappingSettings::new(),
            fxaa: FXAASettings::default(),
            outline: OutlineSettings::default(),
            cartoon: CartoonSettings::default(),
            fog: FogSettings::default(),
            ssr: SSRSettings::default(),
            god_rays: GodRaysSettings::default(),
        }
    }
}

impl PostProcessSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn disable_all(&mut self) {
        self.bloom.enabled = false;
        self.ssao.enabled = false;
        self.depth_of_field.enabled = false;
        self.motion_blur.enabled = false;
        self.chromatic_aberration.enabled = false;
        self.vignette.enabled = false;
        self.color_grading.enabled = false;
        self.fxaa.enabled = false;
        self.outline.enabled = false;
        self.cartoon.enabled = false;
        self.fog.enabled = false;
        self.ssr.enabled = false;
        self.god_rays.enabled = false;
    }

    pub fn preset_performance(&mut self) {
        self.bloom.enabled = true;
        self.bloom.iterations = 2;
        self.ssao.enabled = false;
        self.depth_of_field.enabled = false;
        self.motion_blur.enabled = false;
        self.fxaa.enabled = true;
        self.tone_mapping.enabled = true;
    }

    pub fn preset_quality(&mut self) {
        self.bloom.enabled = true;
        self.bloom.iterations = 4;
        self.ssao.enabled = true;
        self.ssao.sample_count = 32;
        self.fxaa.enabled = true;
        self.tone_mapping.enabled = true;
        self.vignette.enabled = true;
    }

    pub fn preset_ultra(&mut self) {
        self.bloom.enabled = true;
        self.bloom.iterations = 6;
        self.ssao.enabled = true;
        self.ssao.sample_count = 64;
        self.ssr.enabled = true;
        self.depth_of_field.enabled = true;
        self.fxaa.enabled = true;
        self.tone_mapping.enabled = true;
        self.color_grading.enabled = true;
        self.vignette.enabled = true;
    }
}

/// Post-process effect stack
#[derive(Debug)]
pub struct PostProcessStack {
    pub settings: PostProcessSettings,
    pub enabled_effects: Vec<PostProcessEffect>,
}

impl Default for PostProcessStack {
    fn default() -> Self {
        Self {
            settings: PostProcessSettings::new(),
            enabled_effects: vec![
                PostProcessEffect::Bloom,
                PostProcessEffect::ToneMapping,
            ],
        }
    }
}

impl PostProcessStack {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn enable(&mut self, effect: PostProcessEffect) {
        if !self.enabled_effects.contains(&effect) {
            self.enabled_effects.push(effect);
        }
    }

    pub fn disable(&mut self, effect: PostProcessEffect) {
        self.enabled_effects.retain(|&e| e != effect);
    }

    pub fn toggle(&mut self, effect: PostProcessEffect) {
        if self.enabled_effects.contains(&effect) {
            self.disable(effect);
        } else {
            self.enable(effect);
        }
    }

    pub fn is_enabled(&self, effect: PostProcessEffect) -> bool {
        self.enabled_effects.contains(&effect)
    }

    pub fn clear(&mut self) {
        self.enabled_effects.clear();
    }
}
