//! Easing functions for animations

/// Easing function type
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum EasingFunction {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
    EaseInQuad,
    EaseOutQuad,
    EaseInOutQuad,
    EaseInCubic,
    EaseOutCubic,
    EaseInOutCubic,
    EaseInQuart,
    EaseOutQuart,
    EaseInOutQuart,
    EaseInQuint,
    EaseOutQuint,
    EaseInOutQuint,
    EaseInSine,
    EaseOutSine,
    EaseInOutSine,
    EaseInExpo,
    EaseOutExpo,
    EaseInOutExpo,
    EaseInCirc,
    EaseOutCirc,
    EaseInOutCirc,
    EaseInBack,
    EaseOutBack,
    EaseInOutBack,
    EaseInElastic,
    EaseOutElastic,
    EaseInOutElastic,
    EaseInBounce,
    EaseOutBounce,
    EaseInOutBounce,
    Custom(fn(f32) -> f32),
}

impl EasingFunction {
    /// Apply the easing function to a value t in range [0, 1]
    pub fn apply(&self, t: f32) -> f32 {
        let t = t.clamp(0.0, 1.0);

        match self {
            Self::Linear => linear(t),
            Self::EaseIn => ease_in(t),
            Self::EaseOut => ease_out(t),
            Self::EaseInOut => ease_in_out(t),
            Self::EaseInQuad => ease_in_quad(t),
            Self::EaseOutQuad => ease_out_quad(t),
            Self::EaseInOutQuad => ease_in_out_quad(t),
            Self::EaseInCubic => ease_in_cubic(t),
            Self::EaseOutCubic => ease_out_cubic(t),
            Self::EaseInOutCubic => ease_in_out_cubic(t),
            Self::EaseInQuart => ease_in_quart(t),
            Self::EaseOutQuart => ease_out_quart(t),
            Self::EaseInOutQuart => ease_in_out_quart(t),
            Self::EaseInQuint => ease_in_quint(t),
            Self::EaseOutQuint => ease_out_quint(t),
            Self::EaseInOutQuint => ease_in_out_quint(t),
            Self::EaseInSine => ease_in_sine(t),
            Self::EaseOutSine => ease_out_sine(t),
            Self::EaseInOutSine => ease_in_out_sine(t),
            Self::EaseInExpo => ease_in_expo(t),
            Self::EaseOutExpo => ease_out_expo(t),
            Self::EaseInOutExpo => ease_in_out_expo(t),
            Self::EaseInCirc => ease_in_circ(t),
            Self::EaseOutCirc => ease_out_circ(t),
            Self::EaseInOutCirc => ease_in_out_circ(t),
            Self::EaseInBack => ease_in_back(t),
            Self::EaseOutBack => ease_out_back(t),
            Self::EaseInOutBack => ease_in_out_back(t),
            Self::EaseInElastic => ease_in_elastic(t),
            Self::EaseOutElastic => ease_out_elastic(t),
            Self::EaseInOutElastic => ease_in_out_elastic(t),
            Self::EaseInBounce => ease_in_bounce(t),
            Self::EaseOutBounce => ease_out_bounce(t),
            Self::EaseInOutBounce => ease_in_out_bounce(t),
            Self::Custom(f) => f(t),
        }
    }
}

/// Linear interpolation
pub fn linear(t: f32) -> f32 {
    t
}

/// Ease in (quadratic)
pub fn ease_in(t: f32) -> f32 {
    t * t
}

/// Ease out (quadratic)
pub fn ease_out(t: f32) -> f32 {
    1.0 - (1.0 - t) * (1.0 - t)
}

/// Ease in-out (quadratic)
pub fn ease_in_out(t: f32) -> f32 {
    if t < 0.5 {
        2.0 * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(2) / 2.0
    }
}

/// Ease in quad
pub fn ease_in_quad(t: f32) -> f32 {
    t * t
}

/// Ease out quad
pub fn ease_out_quad(t: f32) -> f32 {
    1.0 - (1.0 - t) * (1.0 - t)
}

/// Ease in-out quad
pub fn ease_in_out_quad(t: f32) -> f32 {
    if t < 0.5 {
        2.0 * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(2) / 2.0
    }
}

/// Ease in cubic
pub fn ease_in_cubic(t: f32) -> f32 {
    t * t * t
}

/// Ease out cubic
pub fn ease_out_cubic(t: f32) -> f32 {
    1.0 - (1.0 - t).powi(3)
}

/// Ease in-out cubic
pub fn ease_in_out_cubic(t: f32) -> f32 {
    if t < 0.5 {
        4.0 * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(3) / 2.0
    }
}

/// Ease in quart
pub fn ease_in_quart(t: f32) -> f32 {
    t * t * t * t
}

/// Ease out quart
pub fn ease_out_quart(t: f32) -> f32 {
    1.0 - (1.0 - t).powi(4)
}

/// Ease in-out quart
pub fn ease_in_out_quart(t: f32) -> f32 {
    if t < 0.5 {
        8.0 * t * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(4) / 2.0
    }
}

/// Ease in quint
pub fn ease_in_quint(t: f32) -> f32 {
    t * t * t * t * t
}

/// Ease out quint
pub fn ease_out_quint(t: f32) -> f32 {
    1.0 - (1.0 - t).powi(5)
}

/// Ease in-out quint
pub fn ease_in_out_quint(t: f32) -> f32 {
    if t < 0.5 {
        16.0 * t * t * t * t * t
    } else {
        1.0 - (-2.0 * t + 2.0).powi(5) / 2.0
    }
}

/// Ease in sine
pub fn ease_in_sine(t: f32) -> f32 {
    1.0 - (t * std::f32::consts::PI / 2.0).cos()
}

/// Ease out sine
pub fn ease_out_sine(t: f32) -> f32 {
    (t * std::f32::consts::PI / 2.0).sin()
}

/// Ease in-out sine
pub fn ease_in_out_sine(t: f32) -> f32 {
    -(std::f32::consts::PI * t).cos() / 2.0 + 0.5
}

/// Ease in expo
pub fn ease_in_expo(t: f32) -> f32 {
    if t == 0.0 {
        0.0
    } else {
        2.0_f32.powf(10.0 * (t - 1.0))
    }
}

/// Ease out expo
pub fn ease_out_expo(t: f32) -> f32 {
    if t == 1.0 {
        1.0
    } else {
        1.0 - 2.0_f32.powf(-10.0 * t)
    }
}

/// Ease in-out expo
pub fn ease_in_out_expo(t: f32) -> f32 {
    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else if t < 0.5 {
        2.0_f32.powf(20.0 * t - 10.0) / 2.0
    } else {
        (2.0 - 2.0_f32.powf(-20.0 * t + 10.0)) / 2.0
    }
}

/// Ease in circ
pub fn ease_in_circ(t: f32) -> f32 {
    1.0 - (1.0 - t * t).sqrt()
}

/// Ease out circ
pub fn ease_out_circ(t: f32) -> f32 {
    (1.0 - (t - 1.0).powi(2)).sqrt()
}

/// Ease in-out circ
pub fn ease_in_out_circ(t: f32) -> f32 {
    if t < 0.5 {
        (1.0 - (1.0 - 4.0 * t * t).sqrt()) / 2.0
    } else {
        ((1.0 - (-2.0 * t + 2.0).powi(2)).sqrt() + 1.0) / 2.0
    }
}

/// Ease in back
pub fn ease_in_back(t: f32) -> f32 {
    const C1: f32 = 1.70158;
    const C3: f32 = C1 + 1.0;
    C3 * t * t * t - C1 * t * t
}

/// Ease out back
pub fn ease_out_back(t: f32) -> f32 {
    const C1: f32 = 1.70158;
    const C3: f32 = C1 + 1.0;
    1.0 + C3 * (t - 1.0).powi(3) + C1 * (t - 1.0).powi(2)
}

/// Ease in-out back
pub fn ease_in_out_back(t: f32) -> f32 {
    const C1: f32 = 1.70158;
    const C2: f32 = C1 * 1.525;

    if t < 0.5 {
        ((2.0 * t).powi(2) * ((C2 + 1.0) * 2.0 * t - C2)) / 2.0
    } else {
        ((2.0 * t - 2.0).powi(2) * ((C2 + 1.0) * (t * 2.0 - 2.0) + C2) + 2.0) / 2.0
    }
}

/// Ease in elastic
pub fn ease_in_elastic(t: f32) -> f32 {
    const C4: f32 = (2.0 * std::f32::consts::PI) / 3.0;

    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else {
        -(2.0_f32.powf(10.0 * t - 10.0)) * ((t * 10.0 - 10.75) * C4).sin()
    }
}

/// Ease out elastic
pub fn ease_out_elastic(t: f32) -> f32 {
    const C4: f32 = (2.0 * std::f32::consts::PI) / 3.0;

    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else {
        2.0_f32.powf(-10.0 * t) * ((t * 10.0 - 0.75) * C4).sin() + 1.0
    }
}

/// Ease in-out elastic
pub fn ease_in_out_elastic(t: f32) -> f32 {
    const C5: f32 = (2.0 * std::f32::consts::PI) / 4.5;

    if t == 0.0 {
        0.0
    } else if t == 1.0 {
        1.0
    } else if t < 0.5 {
        -(2.0_f32.powf(20.0 * t - 10.0) * ((20.0 * t - 11.125) * C5).sin()) / 2.0
    } else {
        (2.0_f32.powf(-20.0 * t + 10.0) * ((20.0 * t - 11.125) * C5).sin()) / 2.0 + 1.0
    }
}

/// Ease out bounce
pub fn ease_out_bounce(t: f32) -> f32 {
    const N1: f32 = 7.5625;
    const D1: f32 = 2.75;

    if t < 1.0 / D1 {
        N1 * t * t
    } else if t < 2.0 / D1 {
        let t = t - 1.5 / D1;
        N1 * t * t + 0.75
    } else if t < 2.5 / D1 {
        let t = t - 2.25 / D1;
        N1 * t * t + 0.9375
    } else {
        let t = t - 2.625 / D1;
        N1 * t * t + 0.984375
    }
}

/// Ease in bounce
pub fn ease_in_bounce(t: f32) -> f32 {
    1.0 - ease_out_bounce(1.0 - t)
}

/// Ease in-out bounce
pub fn ease_in_out_bounce(t: f32) -> f32 {
    if t < 0.5 {
        (1.0 - ease_out_bounce(1.0 - 2.0 * t)) / 2.0
    } else {
        (1.0 + ease_out_bounce(2.0 * t - 1.0)) / 2.0
    }
}

/// Bezier curve easing (4 control points)
pub fn bezier(t: f32, p0: f32, p1: f32, p2: f32, p3: f32) -> f32 {
    let t2 = t * t;
    let t3 = t2 * t;
    let mt = 1.0 - t;
    let mt2 = mt * mt;
    let mt3 = mt2 * mt;

    p0 * mt3 + 3.0 * p1 * mt2 * t + 3.0 * p2 * mt * t2 + p3 * t3
}

/// Cubic bezier easing with control points (x1, y1, x2, y2)
pub fn cubic_bezier(t: f32, x1: f32, y1: f32, x2: f32, y2: f32) -> f32 {
    let epsilon = 1e-6;
    let mut start = 0.0;
    let mut end = 1.0;

    while start < end {
        let mid = (start + end) / 2.0;
        let x = bezier(mid, 0.0, x1, x2, 1.0);

        if (x - t).abs() < epsilon {
            return bezier(mid, 0.0, y1, y2, 1.0);
        }

        if x < t {
            start = mid;
        } else {
            end = mid;
        }
    }

    bezier(start, 0.0, y1, y2, 1.0)
}
