//! Animation clip containing multiple tracks

use std::collections::HashMap;
use crate::animation::types::{AnimationValue, AnimationValues};
use crate::animation::track::AnimationTrack;

/// Animation clip containing multiple tracks
#[derive(Debug)]
pub struct AnimationClip {
    pub name: String,
    pub duration: f32,
    pub tracks: Vec<AnimationTrack>,
}

impl AnimationClip {
    /// Create new clip with name and duration
    pub fn new(name: impl Into<String>, duration: f32) -> Self {
        Self {
            name: name.into(),
            duration,
            tracks: Vec::new(),
        }
    }

    /// Add track (builder pattern)
    pub fn add_track(mut self, track: AnimationTrack) -> Self {
        self.tracks.push(track);
        self
    }

    /// Sample all tracks at time
    pub fn sample(&self, time: f32) -> AnimationValues {
        let mut result = HashMap::new();
        let clamped_time = time.clamp(0.0, self.duration);

        for track in &self.tracks {
            if let Some(value) = track.sample(clamped_time) {
                result.insert(track.property.clone(), value);
            }
        }

        result
    }
}
