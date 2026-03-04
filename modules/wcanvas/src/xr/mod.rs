//! WebXR VR/AR support

use ultraviolet::{Mat4, Vec3, Quat};

/// XR session modes
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XRSessionMode {
    ImmersiveVR,
    ImmersiveAR,
    Inline,
}

/// XR reference space types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XRReferenceSpace {
    Local,
    LocalFloor,
    BoundedFloor,
    Unbounded,
    Viewer,
}

/// XR session configuration
#[derive(Debug, Clone)]
pub struct XRSessionConfig {
    pub mode: XRSessionMode,
    pub reference_space: XRReferenceSpace,
    pub required_features: Vec<String>,
    pub optional_features: Vec<String>,
    pub depth_sensing: bool,
    pub dom_overlay: bool,
    pub hand_tracking: bool,
}

impl Default for XRSessionConfig {
    fn default() -> Self {
        Self {
            mode: XRSessionMode::ImmersiveVR,
            reference_space: XRReferenceSpace::LocalFloor,
            required_features: vec!["local-floor".to_string()],
            optional_features: vec![],
            depth_sensing: false,
            dom_overlay: false,
            hand_tracking: false,
        }
    }
}

impl XRSessionConfig {
    pub fn new(mode: XRSessionMode) -> Self {
        Self {
            mode,
            ..Default::default()
        }
    }

    pub fn with_reference_space(mut self, space: XRReferenceSpace) -> Self {
        self.reference_space = space;
        self
    }

    pub fn with_required_feature(mut self, feature: impl Into<String>) -> Self {
        self.required_features.push(feature.into());
        self
    }

    pub fn with_optional_feature(mut self, feature: impl Into<String>) -> Self {
        self.optional_features.push(feature.into());
        self
    }

    pub fn with_depth_sensing(mut self, enabled: bool) -> Self {
        self.depth_sensing = enabled;
        self
    }

    pub fn with_hand_tracking(mut self, enabled: bool) -> Self {
        self.hand_tracking = enabled;
        self
    }

    pub fn vr() -> Self {
        Self::new(XRSessionMode::ImmersiveVR)
    }

    pub fn ar() -> Self {
        Self::new(XRSessionMode::ImmersiveAR)
    }
}

/// XR view data (one per eye)
#[derive(Debug, Clone, Copy)]
pub struct XRView {
    pub eye: XREye,
    pub projection_matrix: Mat4,
    pub view_matrix: Mat4,
    pub viewport: XRViewport,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XREye {
    None,
    Left,
    Right,
}

#[derive(Debug, Clone, Copy)]
pub struct XRViewport {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

/// XR pose data
#[derive(Debug, Clone, Copy)]
pub struct XRPose {
    pub position: Vec3,
    pub orientation: Quat,
    pub linear_velocity: Vec3,
    pub angular_velocity: Vec3,
    pub emulated_position: bool,
}

impl Default for XRPose {
    fn default() -> Self {
        Self {
            position: Vec3::zero(),
            orientation: Quat::identity(),
            linear_velocity: Vec3::zero(),
            angular_velocity: Vec3::zero(),
            emulated_position: false,
        }
    }
}

impl XRPose {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_transform_matrix(&self) -> Mat4 {
        Mat4::from_translation_rotation(self.position, self.orientation)
    }

    pub fn get_inverse_transform_matrix(&self) -> Mat4 {
        self.get_transform_matrix().inversed()
    }
}

/// XR input source (controller/hand)
#[derive(Debug, Clone)]
pub struct XRInputSource {
    pub handedness: XRHandedness,
    pub target_ray_mode: XRTargetRayMode,
    pub target_ray_space: XRPose,
    pub grip_space: Option<XRPose>,
    pub gamepad: Option<GamepadData>,
    pub profiles: Vec<String>,
    pub hand_data: Option<HandData>,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XRHandedness {
    None,
    Left,
    Right,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XRTargetRayMode {
    Gaze,
    TrackedPointer,
    Screen,
}

#[derive(Debug, Clone)]
pub struct GamepadData {
    pub buttons: Vec<GamepadButton>,
    pub axes: Vec<f32>,
}

#[derive(Debug, Clone, Copy)]
pub struct GamepadButton {
    pub pressed: bool,
    pub touched: bool,
    pub value: f32,
}

#[derive(Debug, Clone)]
pub struct HandData {
    pub joints: [XRJoint; 25],
    pub skeleton: Option<HandSkeleton>,
}

#[derive(Debug, Clone, Copy)]
pub struct XRJoint {
    pub position: Vec3,
    pub orientation: Quat,
    pub radius: f32,
}

#[derive(Debug, Clone)]
pub struct HandSkeleton {
    pub wrist: Vec3,
    pub thumb: [Vec3; 4],
    pub index: [Vec3; 4],
    pub middle: [Vec3; 4],
    pub ring: [Vec3; 4],
    pub pinky: [Vec3; 4],
}

impl Default for XRInputSource {
    fn default() -> Self {
        Self {
            handedness: XRHandedness::None,
            target_ray_mode: XRTargetRayMode::TrackedPointer,
            target_ray_space: XRPose::new(),
            grip_space: None,
            gamepad: None,
            profiles: Vec::new(),
            hand_data: None,
        }
    }
}

/// XR frame data
#[derive(Debug, Clone)]
pub struct XRFrame {
    pub predicted_display_time: f64,
    pub views: Vec<XRView>,
    pub viewer_pose: Option<XRPose>,
    pub input_sources: Vec<XRInputSource>,
    pub world_origin: Option<XRPose>,
}

/// XR render state
#[derive(Debug, Clone, Copy)]
pub struct XRRenderState {
    pub depth_near: f32,
    pub depth_far: f32,
    pub inline_vertical_fov: f32,
    pub base_layer: Option<()>,
}

impl Default for XRRenderState {
    fn default() -> Self {
        Self {
            depth_near: 0.1,
            depth_far: 1000.0,
            inline_vertical_fov: 60.0_f32.to_radians(),
            base_layer: None,
        }
    }
}

/// XR layer types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum XRLayerType {
    Projection,
    Cylinder,
    Equirect,
    Cube,
    Composition,
}

/// XR layer configuration
#[derive(Debug, Clone)]
pub struct XRLayer {
    pub layer_type: XRLayerType,
    pub width: u32,
    pub height: u32,
    pub depth: u32,
    pub mip_levels: u32,
}

/// XR session
#[derive(Debug)]
pub struct XRSession {
    pub config: XRSessionConfig,
    pub active: bool,
    pub render_state: XRRenderState,
    pub layers: Vec<XRLayer>,
    pub on_session_ended: Option<Box<dyn Fn() + Send>>,
    pub on_visibility_changed: Option<Box<dyn Fn(bool) + Send>>,
}

impl XRSession {
    pub fn new(config: XRSessionConfig) -> Self {
        Self {
            config,
            active: false,
            render_state: XRRenderState::default(),
            layers: Vec::new(),
            on_session_ended: None,
            on_visibility_changed: None,
        }
    }

    pub fn start(&mut self) {
        self.active = true;
    }

    pub fn end(&mut self) {
        self.active = false;
        if let Some(ref callback) = self.on_session_ended {
            callback();
        }
    }

    pub fn update_render_state(&mut self, state: XRRenderState) {
        self.render_state = state;
    }

    pub fn add_layer(&mut self, layer: XRLayer) {
        self.layers.push(layer);
    }

    pub fn on_session_ended<F: Fn() + Send + 'static>(mut self, callback: F) -> Self {
        self.on_session_ended = Some(Box::new(callback));
        self
    }

    pub fn on_visibility_changed<F: Fn(bool) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_visibility_changed = Some(Box::new(callback));
        self
    }
}

/// XR system capabilities
#[derive(Debug, Clone)]
pub struct XRCapabilities {
    pub vr_supported: bool,
    pub ar_supported: bool,
    pub inline_supported: bool,
    pub hand_tracking_supported: bool,
    pub depth_sensing_supported: bool,
    pub dom_overlay_supported: bool,
    pub layers_supported: bool,
    pub foveation_supported: bool,
}

impl Default for XRCapabilities {
    fn default() -> Self {
        Self {
            vr_supported: false,
            ar_supported: false,
            inline_supported: true,
            hand_tracking_supported: false,
            depth_sensing_supported: false,
            dom_overlay_supported: false,
            layers_supported: false,
            foveation_supported: false,
        }
    }
}

/// XR manager
#[derive(Debug)]
pub struct XRManager {
    pub capabilities: XRCapabilities,
    pub session: Option<XRSession>,
    pub last_frame: Option<XRFrame>,
}

impl Default for XRManager {
    fn default() -> Self {
        Self {
            capabilities: XRCapabilities::default(),
            session: None,
            last_frame: None,
        }
    }
}

impl XRManager {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn is_supported(&self, mode: XRSessionMode) -> bool {
        match mode {
            XRSessionMode::ImmersiveVR => self.capabilities.vr_supported,
            XRSessionMode::ImmersiveAR => self.capabilities.ar_supported,
            XRSessionMode::Inline => self.capabilities.inline_supported,
        }
    }

    pub fn request_session(&mut self, config: XRSessionConfig) -> Result<&mut XRSession, String> {
        if !self.is_supported(config.mode) {
            return Err(format!("{:?} is not supported", config.mode));
        }

        let session = XRSession::new(config);
        self.session = Some(session);
        Ok(self.session.as_mut().unwrap())
    }

    pub fn end_session(&mut self) {
        if let Some(ref mut session) = self.session {
            session.end();
        }
        self.session = None;
    }

    pub fn update_frame(&mut self, frame: XRFrame) {
        self.last_frame = Some(frame);
    }

    pub fn get_current_frame(&self) -> Option<&XRFrame> {
        self.last_frame.as_ref()
    }

    pub fn is_session_active(&self) -> bool {
        self.session.as_ref().map(|s| s.active).unwrap_or(false)
    }

    pub fn get_view_for_eye(&self, eye: XREye) -> Option<&XRView> {
        self.last_frame.as_ref()?.views.iter().find(|v| v.eye == eye)
    }

    pub fn get_left_view(&self) -> Option<&XRView> {
        self.get_view_for_eye(XREye::Left)
    }

    pub fn get_right_view(&self) -> Option<&XRView> {
        self.get_view_for_eye(XREye::Right)
    }

    pub fn get_input_source(&self, handedness: XRHandedness) -> Option<&XRInputSource> {
        self.last_frame.as_ref()?.input_sources.iter().find(|s| s.handedness == handedness)
    }

    pub fn get_left_controller(&self) -> Option<&XRInputSource> {
        self.get_input_source(XRHandedness::Left)
    }

    pub fn get_right_controller(&self) -> Option<&XRInputSource> {
        self.get_input_source(XRHandedness::Right)
    }

    pub fn get_viewer_pose(&self) -> Option<&XRPose> {
        self.last_frame.as_ref()?.viewer_pose.as_ref()
    }

    pub fn is_button_pressed(&self, handedness: XRHandedness, button_index: usize) -> bool {
        if let Some(source) = self.get_input_source(handedness) {
            if let Some(ref gamepad) = source.gamepad {
                if let Some(button) = gamepad.buttons.get(button_index) {
                    return button.pressed;
                }
            }
        }
        false
    }

    pub fn get_joystick_axis(&self, handedness: XRHandedness, axis_index: usize) -> f32 {
        if let Some(source) = self.get_input_source(handedness) {
            if let Some(ref gamepad) = source.gamepad {
                return *gamepad.axes.get(axis_index).unwrap_or(&0.0);
            }
        }
        0.0
    }

    pub fn get_joystick_2d(&self, handedness: XRHandedness) -> (f32, f32) {
        (
            self.get_joystick_axis(handedness, 0),
            self.get_joystick_axis(handedness, 1),
        )
    }
}

/// AR hit test result
#[derive(Debug, Clone, Copy)]
pub struct ARHitTestResult {
    pub position: Vec3,
    pub normal: Vec3,
    pub distance: f32,
    pub hit_matrix: Mat4,
}

/// AR plane detection
#[derive(Debug, Clone)]
pub struct ARPlane {
    pub id: u64,
    pub center: Vec3,
    pub normal: Vec3,
    pub extents: (f32, f32),
    pub vertices: Vec<Vec3>,
    pub plane_type: ARPlaneType,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ARPlaneType {
    Horizontal,
    Vertical,
    Slanted,
}

/// AR lighting estimation
#[derive(Debug, Clone, Copy)]
pub struct ARLighting {
    pub ambient_intensity: f32,
    pub ambient_color_temperature: f32,
    pub main_light_direction: Vec3,
    pub main_light_intensity: f32,
}
