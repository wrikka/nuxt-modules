//! UI Components for canvas rendering

use ultraviolet::{Vec2, Vec4};

/// UI anchor points
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Anchor {
    TopLeft,
    TopCenter,
    TopRight,
    MiddleLeft,
    MiddleCenter,
    MiddleRight,
    BottomLeft,
    BottomCenter,
    BottomRight,
}

impl Anchor {
    pub fn get_offset(&self) -> Vec2 {
        match self {
            Self::TopLeft => Vec2::new(0.0, 0.0),
            Self::TopCenter => Vec2::new(0.5, 0.0),
            Self::TopRight => Vec2::new(1.0, 0.0),
            Self::MiddleLeft => Vec2::new(0.0, 0.5),
            Self::MiddleCenter => Vec2::new(0.5, 0.5),
            Self::MiddleRight => Vec2::new(1.0, 0.5),
            Self::BottomLeft => Vec2::new(0.0, 1.0),
            Self::BottomCenter => Vec2::new(0.5, 1.0),
            Self::BottomRight => Vec2::new(1.0, 1.0),
        }
    }
}

/// UI element base
#[derive(Debug, Clone)]
pub struct UIElement {
    pub id: u64,
    pub position: Vec2,
    pub size: Vec2,
    pub anchor: Anchor,
    pub pivot: Vec2,
    pub rotation: f32,
    pub scale: Vec2,
    pub color: Vec4,
    pub background_color: Vec4,
    pub border_color: Vec4,
    pub border_width: f32,
    pub border_radius: f32,
    pub visible: bool,
    pub interactable: bool,
    pub opacity: f32,
    pub z_index: i32,
}

impl Default for UIElement {
    fn default() -> Self {
        Self {
            id: 0,
            position: Vec2::zero(),
            size: Vec2::new(100.0, 100.0),
            anchor: Anchor::MiddleCenter,
            pivot: Vec2::new(0.5, 0.5),
            rotation: 0.0,
            scale: Vec2::one(),
            color: Vec4::one(),
            background_color: Vec4::new(0.2, 0.2, 0.2, 1.0),
            border_color: Vec4::new(0.5, 0.5, 0.5, 1.0),
            border_width: 0.0,
            border_radius: 0.0,
            visible: true,
            interactable: true,
            opacity: 1.0,
            z_index: 0,
        }
    }
}

impl UIElement {
    pub fn new(id: u64) -> Self {
        Self {
            id,
            ..Default::default()
        }
    }

    pub fn with_position(mut self, x: f32, y: f32) -> Self {
        self.position = Vec2::new(x, y);
        self
    }

    pub fn with_size(mut self, width: f32, height: f32) -> Self {
        self.size = Vec2::new(width, height);
        self
    }

    pub fn with_anchor(mut self, anchor: Anchor) -> Self {
        self.anchor = anchor;
        self
    }

    pub fn with_background_color(mut self, r: f32, g: f32, b: f32, a: f32) -> Self {
        self.background_color = Vec4::new(r, g, b, a);
        self
    }

    pub fn get_bounds(&self, screen_width: f32, screen_height: f32) -> (f32, f32, f32, f32) {
        let anchor_offset = self.anchor.get_offset();
        let anchored_x = anchor_offset.x * screen_width + self.position.x;
        let anchored_y = anchor_offset.y * screen_height + self.position.y;

        let x = anchored_x - self.size.x * self.pivot.x;
        let y = anchored_y - self.size.y * self.pivot.y;

        (x, y, self.size.x, self.size.y)
    }

    pub fn contains_point(&self, point: Vec2, screen_width: f32, screen_height: f32) -> bool {
        let (x, y, w, h) = self.get_bounds(screen_width, screen_height);
        point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h
    }
}

/// Button component
#[derive(Debug, Clone)]
pub struct Button {
    pub element: UIElement,
    pub text: String,
    pub font_size: f32,
    pub text_color: Vec4,
    pub hover_color: Vec4,
    pub pressed_color: Vec4,
    pub disabled_color: Vec4,
    pub is_pressed: bool,
    pub is_hovered: bool,
    pub is_disabled: bool,
    pub on_click: Option<Box<dyn Fn() + Send>>,
}

impl Default for Button {
    fn default() -> Self {
        Self {
            element: UIElement::new(0),
            text: String::new(),
            font_size: 16.0,
            text_color: Vec4::one(),
            hover_color: Vec4::new(0.3, 0.3, 0.3, 1.0),
            pressed_color: Vec4::new(0.1, 0.1, 0.1, 1.0),
            disabled_color: Vec4::new(0.5, 0.5, 0.5, 0.5),
            is_pressed: false,
            is_hovered: false,
            is_disabled: false,
            on_click: None,
        }
    }
}

impl Button {
    pub fn new(id: u64, text: impl Into<String>) -> Self {
        Self {
            element: UIElement::new(id).with_size(120.0, 40.0),
            text: text.into(),
            ..Default::default()
        }
    }

    pub fn with_colors(
        mut self,
        normal: Vec4,
        hover: Vec4,
        pressed: Vec4,
    ) -> Self {
        self.element.background_color = normal;
        self.hover_color = hover;
        self.pressed_color = pressed;
        self
    }

    pub fn on_click<F: Fn() + Send + 'static>(mut self, callback: F) -> Self {
        self.on_click = Some(Box::new(callback));
        self
    }

    pub fn trigger_click(&self) {
        if !self.is_disabled {
            if let Some(ref callback) = self.on_click {
                callback();
            }
        }
    }

    pub fn get_current_color(&self) -> Vec4 {
        if self.is_disabled {
            self.disabled_color
        } else if self.is_pressed {
            self.pressed_color
        } else if self.is_hovered {
            self.hover_color
        } else {
            self.element.background_color
        }
    }
}

/// Slider component
#[derive(Debug, Clone)]
pub struct Slider {
    pub element: UIElement,
    pub min: f32,
    pub max: f32,
    pub value: f32,
    pub step: f32,
    pub handle_size: Vec2,
    pub handle_color: Vec4,
    pub fill_color: Vec4,
    pub is_dragging: bool,
    pub on_value_changed: Option<Box<dyn Fn(f32) + Send>>,
}

impl Default for Slider {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(200.0, 20.0),
            min: 0.0,
            max: 1.0,
            value: 0.5,
            step: 0.01,
            handle_size: Vec2::new(20.0, 30.0),
            handle_color: Vec4::new(0.8, 0.8, 0.8, 1.0),
            fill_color: Vec4::new(0.2, 0.6, 1.0, 1.0),
            is_dragging: false,
            on_value_changed: None,
        }
    }
}

impl Slider {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(200.0, 20.0),
            ..Default::default()
        }
    }

    pub fn with_range(mut self, min: f32, max: f32) -> Self {
        self.min = min;
        self.max = max;
        self
    }

    pub fn with_value(mut self, value: f32) -> Self {
        self.value = value.clamp(self.min, self.max);
        self
    }

    pub fn with_step(mut self, step: f32) -> Self {
        self.step = step;
        self
    }

    pub fn on_value_changed<F: Fn(f32) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_value_changed = Some(Box::new(callback));
        self
    }

    pub fn set_value(&mut self, value: f32) {
        let old_value = self.value;
        self.value = value.clamp(self.min, self.max);

        if self.step > 0.0 {
            let steps = ((self.value - self.min) / self.step).round();
            self.value = self.min + steps * self.step;
        }

        if (self.value - old_value).abs() > f32::EPSILON {
            if let Some(ref callback) = self.on_value_changed {
                callback(self.value);
            }
        }
    }

    pub fn get_fill_percentage(&self) -> f32 {
        (self.value - self.min) / (self.max - self.min)
    }

    pub fn handle_input(&mut self, mouse_x: f32, screen_width: f32, screen_height: f32) {
        let (x, _, w, _) = self.element.get_bounds(screen_width, screen_height);
        let normalized = ((mouse_x - x) / w).clamp(0.0, 1.0);
        let new_value = self.min + normalized * (self.max - self.min);
        self.set_value(new_value);
    }
}

/// Text input component
#[derive(Debug, Clone)]
pub struct TextInput {
    pub element: UIElement,
    pub text: String,
    pub placeholder: String,
    pub max_length: usize,
    pub font_size: f32,
    pub text_color: Vec4,
    pub placeholder_color: Vec4,
    pub cursor_position: usize,
    pub is_focused: bool,
    pub is_password: bool,
    pub on_text_changed: Option<Box<dyn Fn(&str) + Send>>,
    pub on_submit: Option<Box<dyn Fn(&str) + Send>>,
}

impl Default for TextInput {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(200.0, 40.0),
            text: String::new(),
            placeholder: String::new(),
            max_length: 100,
            font_size: 16.0,
            text_color: Vec4::one(),
            placeholder_color: Vec4::new(0.5, 0.5, 0.5, 1.0),
            cursor_position: 0,
            is_focused: false,
            is_password: false,
            on_text_changed: None,
            on_submit: None,
        }
    }
}

impl TextInput {
    pub fn new(id: u64, placeholder: impl Into<String>) -> Self {
        Self {
            element: UIElement::new(id).with_size(200.0, 40.0),
            placeholder: placeholder.into(),
            ..Default::default()
        }
    }

    pub fn with_max_length(mut self, length: usize) -> Self {
        self.max_length = length;
        self
    }

    pub fn as_password(mut self) -> Self {
        self.is_password = true;
        self
    }

    pub fn on_text_changed<F: Fn(&str) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_text_changed = Some(Box::new(callback));
        self
    }

    pub fn on_submit<F: Fn(&str) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_submit = Some(Box::new(callback));
        self
    }

    pub fn insert_char(&mut self, c: char) {
        if self.text.len() < self.max_length {
            self.text.insert(self.cursor_position, c);
            self.cursor_position += 1;
            self.notify_changed();
        }
    }

    pub fn backspace(&mut self) {
        if self.cursor_position > 0 {
            self.cursor_position -= 1;
            self.text.remove(self.cursor_position);
            self.notify_changed();
        }
    }

    pub fn delete(&mut self) {
        if self.cursor_position < self.text.len() {
            self.text.remove(self.cursor_position);
            self.notify_changed();
        }
    }

    pub fn move_cursor_left(&mut self) {
        if self.cursor_position > 0 {
            self.cursor_position -= 1;
        }
    }

    pub fn move_cursor_right(&mut self) {
        if self.cursor_position < self.text.len() {
            self.cursor_position += 1;
        }
    }

    pub fn move_cursor_home(&mut self) {
        self.cursor_position = 0;
    }

    pub fn move_cursor_end(&mut self) {
        self.cursor_position = self.text.len();
    }

    pub fn clear(&mut self) {
        self.text.clear();
        self.cursor_position = 0;
        self.notify_changed();
    }

    pub fn submit(&self) {
        if let Some(ref callback) = self.on_submit {
            callback(&self.text);
        }
    }

    fn notify_changed(&self) {
        if let Some(ref callback) = self.on_text_changed {
            callback(&self.text);
        }
    }

    pub fn get_display_text(&self) -> String {
        if self.is_password {
            "•".repeat(self.text.len())
        } else {
            self.text.clone()
        }
    }
}

/// Dropdown/Select component
#[derive(Debug, Clone)]
pub struct Dropdown {
    pub element: UIElement,
    pub options: Vec<String>,
    pub selected_index: Option<usize>,
    pub is_open: bool,
    pub item_height: f32,
    pub font_size: f32,
    pub text_color: Vec4,
    pub hover_color: Vec4,
    pub selected_color: Vec4,
    pub on_selection_changed: Option<Box<dyn Fn(usize, &str) + Send>>,
}

impl Default for Dropdown {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(150.0, 40.0),
            options: Vec::new(),
            selected_index: None,
            is_open: false,
            item_height: 30.0,
            font_size: 16.0,
            text_color: Vec4::one(),
            hover_color: Vec4::new(0.3, 0.5, 0.8, 1.0),
            selected_color: Vec4::new(0.2, 0.4, 0.7, 1.0),
            on_selection_changed: None,
        }
    }
}

impl Dropdown {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(150.0, 40.0),
            ..Default::default()
        }
    }

    pub fn with_options(mut self, options: Vec<String>) -> Self {
        self.options = options;
        self
    }

    pub fn on_selection_changed<F: Fn(usize, &str) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_selection_changed = Some(Box::new(callback));
        self
    }

    pub fn select(&mut self, index: usize) {
        if index < self.options.len() {
            let old_index = self.selected_index;
            self.selected_index = Some(index);

            if old_index != Some(index) {
                if let Some(ref callback) = self.on_selection_changed {
                    callback(index, &self.options[index]);
                }
            }
        }
        self.is_open = false;
    }

    pub fn get_selected_text(&self) -> Option<&str> {
        self.selected_index.map(|i| self.options[i].as_str())
    }

    pub fn get_dropdown_height(&self) -> f32 {
        self.options.len() as f32 * self.item_height
    }

    pub fn get_item_at_position(&self, y: f32, screen_width: f32, screen_height: f32) -> Option<usize> {
        if !self.is_open {
            return None;
        }

        let (_, element_y, _, element_h) = self.element.get_bounds(screen_width, screen_height);
        let dropdown_y = element_y + element_h;

        let relative_y = y - dropdown_y;
        if relative_y < 0.0 || relative_y > self.get_dropdown_height() {
            return None;
        }

        let index = (relative_y / self.item_height) as usize;
        if index < self.options.len() {
            Some(index)
        } else {
            None
        }
    }
}

/// Container/Panel component
#[derive(Debug, Clone)]
pub struct Panel {
    pub element: UIElement,
    pub padding: Vec2,
    pub margin: Vec2,
    pub scroll_offset: Vec2,
    pub clip_content: bool,
}

impl Default for Panel {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(300.0, 200.0),
            padding: Vec2::new(10.0, 10.0),
            margin: Vec2::zero(),
            scroll_offset: Vec2::zero(),
            clip_content: true,
        }
    }
}

impl Panel {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(300.0, 200.0),
            ..Default::default()
        }
    }

    pub fn with_padding(mut self, padding: f32) -> Self {
        self.padding = Vec2::new(padding, padding);
        self
    }

    pub fn with_margin(mut self, margin: f32) -> Self {
        self.margin = Vec2::new(margin, margin);
        self
    }

    pub fn get_content_bounds(&self, screen_width: f32, screen_height: f32) -> (f32, f32, f32, f32) {
        let (x, y, w, h) = self.element.get_bounds(screen_width, screen_height);
        (
            x + self.padding.x,
            y + self.padding.y,
            w - self.padding.x * 2.0,
            h - self.padding.y * 2.0,
        )
    }

    pub fn scroll(&mut self, delta_x: f32, delta_y: f32) {
        self.scroll_offset.x += delta_x;
        self.scroll_offset.y += delta_y;
    }
}

/// Image component
#[derive(Debug, Clone)]
pub struct Image {
    pub element: UIElement,
    pub image_data: Option<Vec<u8>>,
    pub preserve_aspect: bool,
    pub uv_rect: (f32, f32, f32, f32),
}

impl Default for Image {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(100.0, 100.0),
            image_data: None,
            preserve_aspect: true,
            uv_rect: (0.0, 0.0, 1.0, 1.0),
        }
    }
}

impl Image {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(100.0, 100.0),
            ..Default::default()
        }
    }

    pub fn with_image(mut self, data: Vec<u8>) -> Self {
        self.image_data = Some(data);
        self
    }

    pub fn with_preserve_aspect(mut self, preserve: bool) -> Self {
        self.preserve_aspect = preserve;
        self
    }

    pub fn with_uv_rect(mut self, x: f32, y: f32, w: f32, h: f32) -> Self {
        self.uv_rect = (x, y, w, h);
        self
    }
}

/// Progress bar component
#[derive(Debug, Clone)]
pub struct ProgressBar {
    pub element: UIElement,
    pub value: f32,
    pub max_value: f32,
    pub fill_color: Vec4,
    pub background_color: Vec4,
}

impl Default for ProgressBar {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(200.0, 20.0),
            value: 0.0,
            max_value: 100.0,
            fill_color: Vec4::new(0.2, 0.8, 0.2, 1.0),
            background_color: Vec4::new(0.2, 0.2, 0.2, 1.0),
        }
    }
}

impl ProgressBar {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(200.0, 20.0),
            ..Default::default()
        }
    }

    pub fn with_value(mut self, value: f32, max: f32) -> Self {
        self.value = value;
        self.max_value = max;
        self
    }

    pub fn with_colors(mut self, fill: Vec4, background: Vec4) -> Self {
        self.fill_color = fill;
        self.background_color = background;
        self
    }

    pub fn set_value(&mut self, value: f32) {
        self.value = value.clamp(0.0, self.max_value);
    }

    pub fn get_percentage(&self) -> f32 {
        (self.value / self.max_value).clamp(0.0, 1.0)
    }

    pub fn get_fill_width(&self) -> f32 {
        self.element.size.x * self.get_percentage()
    }
}

/// Toggle/Switch component
#[derive(Debug, Clone)]
pub struct Toggle {
    pub element: UIElement,
    pub is_on: bool,
    pub handle_size: f32,
    pub on_color: Vec4,
    pub off_color: Vec4,
    pub handle_color: Vec4,
    pub on_value_changed: Option<Box<dyn Fn(bool) + Send>>,
}

impl Default for Toggle {
    fn default() -> Self {
        Self {
            element: UIElement::new(0).with_size(60.0, 30.0),
            is_on: false,
            handle_size: 26.0,
            on_color: Vec4::new(0.2, 0.8, 0.2, 1.0),
            off_color: Vec4::new(0.5, 0.5, 0.5, 1.0),
            handle_color: Vec4::one(),
            on_value_changed: None,
        }
    }
}

impl Toggle {
    pub fn new(id: u64) -> Self {
        Self {
            element: UIElement::new(id).with_size(60.0, 30.0),
            ..Default::default()
        }
    }

    pub fn with_initial_state(mut self, is_on: bool) -> Self {
        self.is_on = is_on;
        self
    }

    pub fn on_value_changed<F: Fn(bool) + Send + 'static>(mut self, callback: F) -> Self {
        self.on_value_changed = Some(Box::new(callback));
        self
    }

    pub fn toggle(&mut self) {
        self.set_value(!self.is_on);
    }

    pub fn set_value(&mut self, value: bool) {
        if self.is_on != value {
            self.is_on = value;
            if let Some(ref callback) = self.on_value_changed {
                callback(self.is_on);
            }
        }
    }

    pub fn get_handle_position(&self) -> f32 {
        if self.is_on {
            self.element.size.x - self.handle_size - 2.0
        } else {
            2.0
        }
    }

    pub fn get_current_background_color(&self) -> Vec4 {
        if self.is_on {
            self.on_color
        } else {
            self.off_color
        }
    }
}
