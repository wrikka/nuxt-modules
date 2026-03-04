//! Animation types and enums

use std::collections::HashMap;
use std::time::Instant;

pub use crate::animation::easing::EasingFunction;

/// Animation interpolation type
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Interpolation {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
    Bounce,
    Elastic,
    Back,
}

/// Animation state
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AnimationState {
    Idle,
    Playing,
    Paused,
    Completed,
}

/// Animation direction
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AnimationDirection {
    Forward,
    Reverse,
    Alternate,
}

/// Animation configuration
#[derive(Debug, Clone)]
pub struct AnimationConfig {
    pub duration_ms: u64,
    pub delay_ms: u64,
    pub easing: EasingFunction,
    pub loop_count: Option<u32>,
    pub direction: AnimationDirection,
    pub auto_start: bool,
}

impl Default for AnimationConfig {
    fn default() -> Self {
        Self {
            duration_ms: 1000,
            delay_ms: 0,
            easing: EasingFunction::Linear,
            loop_count: None,
            direction: AnimationDirection::Forward,
            auto_start: true,
        }
    }
}

/// Animation value for different types
#[derive(Debug, Clone)]
pub enum AnimationValue {
    Float(f32),
    Vec2([f32; 2]),
    Vec3([f32; 3]),
    Vec4([f32; 4]),
    Color([f32; 4]),
}

impl AnimationValue {
    pub fn lerp(&self, other: &Self, t: f32) -> Self {
        match (self, other) {
            (Self::Float(a), Self::Float(b)) => Self::Float(a + (b - a) * t),
            (Self::Vec2(a), Self::Vec2(b)) => Self::Vec2([
                a[0] + (b[0] - a[0]) * t,
                a[1] + (b[1] - a[1]) * t,
            ]),
            (Self::Vec3(a), Self::Vec3(b)) => Self::Vec3([
                a[0] + (b[0] - a[0]) * t,
                a[1] + (b[1] - a[1]) * t,
                a[2] + (b[2] - a[2]) * t,
            ]),
            (Self::Vec4(a), Self::Vec4(b)) => Self::Vec4([
                a[0] + (b[0] - a[0]) * t,
                a[1] + (b[1] - a[1]) * t,
                a[2] + (b[2] - a[2]) * t,
                a[3] + (b[3] - a[3]) * t,
            ]),
            (Self::Color(a), Self::Color(b)) => Self::Color([
                a[0] + (b[0] - a[0]) * t,
                a[1] + (b[1] - a[1]) * t,
                a[2] + (b[2] - a[2]) * t,
                a[3] + (b[3] - a[3]) * t,
            ]),
            _ => self.clone(),
        }
    }
}

/// Animation update callback data
pub type AnimationValues = HashMap<String, AnimationValue>;

/// Callback when animation updates
pub type OnUpdateCallback = Option<Box<dyn Fn(f32, &AnimationValues) + Send>>;

/// Callback when animation completes
pub type OnCompleteCallback = Option<Box<dyn FnOnce() + Send>>;
