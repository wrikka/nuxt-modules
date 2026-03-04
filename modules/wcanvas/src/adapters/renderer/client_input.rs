//! 2D WebGPU client - input handling methods

use wasm_bindgen::prelude::*;
use crate::adapters::renderer::client::Client;

/// Input handling methods for Client
#[wasm_bindgen]
impl Client {
    /// Updates mouse state
    #[wasm_bindgen(js_name = updateMouseState)]
    pub fn update_mouse_state(
        &mut self,
        x: f32,
        y: f32,
        left_button: bool,
        middle_button: bool,
        right_button: bool,
    ) {
        self.input_state.mouse.x = x;
        self.input_state.mouse.y = y;
        self.input_state.mouse.left_button_pressed = left_button;
        self.input_state.mouse.middle_button_pressed = middle_button;
        self.input_state.mouse.right_button_pressed = right_button;
    }
}
