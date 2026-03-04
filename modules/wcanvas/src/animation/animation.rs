//! Active animation instance

use std::time::Instant;
use crate::animation::types::{AnimationConfig, AnimationState, AnimationValues, OnCompleteCallback, OnUpdateCallback};
use crate::animation::clip::AnimationClip;

/// Active animation instance
#[derive(Debug)]
pub struct Animation {
    pub clip: AnimationClip,
    pub config: AnimationConfig,
    pub state: AnimationState,
    pub current_time: f32,
    pub loop_counter: u32,
    pub start_time: Option<Instant>,
    pub pause_time: Option<Instant>,
    pub on_complete: OnCompleteCallback,
    pub on_update: OnUpdateCallback,
}

impl Animation {
    /// Create new animation from clip and config
    pub fn new(clip: AnimationClip, config: AnimationConfig) -> Self {
        let mut anim = Self {
            clip,
            config,
            state: AnimationState::Idle,
            current_time: 0.0,
            loop_counter: 0,
            start_time: None,
            pause_time: None,
            on_complete: None,
            on_update: None,
        };

        if config.auto_start {
            anim.start();
        }

        anim
    }

    /// Start animation
    pub fn start(&mut self) {
        self.state = AnimationState::Playing;
        self.start_time = Some(Instant::now());
        self.current_time = 0.0;
        self.loop_counter = 0;
    }

    /// Pause animation
    pub fn pause(&mut self) {
        if self.state == AnimationState::Playing {
            self.state = AnimationState::Paused;
            self.pause_time = Some(Instant::now());
        }
    }

    /// Resume animation
    pub fn resume(&mut self) {
        if self.state == AnimationState::Paused {
            self.state = AnimationState::Playing;
            if let Some(pause_time) = self.pause_time {
                if let Some(ref mut start_time) = self.start_time {
                    *start_time += pause_time.elapsed();
                }
                self.pause_time = None;
            }
        }
    }

    /// Stop animation
    pub fn stop(&mut self) {
        self.state = AnimationState::Idle;
        self.current_time = 0.0;
        self.start_time = None;
        self.pause_time = None;
    }

    /// Update animation by delta time
    pub fn update(&mut self, delta_ms: f32) -> AnimationValues {
        if self.state != AnimationState::Playing {
            return self.clip.sample(self.current_time);
        }

        let duration = self.clip.duration;
        let new_time = self.current_time + delta_ms / 1000.0;

        if new_time >= duration {
            match self.config.loop_count {
                None => {
                    self.current_time = duration;
                    self.state = AnimationState::Completed;
                    if let Some(callback) = self.on_complete.take() {
                        callback();
                    }
                }
                Some(count) if self.loop_counter >= count - 1 => {
                    self.current_time = duration;
                    self.state = AnimationState::Completed;
                    if let Some(callback) = self.on_complete.take() {
                        callback();
                    }
                }
                _ => {
                    self.current_time = new_time % duration;
                    self.loop_counter += 1;
                }
            }
        } else {
            self.current_time = new_time;
        }

        let values = self.clip.sample(self.current_time);

        if let Some(ref callback) = self.on_update {
            callback(self.current_time, &values);
        }

        values
    }

    /// Set on_complete callback
    pub fn on_complete<F: FnOnce() + Send + 'static>(mut self, callback: F) -> Self {
        self.on_complete = Some(Box::new(callback));
        self
    }

    /// Set on_update callback
    pub fn on_update<F: Fn(f32, &AnimationValues) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_update = Some(Box::new(callback));
        self
    }
}
