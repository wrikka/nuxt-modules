export type AnimationType =
	| "fadeIn"
	| "slideIn"
	| "grow"
	| "bounce"
	| "elastic"
	| "draw"
	| "morph"
	| "stagger"
	| "wave"
	| "ripple"
	| "pulse"
	| "shake"
	| "flip";

export type EasingFunction =
	| "linear"
	| "easeInQuad"
	| "easeOutQuad"
	| "easeInOutQuad"
	| "easeInCubic"
	| "easeOutCubic"
	| "easeInOutCubic"
	| "easeInQuart"
	| "easeOutQuart"
	| "easeInOutQuart"
	| "easeInQuint"
	| "easeOutQuint"
	| "easeInOutQuint"
	| "easeInSine"
	| "easeOutSine"
	| "easeInOutSine"
	| "easeInExpo"
	| "easeOutExpo"
	| "easeInOutExpo"
	| "easeInCirc"
	| "easeOutCirc"
	| "easeInOutCirc"
	| "easeInElastic"
	| "easeOutElastic"
	| "easeInOutElastic"
	| "easeInBack"
	| "easeOutBack"
	| "easeInOutBack"
	| "easeInBounce"
	| "easeOutBounce"
	| "easeInOutBounce";

export interface AnimationConfig {
	type: AnimationType;
	duration: number;
	delay: number;
	easing: EasingFunction;
	repeat: number;
	direction: "normal" | "reverse" | "alternate" | "alternate-reverse";
	fillMode: "none" | "forwards" | "backwards" | "both";
	enabled: boolean;
}

export interface SeriesAnimation {
	enter: AnimationConfig;
	update: AnimationConfig;
	exit: AnimationConfig;
}

/**
 * Default animation configurations
 */
export const defaultAnimations: Record<
	AnimationType,
	Omit<AnimationConfig, "type">
> = {
	fadeIn: {
		duration: 500,
		delay: 0,
		easing: "easeOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	slideIn: {
		duration: 600,
		delay: 0,
		easing: "easeOutCubic",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	grow: {
		duration: 400,
		delay: 0,
		easing: "easeOutElastic",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	bounce: {
		duration: 800,
		delay: 0,
		easing: "easeOutBounce",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	elastic: {
		duration: 1000,
		delay: 0,
		easing: "easeOutElastic",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	draw: {
		duration: 1500,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	morph: {
		duration: 800,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	stagger: {
		duration: 600,
		delay: 0,
		easing: "easeOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	wave: {
		duration: 1000,
		delay: 0,
		easing: "easeInOutSine",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	ripple: {
		duration: 1200,
		delay: 0,
		easing: "easeOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	pulse: {
		duration: 400,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	shake: {
		duration: 500,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
	flip: {
		duration: 600,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
	},
};
