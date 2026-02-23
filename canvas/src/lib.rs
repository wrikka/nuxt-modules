//! # Canvas WebGPU Library
//!
//! A WebGPU-based canvas renderer built with Rust and compiled to WebAssembly.
//! Provides high-performance rendering for web applications.

#[cfg(all(feature = "wee_alloc", target_arch = "wasm32"))]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod adapters;

#[path = "types/mod.rs"]
mod types;

mod error;

#[path = "constants/mod.rs"]
mod constants;

mod components;
mod telemetry;

pub use crate::adapters::renderer::client::Client;
#[cfg(target_arch = "wasm32")]
pub use crate::adapters::renderer3d::client::create_client_3d as createClient3d;
#[cfg(target_arch = "wasm32")]
pub use crate::adapters::renderer3d::client::Client3d;
pub use crate::types::Size;
