/**
 * Easing function
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
 * Easing function implementations
 */

/**
 * Bounce easing functions
 */
const easeOutBounce = (t: number): number => {
	const n1 = 7.5625;
	const d1 = 2.75;
	if (t < 1 / d1) return n1 * t * t;
	if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
	if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
	return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
	linear: (t: number) => t,
	easeInQuad: (t: number) => t * t,
	easeOutQuad: (t: number) => t * (2 - t),
	easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
	easeInCubic: (t: number) => t * t * t,
	easeOutCubic: (t: number) => --t * t * t + 1,
	easeInOutCubic: (t: number) =>
		t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
	easeInQuart: (t: number) => t * t * t * t,
	easeOutQuart: (t: number) => 1 - --t * t * t * t,
	easeInOutQuart: (t: number) =>
		t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
	easeInQuint: (t: number) => t * t * t * t * t,
	easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
	easeInOutQuint: (t: number) =>
		t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
	easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
	easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
	easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
	easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
	easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
	easeInOutExpo: (t: number) => {
		if (t === 0) return 0;
		if (t === 1) return 1;
		if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
		return (2 - Math.pow(2, -20 * t + 10)) / 2;
	},
	easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
	easeOutCirc: (t: number) => Math.sqrt(1 - (t - 1) * (t - 1)),
	easeInOutCirc: (t: number) =>
		t < 0.5
			? (1 - Math.sqrt(1 - 4 * t * t)) / 2
			: (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2,
	easeInElastic: (t: number) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0
			? 0
			: t === 1
				? 1
				: -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
	},
	easeOutElastic: (t: number) => {
		const c4 = (2 * Math.PI) / 3;
		return t === 0
			? 0
			: t === 1
				? 1
				: Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
	},
	easeInOutElastic: (t: number) => {
		const c4 = (2 * Math.PI) / 4.5;
		if (t === 0) return 0;
		if (t === 1) return 1;
		if (t < 0.5)
			return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c4)) / 2;
		return (
			(Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c4)) / 2 + 1
		);
	},
	easeInBack: (t: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return c3 * t * t * t - c1 * t * t;
	},
	easeOutBack: (t: number) => {
		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
	},
	easeInOutBack: (t: number) => {
		const c1 = 1.70158;
		const c2 = c1 * 1.525;
		if (t < 0.5) return (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2;
		return (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
	},
	easeOutBounce,
	easeInBounce: (t: number) => 1 - easeOutBounce(1 - t),
	easeInOutBounce: (t: number) =>
		t < 0.5
			? (1 - easeOutBounce(1 - 2 * t)) / 2
			: (1 + easeOutBounce(2 * t - 1)) / 2,
};

/**
 * Get easing function
 */
export const getEasingFunction = (easing: EasingFunction) =>
	easingFunctions[easing];
