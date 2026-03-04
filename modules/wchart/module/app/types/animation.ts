/**
 * Animation types
 */
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

/**
 * Easing functions
 */
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

/**
 * Animation configuration
 */
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

/**
 * Series animation configuration
 */
export interface SeriesAnimation {
	enter: AnimationConfig;
	update: AnimationConfig;
	exit: AnimationConfig;
}
