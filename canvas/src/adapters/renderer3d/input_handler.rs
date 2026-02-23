use crate::input::state::InputState;

pub(crate) struct InputHandler {
    pub(crate) state: InputState,
    pub(crate) last_mouse_pos: (f32, f32),
}

impl InputHandler {
    pub(crate) fn new() -> Self {
        Self {
            state: InputState::default(),
            last_mouse_pos: (0.0, 0.0),
        }
    }

    pub(crate) fn update_mouse_state(
        &mut self,
        x: f32,
        y: f32,
        left_button: bool,
        middle_button: bool,
        right_button: bool,
    ) {
        self.state.mouse.x = x;
        self.state.mouse.y = y;
        self.state.mouse.left_button_pressed = left_button;
        self.state.mouse.middle_button_pressed = middle_button;
        self.state.mouse.right_button_pressed = right_button;
    }

    pub(crate) fn after_update(&mut self) {
        self.last_mouse_pos = (self.state.mouse.x, self.state.mouse.y);
    }
}
