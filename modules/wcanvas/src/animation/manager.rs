//! Animation manager for handling multiple animations

use std::collections::HashMap;
use crate::animation::animation::Animation;
use crate::animation::types::AnimationState;

/// Animation manager for handling multiple animations
#[derive(Debug)]
pub struct AnimationManager {
    animations: HashMap<String, Animation>,
    time_scale: f32,
}

impl AnimationManager {
    /// Create new empty manager
    pub fn new() -> Self {
        Self {
            animations: HashMap::new(),
            time_scale: 1.0,
        }
    }

    /// Add animation with id
    pub fn add_animation(&mut self, id: impl Into<String>, animation: Animation) {
        self.animations.insert(id.into(), animation);
    }

    /// Remove animation by id
    pub fn remove_animation(&mut self, id: &str) {
        self.animations.remove(id);
    }

    /// Get mutable animation reference
    pub fn get_animation(&mut self, id: &str) -> Option<&mut Animation> {
        self.animations.get_mut(id)
    }

    /// Start animation by id
    pub fn play(&mut self, id: &str) {
        if let Some(anim) = self.animations.get_mut(id) {
            anim.start();
        }
    }

    /// Pause animation by id
    pub fn pause(&mut self, id: &str) {
        if let Some(anim) = self.animations.get_mut(id) {
            anim.pause();
        }
    }

    /// Resume animation by id
    pub fn resume(&mut self, id: &str) {
        if let Some(anim) = self.animations.get_mut(id) {
            anim.resume();
        }
    }

    /// Stop animation by id
    pub fn stop(&mut self, id: &str) {
        if let Some(anim) = self.animations.get_mut(id) {
            anim.stop();
        }
    }

    /// Stop all animations
    pub fn stop_all(&mut self) {
        for anim in self.animations.values_mut() {
            anim.stop();
        }
    }

    /// Update all animations
    pub fn update(&mut self, delta_ms: f32) {
        let scaled_delta = delta_ms * self.time_scale;
        for anim in self.animations.values_mut() {
            anim.update(scaled_delta);
        }
    }

    /// Set global time scale
    pub fn set_time_scale(&mut self, scale: f32) {
        self.time_scale = scale.max(0.0);
    }

    /// Check if animation is playing
    pub fn is_playing(&self, id: &str) -> bool {
        self.animations
            .get(id)
            .map(|a| a.state == AnimationState::Playing)
            .unwrap_or(false)
    }

    /// Check if animation is completed
    pub fn is_completed(&self, id: &str) -> bool {
        self.animations
            .get(id)
            .map(|a| a.state == AnimationState::Completed)
            .unwrap_or(false)
    }
}

impl Default for AnimationManager {
    fn default() -> Self {
        Self::new()
    }
}
