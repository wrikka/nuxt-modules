//! Touch and gesture support for mobile interactions

use std::collections::HashMap;
use std::time::{Duration, Instant};

/// Touch state
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TouchState {
    Idle,
    Touching,
    Moving,
    Released,
    Cancelled,
}

/// Single touch point data
#[derive(Debug, Clone, Copy)]
pub struct TouchPoint {
    pub id: i32,
    pub x: f32,
    pub y: f32,
    pub start_x: f32,
    pub start_y: f32,
    pub start_time: Instant,
    pub pressure: f32,
    pub radius: f32,
}

impl TouchPoint {
    pub fn new(id: i32, x: f32, y: f32) -> Self {
        Self {
            id,
            x,
            y,
            start_x: x,
            start_y: y,
            start_time: Instant::now(),
            pressure: 1.0,
            radius: 0.0,
        }
    }

    pub fn delta(&self) -> (f32, f32) {
        (self.x - self.start_x, self.y - self.start_y)
    }

    pub fn distance(&self) -> f32 {
        let dx = self.x - self.start_x;
        let dy = self.y - self.start_y;
        (dx * dx + dy * dy).sqrt()
    }

    pub fn duration(&self) -> Duration {
        self.start_time.elapsed()
    }
}

/// Gesture types
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GestureType {
    Tap,
    DoubleTap,
    LongPress,
    SwipeLeft,
    SwipeRight,
    SwipeUp,
    SwipeDown,
    Pinch,
    Rotate,
    Pan,
}

/// Gesture event data
#[derive(Debug, Clone)]
pub struct GestureEvent {
    pub gesture_type: GestureType,
    pub x: f32,
    pub y: f32,
    pub delta_x: f32,
    pub delta_y: f32,
    pub scale: f32,
    pub rotation: f32,
    pub velocity: f32,
    pub touch_count: usize,
}

/// Gesture recognizer configuration
#[derive(Debug, Clone)]
pub struct GestureConfig {
    pub tap_max_distance: f32,
    pub tap_max_duration_ms: u64,
    pub long_press_min_duration_ms: u64,
    pub swipe_min_velocity: f32,
    pub swipe_min_distance: f32,
    pub double_tap_interval_ms: u64,
    pub pinch_threshold: f32,
    pub rotate_threshold: f32,
}

impl Default for GestureConfig {
    fn default() -> Self {
        Self {
            tap_max_distance: 20.0,
            tap_max_duration_ms: 300,
            long_press_min_duration_ms: 500,
            swipe_min_velocity: 50.0,
            swipe_min_distance: 50.0,
            double_tap_interval_ms: 300,
            pinch_threshold: 0.1,
            rotate_threshold: 5.0,
        }
    }
}

/// Gesture recognizer
pub struct GestureRecognizer {
    config: GestureConfig,
    touches: HashMap<i32, TouchPoint>,
    last_tap_time: Option<Instant>,
    last_tap_position: Option<(f32, f32)>,
    long_press_timer: Option<Instant>,
    active_gesture: Option<GestureType>,
    on_gesture: Option<Box<dyn Fn(&GestureEvent) + Send>>,
}

impl GestureRecognizer {
    pub fn new(config: GestureConfig) -> Self {
        Self {
            config,
            touches: HashMap::new(),
            last_tap_time: None,
            last_tap_position: None,
            long_press_timer: None,
            active_gesture: None,
            on_gesture: None,
        }
    }

    pub fn on_gesture<F: Fn(&GestureEvent) + Send + 'static>(&mut self, callback: F) {
        self.on_gesture = Some(Box::new(callback));
    }

    pub fn touch_start(&mut self, id: i32, x: f32, y: f32) {
        let touch = TouchPoint::new(id, x, y);
        self.touches.insert(id, touch);

        if self.touches.len() == 1 {
            self.long_press_timer = Some(Instant::now());
        } else {
            self.long_press_timer = None;
        }

        self.active_gesture = None;
    }

    pub fn touch_move(&mut self, id: i32, x: f32, y: f32, pressure: f32, radius: f32) {
        if let Some(touch) = self.touches.get_mut(&id) {
            touch.x = x;
            touch.y = y;
            touch.pressure = pressure;
            touch.radius = radius;
        }

        match self.touches.len() {
            1 => self.handle_single_touch_move(),
            2 => self.handle_multi_touch_move(),
            _ => {}
        }
    }

    pub fn touch_end(&mut self, id: i32) {
        if let Some(touch) = self.touches.remove(&id) {
            if self.touches.is_empty() {
                self.handle_touch_end(&touch);
            }
        }
    }

    pub fn touch_cancel(&mut self, id: i32) {
        self.touches.remove(&id);
        self.long_press_timer = None;
        self.active_gesture = None;
    }

    fn handle_single_touch_move(&mut self) {
        if let Some(touch) = self.touches.values().next() {
            let distance = touch.distance();

            if distance > self.config.tap_max_distance {
                self.long_press_timer = None;
            }

            if self.active_gesture == Some(GestureType::Pan) || distance > self.config.tap_max_distance {
                self.active_gesture = Some(GestureType::Pan);

                let (dx, dy) = touch.delta();

                if let Some(ref callback) = self.on_gesture {
                    callback(&GestureEvent {
                        gesture_type: GestureType::Pan,
                        x: touch.x,
                        y: touch.y,
                        delta_x: dx,
                        delta_y: dy,
                        scale: 1.0,
                        rotation: 0.0,
                        velocity: 0.0,
                        touch_count: 1,
                    });
                }
            }
        }
    }

    fn handle_multi_touch_move(&mut self) {
        let touches: Vec<&TouchPoint> = self.touches.values().collect();
        if touches.len() != 2 {
            return;
        }

        let touch1 = touches[0];
        let touch2 = touches[1];

        let current_distance = ((touch1.x - touch2.x).powi(2) + (touch1.y - touch2.y).powi(2)).sqrt();
        let initial_distance = ((touch1.start_x - touch2.start_x).powi(2) + (touch1.start_y - touch2.start_y).powi(2)).sqrt();

        if initial_distance > 0.0 {
            let scale = current_distance / initial_distance;
            let scale_delta = (scale - 1.0).abs();

            if scale_delta > self.config.pinch_threshold {
                self.active_gesture = Some(GestureType::Pinch);

                let center_x = (touch1.x + touch2.x) / 2.0;
                let center_y = (touch1.y + touch2.y) / 2.0;

                if let Some(ref callback) = self.on_gesture {
                    callback(&GestureEvent {
                        gesture_type: GestureType::Pinch,
                        x: center_x,
                        y: center_y,
                        delta_x: 0.0,
                        delta_y: 0.0,
                        scale,
                        rotation: 0.0,
                        velocity: 0.0,
                        touch_count: 2,
                    });
                }
            }
        }
    }

    fn handle_touch_end(&mut self, touch: &TouchPoint) {
        let duration = touch.duration();
        let distance = touch.distance();
        let (dx, dy) = touch.delta();

        let velocity_x = if duration.as_secs_f32() > 0.0 {
            dx / duration.as_secs_f32()
        } else {
            0.0
        };
        let velocity_y = if duration.as_secs_f32() > 0.0 {
            dy / duration.as_secs_f32()
        } else {
            0.0
        };
        let velocity = (velocity_x.powi(2) + velocity_y.powi(2)).sqrt();

        if duration.as_millis() < self.config.tap_max_duration_ms as u128
            && distance < self.config.tap_max_distance
        {
            let now = Instant::now();
            let is_double_tap = self.last_tap_time.map_or(false, |last| {
                now.duration_since(last).as_millis() < self.config.double_tap_interval_ms as u128
            });

            let is_same_position = self.last_tap_position.map_or(false, |(lx, ly)| {
                let dist = ((touch.x - lx).powi(2) + (touch.y - ly).powi(2)).sqrt();
                dist < self.config.tap_max_distance
            });

            if is_double_tap && is_same_position {
                self.emit_gesture(GestureType::DoubleTap, touch.x, touch.y);
                self.last_tap_time = None;
                self.last_tap_position = None;
            } else {
                self.emit_gesture(GestureType::Tap, touch.x, touch.y);
                self.last_tap_time = Some(now);
                self.last_tap_position = Some((touch.x, touch.y));
            }
        } else if velocity > self.config.swipe_min_velocity || distance > self.config.swipe_min_distance {
            let abs_dx = dx.abs();
            let abs_dy = dy.abs();

            if abs_dx > abs_dy {
                if dx > 0.0 {
                    self.emit_gesture_with_velocity(GestureType::SwipeRight, touch.x, touch.y, velocity, dx, dy);
                } else {
                    self.emit_gesture_with_velocity(GestureType::SwipeLeft, touch.x, touch.y, velocity, dx, dy);
                }
            } else {
                if dy > 0.0 {
                    self.emit_gesture_with_velocity(GestureType::SwipeDown, touch.x, touch.y, velocity, dx, dy);
                } else {
                    self.emit_gesture_with_velocity(GestureType::SwipeUp, touch.x, touch.y, velocity, dx, dy);
                }
            }
        }

        self.long_press_timer = None;
        self.active_gesture = None;
    }

    fn emit_gesture(&self, gesture_type: GestureType, x: f32, y: f32) {
        if let Some(ref callback) = self.on_gesture {
            callback(&GestureEvent {
                gesture_type,
                x,
                y,
                delta_x: 0.0,
                delta_y: 0.0,
                scale: 1.0,
                rotation: 0.0,
                velocity: 0.0,
                touch_count: 1,
            });
        }
    }

    fn emit_gesture_with_velocity(&self, gesture_type: GestureType, x: f32, y: f32, velocity: f32, dx: f32, dy: f32) {
        if let Some(ref callback) = self.on_gesture {
            callback(&GestureEvent {
                gesture_type,
                x,
                y,
                delta_x: dx,
                delta_y: dy,
                scale: 1.0,
                rotation: 0.0,
                velocity,
                touch_count: 1,
            });
        }
    }

    pub fn update(&mut self) {
        if self.touches.len() == 1 {
            if let Some(timer) = self.long_press_timer {
                if timer.elapsed().as_millis() > self.config.long_press_min_duration_ms as u128 {
                    if let Some(touch) = self.touches.values().next() {
                        if touch.distance() < self.config.tap_max_distance {
                            self.emit_gesture(GestureType::LongPress, touch.x, touch.y);
                        }
                    }
                    self.long_press_timer = None;
                }
            }
        }
    }

    pub fn active_touch_count(&self) -> usize {
        self.touches.len()
    }

    pub fn is_touching(&self) -> bool {
        !self.touches.is_empty()
    }

    pub fn active_gesture(&self) -> Option<GestureType> {
        self.active_gesture
    }

    pub fn clear(&mut self) {
        self.touches.clear();
        self.long_press_timer = None;
        self.active_gesture = None;
    }
}

impl Default for GestureRecognizer {
    fn default() -> Self {
        Self::new(GestureConfig::default())
    }
}

/// Touch event helper for wasm_bindgen
#[cfg(target_arch = "wasm32")]
pub mod wasm {
    use super::*;
    use wasm_bindgen::prelude::*;
    use web_sys::TouchEvent;

    pub fn parse_touch_event(event: &TouchEvent) -> Vec<(i32, f32, f32, f32, f32)> {
        let touches = event.touches();
        let mut result = Vec::new();

        for i in 0..touches.length() {
            if let Some(touch) = touches.get(i) {
                result.push((
                    touch.identifier(),
                    touch.client_x() as f32,
                    touch.client_y() as f32,
                    touch.force() as f32,
                    touch.radius_x() as f32,
                ));
            }
        }

        result
    }
}
