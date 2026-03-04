import { ref, readonly, reactive, computed } from "vue";
import type {
	AnimationType,
	EasingFunction,
	AnimationConfig,
	SeriesAnimation,
} from "../types/animation";
import { easingFunctions, defaultAnimations } from "../utils/animation-utils";

/**
 * Chart animation state
 */
interface AnimationState {
	isAnimating: boolean;
	progress: number;
	currentAnimation: string | null;
	queue: AnimationConfig[];
}

/**
 * Composable for advanced chart animations
 */
export function useChartAnimation(initialSettings?: {
	global?: Partial<AnimationConfig>;
	series?: Partial<SeriesAnimation>;
	enabled?: boolean;
}) {
	const state = reactive<AnimationState>({
		isAnimating: false,
		progress: 0,
		currentAnimation: null,
		queue: [],
	});

	const globalConfig = reactive<AnimationConfig>({
		type: "fadeIn",
		duration: 1000,
		delay: 0,
		easing: "easeInOutQuad",
		repeat: 0,
		direction: "normal",
		fillMode: "both",
		enabled: true,
		...initialSettings?.global,
	});

	const seriesAnimations = reactive<SeriesAnimation>({
		enter: {
			type: "fadeIn",
			duration: 800,
			delay: 0,
			easing: "easeOutQuad",
			repeat: 0,
			direction: "normal",
			fillMode: "both",
			enabled: true,
		},
		update: {
			type: "morph",
			duration: 600,
			delay: 0,
			easing: "easeInOutQuad",
			repeat: 0,
			direction: "normal",
			fillMode: "both",
			enabled: true,
		},
		exit: {
			type: "fadeIn",
			duration: 400,
			delay: 0,
			easing: "easeInQuad",
			repeat: 0,
			direction: "reverse",
			fillMode: "both",
			enabled: true,
		},
		...initialSettings?.series,
	});

	/**
	 * Get easing function
	 */
	const getEasingFunction = (easing: EasingFunction) => easingFunctions[easing];

	/**
	 * Calculate animation progress
	 */
	const calculateProgress = (
		elapsed: number,
		config: AnimationConfig,
	): number => {
		const duration = config.duration;
		const delay = config.delay;

		if (elapsed < delay) return 0;
		if (elapsed > delay + duration) return 1;

		const normalizedTime = (elapsed - delay) / duration;
		const easedTime = getEasingFunction(config.easing)(normalizedTime);

		// Handle direction
		switch (config.direction) {
			case "reverse":
				return 1 - easedTime;
			case "alternate":
				return Math.floor(elapsed / (delay + duration)) % 2 === 0
					? easedTime
					: 1 - easedTime;
			case "alternate-reverse":
				return Math.floor(elapsed / (delay + duration)) % 2 === 0
					? 1 - easedTime
					: easedTime;
			default:
				return easedTime;
		}
	};

	/**
	 * Apply animation to element
	 */
	const applyAnimation = (
		element: HTMLElement | SVGElement,
		config: AnimationConfig,
		properties: Partial<Record<string, { from: any; to: any }>>,
	) => {
		if (!config.enabled) return;

		const startTime = Date.now() + config.delay;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = calculateProgress(elapsed, config);

			// Apply CSS transforms/properties
			Object.entries(properties).forEach(([property, value]) => {
				if (value) {
					const { from, to } = value;
					const currentValue = interpolateValue(from, to, progress);
					applyCSSProperty(element, property, currentValue);
				}
			});

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				// Animation complete
				if (config.repeat > 0) {
					// Handle repeats
					config.repeat--;
					setTimeout(() => applyAnimation(element, config, properties), 0);
				}
			}
		};

		requestAnimationFrame(animate);
	};

	/**
	 * Animate chart series entrance
	 */
	const animateSeriesEnter = (
		elements: (HTMLElement | SVGElement)[],
		staggerDelay = 100,
	) => {
		if (!seriesAnimations.enter.enabled) return;

		elements.forEach((element, index) => {
			const config = {
				...seriesAnimations.enter,
				delay: seriesAnimations.enter.delay + index * staggerDelay,
			};
			const properties = getAnimationProperties(
				seriesAnimations.enter.type,
				"enter",
			);
			applyAnimation(element, config, properties);
		});
	};

	/**
	 * Animate chart series update
	 */
	const animateSeriesUpdate = (
		elements: (HTMLElement | SVGElement)[],
		oldValues: any[],
		newValues: any[],
	) => {
		if (!seriesAnimations.update.enabled) return;

		elements.forEach((element, index) => {
			const from = oldValues[index];
			const to = newValues[index];
			const properties = { transform: { from, to } };
			applyAnimation(element, seriesAnimations.update, properties);
		});
	};

	/**
	 * Animate chart series exit
	 */
	const animateSeriesExit = (elements: (HTMLElement | SVGElement)[]) => {
		if (!seriesAnimations.exit.enabled) return;

		elements.forEach((element) => {
			const properties = getAnimationProperties(
				seriesAnimations.exit.type,
				"exit",
			);
			applyAnimation(element, seriesAnimations.exit, properties);
		});
	};

	/**
	 * Get animation properties for a specific type and phase
	 */
	const getAnimationProperties = (
		type: AnimationType,
		phase: "enter" | "exit",
	) => {
		const isEnter = phase === "enter";

		switch (type) {
			case "fadeIn":
				return { opacity: { from: isEnter ? 0 : 1, to: isEnter ? 1 : 0 } };
			case "slideIn":
				return {
					transform: {
						from: `translateX(${isEnter ? "-100%" : "0"})`,
						to: `translateX(${isEnter ? "0" : "100%"})`,
					},
				};
			case "grow":
				return {
					transform: {
						from: `scale(${isEnter ? 0 : 1})`,
						to: `scale(${isEnter ? 1 : 0})`,
					},
				};
			case "bounce":
				return {
					transform: {
						from: `translateY(${isEnter ? "-100%" : "0"})`,
						to: `translateY(${isEnter ? "0" : "-100%"})`,
					},
				};
			case "elastic":
				return {
					transform: {
						from: `scale(${isEnter ? 0 : 1})`,
						to: `scale(${isEnter ? 1 : 0})`,
					},
				};
			case "draw":
				return {
					"stroke-dashoffset": {
						from: isEnter ? 100 : 0,
						to: isEnter ? 0 : 100,
					},
				};
			case "morph":
				return { transform: { from: "scale(1)", to: "scale(1.1)" } };
			case "stagger":
				return { opacity: { from: 0, to: 1 } };
			case "wave":
				return {
					transform: { from: "translateY(0)", to: "translateY(-10px)" },
				};
			case "ripple":
				return {
					transform: { from: "scale(0)", to: "scale(2)" },
					opacity: { from: 1, to: 0 },
				};
			case "pulse":
				return { transform: { from: "scale(1)", to: "scale(1.05)" } };
			case "shake":
				return { transform: { from: "translateX(0)", to: "translateX(5px)" } };
			case "flip":
				return { transform: { from: "rotateY(0deg)", to: "rotateY(180deg)" } };
			default:
				return { opacity: { from: 0, to: 1 } };
		}
	};

	/**
	 * Interpolate between values
	 */
	const interpolateValue = (from: any, to: any, progress: number): any => {
		if (typeof from === "number" && typeof to === "number") {
			return from + (to - from) * progress;
		}
		if (typeof from === "string" && typeof to === "string") {
			// Handle CSS transforms
			return progress < 0.5 ? from : to;
		}
		return to;
	};

	/**
	 * Apply CSS property to element
	 */
	const applyCSSProperty = (
		element: HTMLElement | SVGElement,
		property: string,
		value: any,
	) => {
		if (property === "transform") {
			element.style.transform = value;
		} else if (property === "opacity") {
			element.style.opacity = value.toString();
		} else if (property === "stroke-dashoffset") {
			if (element instanceof SVGElement) {
				element.style.strokeDashoffset = value.toString();
			}
		} else {
			(element.style as any)[property] = value;
		}
	};

	/**
	 * Update global animation settings
	 */
	const updateGlobalAnimation = (settings: Partial<AnimationConfig>) => {
		Object.assign(globalConfig, settings);
	};

	/**
	 * Update series animations
	 */
	const updateSeriesAnimations = (animations: Partial<SeriesAnimation>) => {
		Object.assign(seriesAnimations, animations);
	};

	/**
	 * Enable/disable all animations
	 */
	const setAnimationsEnabled = (enabled: boolean) => {
		globalConfig.enabled = enabled;
		seriesAnimations.enter.enabled = enabled;
		seriesAnimations.update.enabled = enabled;
		seriesAnimations.exit.enabled = enabled;
	};

	return {
		// State
		animationState: readonly(state),
		globalConfig: readonly(globalConfig),
		seriesAnimations: readonly(seriesAnimations),

		// Methods
		applyAnimation,
		animateSeriesEnter,
		animateSeriesUpdate,
		animateSeriesExit,
		updateGlobalAnimation,
		updateSeriesAnimations,
		setAnimationsEnabled,
		getEasingFunction,
	};
}
