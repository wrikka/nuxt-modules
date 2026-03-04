//! Animation presets for common effects

use crate::animation::builder::AnimationBuilder;
use crate::animation::track::AnimationTrack;
use crate::animation::types::{AnimationValue, EasingFunction};

/// Fade in animation
pub fn fade_in(duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("fade_in", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("opacity")
                .add_keyframe(0.0, AnimationValue::Float(0.0))
                .add_keyframe(1.0, AnimationValue::Float(1.0))
                .with_easing(EasingFunction::EaseOut),
        )
}

/// Fade out animation
pub fn fade_out(duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("fade_out", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("opacity")
                .add_keyframe(0.0, AnimationValue::Float(1.0))
                .add_keyframe(1.0, AnimationValue::Float(0.0))
                .with_easing(EasingFunction::EaseIn),
        )
}

/// Move to position
pub fn move_to(x: f32, y: f32, duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("move_to", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("position")
                .add_keyframe(0.0, AnimationValue::Vec2([0.0, 0.0]))
                .add_keyframe(1.0, AnimationValue::Vec2([x, y]))
                .with_easing(EasingFunction::EaseInOut),
        )
}

/// Scale to size
pub fn scale_to(scale_x: f32, scale_y: f32, duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("scale_to", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("scale")
                .add_keyframe(0.0, AnimationValue::Vec2([1.0, 1.0]))
                .add_keyframe(1.0, AnimationValue::Vec2([scale_x, scale_y]))
                .with_easing(EasingFunction::EaseOut),
        )
}

/// Rotate to angle
pub fn rotate_to(angle_degrees: f32, duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("rotate_to", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("rotation")
                .add_keyframe(0.0, AnimationValue::Float(0.0))
                .add_keyframe(1.0, AnimationValue::Float(angle_degrees))
                .with_easing(EasingFunction::EaseInOut),
        )
}

/// Bounce in effect
pub fn bounce_in(duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("bounce_in", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("scale")
                .add_keyframe(0.0, AnimationValue::Vec2([0.0, 0.0]))
                .add_keyframe(0.6, AnimationValue::Vec2([1.1, 1.1]))
                .add_keyframe(0.8, AnimationValue::Vec2([0.95, 0.95]))
                .add_keyframe(1.0, AnimationValue::Vec2([1.0, 1.0]))
                .with_easing(EasingFunction::EaseOut),
        )
        .add_track(
            AnimationTrack::new("opacity")
                .add_keyframe(0.0, AnimationValue::Float(0.0))
                .add_keyframe(0.3, AnimationValue::Float(1.0))
                .with_easing(EasingFunction::EaseOut),
        )
}

/// Pulse animation
pub fn pulse(duration_ms: u64) -> AnimationBuilder {
    AnimationBuilder::new("pulse", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("scale")
                .add_keyframe(0.0, AnimationValue::Vec2([1.0, 1.0]))
                .add_keyframe(0.5, AnimationValue::Vec2([1.1, 1.1]))
                .add_keyframe(1.0, AnimationValue::Vec2([1.0, 1.0]))
                .with_easing(EasingFunction::EaseInOut),
        )
        .loop_forever()
}

/// Shake effect
pub fn shake(duration_ms: u64, intensity: f32) -> AnimationBuilder {
    AnimationBuilder::new("shake", duration_ms as f32 / 1000.0)
        .add_track(
            AnimationTrack::new("position")
                .add_keyframe(0.0, AnimationValue::Vec2([0.0, 0.0]))
                .add_keyframe(0.1, AnimationValue::Vec2([intensity, 0.0]))
                .add_keyframe(0.2, AnimationValue::Vec2([-intensity, 0.0]))
                .add_keyframe(0.3, AnimationValue::Vec2([intensity, 0.0]))
                .add_keyframe(0.4, AnimationValue::Vec2([-intensity, 0.0]))
                .add_keyframe(0.5, AnimationValue::Vec2([intensity * 0.5, 0.0]))
                .add_keyframe(0.6, AnimationValue::Vec2([-intensity * 0.5, 0.0]))
                .add_keyframe(0.7, AnimationValue::Vec2([intensity * 0.3, 0.0]))
                .add_keyframe(0.8, AnimationValue::Vec2([-intensity * 0.3, 0.0]))
                .add_keyframe(0.9, AnimationValue::Vec2([intensity * 0.1, 0.0]))
                .add_keyframe(1.0, AnimationValue::Vec2([0.0, 0.0]))
                .with_easing(EasingFunction::Linear),
        )
}
