//! # wcanvas - WebGPU Canvas Renderer
//!
//! A high-performance WebGPU-based canvas rendering library written in Rust
//! and compiled to WebAssembly for web applications.
//!
//! ## Features
//!
//! - **2D Rendering**: Shapes, text, textures, custom shaders
//! - **3D Rendering**: Full 3D pipeline with physics integration
//! - **Animation**: Tweening, keyframes, easing functions
//! - **Post-Processing**: Bloom, SSAO, tone mapping, FXAA
//! - **Particles**: 2D/3D particle effects
//! - **UI Components**: Buttons, sliders, inputs, panels
//! - **XR Support**: VR/AR via WebXR
//! - **Audio**: Spatial audio for 3D environments
//!
//! ## Quick Start
//!
//! ```rust
//! use wcanvas::Client;
//!
//! // Create a 2D canvas client
//! let client = Client::new(canvas_element).await?;
//! client.add_quad();
//! client.draw();
//! ```

#![cfg_attr(target_arch = "wasm32", no_std)]
#![warn(missing_docs)]
#![warn(rust_2018_idioms)]

// Global allocator for WASM targets
#[cfg(all(feature = "wee_alloc", target_arch = "wasm32"))]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// ============================================================================
// Core Modules
// ============================================================================

/// Error types and result definitions
pub mod error;

/// Core types (Size, Position, etc.)
pub mod types;

/// Constants (colors, default values)
pub mod constants;

/// Input handling (keyboard, mouse, touch)
pub mod components;

/// Telemetry and logging
pub mod telemetry;

// ============================================================================
// Rendering Adapters
// ============================================================================

/// 2D and 3D rendering adapters
pub mod adapters;

// ============================================================================
// New Feature Modules (v2.0)
// ============================================================================

/// Animation system (tweening, keyframes)
pub mod animation;

/// Asset loading and management
pub mod assets;

/// Audio system (spatial audio)
pub mod audio;

/// Debug tools and performance stats
pub mod debug;

/// 3D model format loaders (glTF, FBX, OBJ)
pub mod formats;

/// Touch and gesture input
pub mod input;

/// Material system (PBR)
pub mod materials;

/// Multi-canvas support
pub mod multicanvas;

/// Offscreen rendering (Web Workers)
pub mod offscreen;

/// Particle system (2D/3D effects)
pub mod particles;

/// Performance optimization utilities
pub mod perf;

/// High-performance rendering system
pub mod render;

/// Post-processing effects
pub mod postprocess;

/// Scene graph (hierarchical transforms)
pub mod scene;

/// UI components (buttons, sliders, etc.)
pub mod ui;

/// WebGL2 fallback
pub mod webgl;

/// XR/VR/AR support (WebXR)
pub mod xr;

/// Common imports prelude
pub mod prelude;

// ============================================================================
// Re-exports for convenience
// ============================================================================

// Core clients
pub use adapters::renderer::client::Client;
#[cfg(target_arch = "wasm32")]
pub use adapters::renderer3d::client::{create_client_3d as createClient3d, Client3d};

// Core types
pub use types::Size;

// Animation
pub use animation::{
    Animation, AnimationBuilder, AnimationClip, AnimationConfig, AnimationManager,
    AnimationState, AnimationTrack, AnimationValue, EasingFunction, Interpolation,
};

// Materials
pub use materials::{PbrMaterial, MaterialUniforms};

// Scene graph
pub use scene::{Node, NodeId, SceneGraph, Transform};

// Particles
pub use particles::{ParticleEmitter, ParticleSystem};

// UI
pub use ui::{Button, Slider, TextInput, Panel, UIElement, Anchor};

// Post-processing
pub use postprocess::{
    BloomSettings, SSAOSettings, DepthOfFieldSettings, MotionBlurSettings,
    PostProcessSettings, PostProcessStack, ToneMappingSettings,
};

// Performance
pub use perf::{
    PerformanceOptimizer, PerformanceSettings, AdaptiveQuality, QualityLevel,
    ObjectPool, DrawCallBatcher,
};

// High-performance rendering
pub use render::{
    HighPerformanceRenderer, RenderQueue, RenderCommand, RenderStats,
    CullingSystem, Frustum, BoundingBox, InstancingSystem, InstancedBatch,
    InstanceData, RenderGraph, RenderPassType,
};

// Debug
pub use debug::{
    DebugManager, DebugSettings, DebugMode, PerformanceStats,
    GPUMemoryStats, DrawCallStats, DebugConsole, LogLevel,
};

// XR
pub use xr::{
    XRSession, XRSessionConfig, XRSessionMode, XRFrame, XRPose,
    XRView, XRInputSource, XRHandedness, XRManager,
};

// Audio
pub use audio::{
    AudioMixer, AudioSource, AudioListener, AudioState,
};

// Asset management
pub use assets::{
    AssetManager, AssetHandle, AssetType, LoadRequest, LoadPriority,
    TextureAsset, MeshAsset, ShaderAsset,
};

// Multi-canvas
pub use multicanvas::{MultiCanvasManager, CanvasConfig, CanvasTarget};

// ============================================================================
// Version
// ============================================================================

/// Library version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
