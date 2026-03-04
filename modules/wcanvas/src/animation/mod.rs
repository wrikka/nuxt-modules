//! Animation system for wcanvas
//!
//! Provides tweening, easing functions, and animation management.

pub mod easing;
pub mod types;
pub mod track;
pub mod clip;
pub mod animation;
pub mod manager;
pub mod builder;
pub mod presets;

// Re-exports
pub use easing::EasingFunction;
pub use types::{AnimationValue, AnimationState, AnimationConfig, AnimationDirection, Interpolation, AnimationValues};
pub use track::AnimationTrack;
pub use clip::AnimationClip;
pub use animation::Animation;
pub use manager::AnimationManager;
pub use builder::AnimationBuilder;
