//! Animation track for single property

use crate::animation::types::{AnimationValue, EasingFunction};

/// Animation track for a single property
#[derive(Debug)]
pub struct AnimationTrack {
    pub property: String,
    pub keyframes: Vec<(f32, AnimationValue)>,
    pub easing: EasingFunction,
}

impl AnimationTrack {
    /// Create new track for property
    pub fn new(property: impl Into<String>) -> Self {
        Self {
            property: property.into(),
            keyframes: Vec::new(),
            easing: EasingFunction::Linear,
        }
    }

    /// Add keyframe at time (builder pattern)
    pub fn add_keyframe(mut self, time: f32, value: AnimationValue) -> Self {
        self.keyframes.push((time, value));
        self.keyframes.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());
        self
    }

    /// Set easing function
    pub fn with_easing(mut self, easing: EasingFunction) -> Self {
        self.easing = easing;
        self
    }

    /// Sample value at time
    pub fn sample(&self, time: f32) -> Option<AnimationValue> {
        if self.keyframes.is_empty() {
            return None;
        }

        if time <= self.keyframes[0].0 {
            return Some(self.keyframes[0].1.clone());
        }

        let last = self.keyframes.last().unwrap();
        if time >= last.0 {
            return Some(last.1.clone());
        }

        for i in 0..self.keyframes.len() - 1 {
            let (t1, v1) = &self.keyframes[i];
            let (t2, v2) = &self.keyframes[i + 1];

            if time >= *t1 && time <= *t2 {
                let local_t = (time - t1) / (t2 - t1);
                let eased_t = self.easing.apply(local_t);
                return Some(v1.lerp(v2, eased_t));
            }
        }

        None
    }
}

impl Default for AnimationTrack {
    fn default() -> Self {
        Self::new("property")
    }
}
