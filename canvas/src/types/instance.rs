use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub struct InstanceData {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}
