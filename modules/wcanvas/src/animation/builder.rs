//! Builder for creating animations fluently

use crate::animation::types::{AnimationConfig, AnimationDirection, EasingFunction};
use crate::animation::clip::AnimationClip;
use crate::animation::animation::Animation;
use crate::animation::track::AnimationTrack;

/// Builder for creating animations fluently
pub struct AnimationBuilder {
    clip: AnimationClip,
    config: AnimationConfig,
}

impl AnimationBuilder {
    /// Create new builder with name and duration
    pub fn new(name: impl Into<String>, duration: f32) -> Self {
        Self {
            clip: AnimationClip::new(name, duration),
            config: AnimationConfig::default(),
        }
    }

    /// Set duration in milliseconds
    pub fn with_duration(mut self, duration_ms: u64) -> Self {
        self.config.duration_ms = duration_ms;
        self.clip.duration = duration_ms as f32 / 1000.0;
        self
    }

    /// Set delay in milliseconds
    pub fn with_delay(mut self, delay_ms: u64) -> Self {
        self.config.delay_ms = delay_ms;
        self
    }

    /// Set easing function
    pub fn with_easing(mut self, easing: EasingFunction) -> Self {
        self.config.easing = easing;
        self
    }

    /// Set loop count
    pub fn loop_count(mut self, count: u32) -> Self {
        self.config.loop_count = Some(count);
        self
    }

    /// Loop forever
    pub fn loop_forever(mut self) -> Self {
        self.config.loop_count = None;
        self
    }

    /// Set direction
    pub fn with_direction(mut self, direction: AnimationDirection) -> Self {
        self.config.direction = direction;
        self
    }

    /// Set auto_start
    pub fn auto_start(mut self, auto_start: bool) -> Self {
        self.config.auto_start = auto_start;
        self
    }

    /// Add track
    pub fn add_track(mut self, track: AnimationTrack) -> Self {
        self.clip.tracks.push(track);
        self
    }

    /// Build animation
    pub fn build(self) -> Animation {
        Animation::new(self.clip, self.config)
    }
}
