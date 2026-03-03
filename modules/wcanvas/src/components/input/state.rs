#[derive(Debug, Default, Clone, Copy)]
#[allow(dead_code)]
pub struct MouseState {
    pub x: f32,
    pub y: f32,
    pub left_button_pressed: bool,
    pub middle_button_pressed: bool,
    pub right_button_pressed: bool,
}

#[derive(Debug, Default, Clone, Copy)]
#[allow(dead_code)]
pub struct InputState {
    pub mouse: MouseState,
}
