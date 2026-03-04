//! wcanvas prelude - common imports for convenience

// Core types
pub use crate::types::{Size, Position, Color};

// Core clients
pub use crate::adapters::renderer::client::Client;
#[cfg(target_arch = "wasm32")]
pub use crate::adapters::renderer3d::client::Client3d;

// Math types from ultraviolet
pub use ultraviolet::{Vec2, Vec3, Vec4, Mat3, Mat4, Quat};

// Error handling
pub use crate::error::{CanvasError, Result};

// Animation
pub use crate::animation::{
    Animation, AnimationBuilder, AnimationClip, AnimationConfig,
    AnimationManager, AnimationState, AnimationTrack, AnimationValue,
    EasingFunction, Interpolation,
};

// Materials
pub use crate::materials::{PbrMaterial, MaterialUniforms};

// Scene graph
pub use crate::scene::{Node, NodeId, SceneGraph, Transform};

// Particles
pub use crate::particles::{ParticleEmitter, ParticleSystem};

// UI
pub use crate::ui::{Button, Slider, TextInput, Panel, UIElement, Anchor};

// Performance
pub use crate::perf::{
    PerformanceOptimizer, PerformanceSettings, AdaptiveQuality, QualityLevel,
    ObjectPool, DrawCallBatcher,
};

// Debug
pub use crate::debug::{
    DebugManager, DebugSettings, DebugMode, PerformanceStats,
    GPUMemoryStats, DrawCallStats, DebugConsole, LogLevel,
};

// Render
pub use crate::render::{
    HighPerformanceRenderer, RenderQueue, RenderCommand, RenderStats,
    CullingSystem, Frustum, BoundingBox, InstancingSystem,
};
