import { ref, computed } from "vue";

export type Transition3DType = 
	| "cube" 
	| "flip" 
	| "rotate" 
	| "zoom3d" 
	| "coverflow" 
	| "card" 
	| "fall" 
	| "fade3d";

export interface Transition3DConfig {
	type: Transition3DType;
	duration: number;
	easing: string;
	perspective: number;
	origin?: { x: number; y: number };
}

export const TRANSITIONS_3D: Record<Transition3DType, Transition3DConfig> = {
	cube: {
		type: "cube",
		duration: 800,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 1000,
	},
	flip: {
		type: "flip",
		duration: 700,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 1200,
	},
	rotate: {
		type: "rotate",
		duration: 900,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 800,
		origin: { x: 50, y: 50 },
	},
	zoom3d: {
		type: "zoom3d",
		duration: 500,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 1000,
	},
	coverflow: {
		type: "coverflow",
		duration: 600,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 1500,
	},
	card: {
		type: "card",
		duration: 750,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 1000,
	},
	fall: {
		type: "fall",
		duration: 1000,
		easing: "cubic-bezier(0.4, 0, 0.2, 1)",
		perspective: 800,
	},
	fade3d: {
		type: "fade3d",
		duration: 600,
		easing: "ease-in-out",
		perspective: 1000,
	},
};

export function use3DTransitions() {
	const currentTransition = ref<Transition3DType>("cube");
	const isAnimating = ref(false);
	const direction = ref<"next" | "prev">("next");

	const config = computed(() => TRANSITIONS_3D[currentTransition.value]);

	const transitionClasses = computed(() => {
		return {
			"perspective-container": true,
			[`transition-${currentTransition.value}`]: true,
			"is-animating": isAnimating.value,
			"direction-next": direction.value === "next",
			"direction-prev": direction.value === "prev",
		};
	});

	const transitionStyles = computed(() => {
		return {
			perspective: `${config.value.perspective}px`,
			"--transition-duration": `${config.value.duration}ms`,
			"--transition-easing": config.value.easing,
		};
	});

	function setTransition(type: Transition3DType) {
		currentTransition.value = type;
	}

	function startTransition(dir: "next" | "prev") {
		direction.value = dir;
		isAnimating.value = true;
		
		setTimeout(() => {
			isAnimating.value = false;
		}, config.value.duration);
	}

	function getEnterClass(): string {
		const classes: Record<Transition3DType, string> = {
			cube: direction.value === "next" ? "enter-cube-right" : "enter-cube-left",
			flip: "enter-flip",
			rotate: "enter-rotate",
			zoom3d: "enter-zoom3d-in",
			coverflow: direction.value === "next" ? "enter-coverflow-right" : "enter-coverflow-left",
			card: "enter-card",
			fall: "enter-fall",
			fade3d: "enter-fade3d",
		};
		return classes[currentTransition.value] || "";
	}

	function getLeaveClass(): string {
		const classes: Record<Transition3DType, string> = {
			cube: direction.value === "next" ? "leave-cube-left" : "leave-cube-right",
			flip: "leave-flip",
			rotate: "leave-rotate",
			zoom3d: "leave-zoom3d-out",
			coverflow: direction.value === "next" ? "leave-coverflow-left" : "leave-coverflow-right",
			card: "leave-card",
			fall: "leave-fall",
			fade3d: "leave-fade3d",
		};
		return classes[currentTransition.value] || "";
	}

	function previewTransition(type: Transition3DType) {
		const prev = currentTransition.value;
		currentTransition.value = type;
		startTransition("next");
		setTimeout(() => {
			currentTransition.value = prev;
		}, config.value.duration + 500);
	}

	function randomTransition(): Transition3DType {
		const types = Object.keys(TRANSITIONS_3D) as Transition3DType[];
		return types[Math.floor(Math.random() * types.length)];
	}

	return {
		currentTransition: readonly(currentTransition),
		isAnimating: readonly(isAnimating),
		config,
		transitionClasses,
		transitionStyles,
		setTransition,
		startTransition,
		getEnterClass,
		getLeaveClass,
		previewTransition,
		randomTransition,
		TRANSITIONS_3D,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
