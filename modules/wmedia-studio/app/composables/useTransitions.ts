export interface Transition {
	id: string;
	type: "fade" | "slide-left" | "slide-right" | "slide-up" | "slide-down" | "dissolve" | "zoom-in" | "zoom-out";
	duration: number;
	enabled: boolean;
}

export interface TransitionPreset {
	name: string;
	type: Transition["type"];
	defaultDuration: number;
}

export const useTransitions = () => {
	const transitions = ref<Map<string, Transition>>(new Map());
	const selectedTransitionId = ref<string | null>(null);

	const transitionPresets: TransitionPreset[] = [
		{ name: "Fade", type: "fade", defaultDuration: 1 },
		{ name: "Dissolve", type: "dissolve", defaultDuration: 1.5 },
		{ name: "Slide Left", type: "slide-left", defaultDuration: 0.5 },
		{ name: "Slide Right", type: "slide-right", defaultDuration: 0.5 },
		{ name: "Slide Up", type: "slide-up", defaultDuration: 0.5 },
		{ name: "Slide Down", type: "slide-down", defaultDuration: 0.5 },
		{ name: "Zoom In", type: "zoom-in", defaultDuration: 1 },
		{ name: "Zoom Out", type: "zoom-out", defaultDuration: 1 },
	];

	const addTransition = (clipId: string, type: Transition["type"], duration: number = 1) => {
		const transition: Transition = {
			id: `transition-${Date.now()}`,
			type,
			duration,
			enabled: true,
		};

		transitions.value.set(clipId, transition);
		return transition;
	};

	const updateTransition = (clipId: string, updates: Partial<Transition>) => {
		const transition = transitions.value.get(clipId);
		if (transition) {
			Object.assign(transition, updates);
		}
	};

	const removeTransition = (clipId: string) => {
		transitions.value.delete(clipId);
	};

	const getTransition = (clipId: string): Transition | undefined => {
		return transitions.value.get(clipId);
	};

	const toggleTransition = (clipId: string) => {
		const transition = transitions.value.get(clipId);
		if (transition) {
			transition.enabled = !transition.enabled;
		}
	};

	const applyPreset = (clipId: string, preset: TransitionPreset) => {
		addTransition(clipId, preset.type, preset.defaultDuration);
	};

	const getTransitionStyle = (clipId: string, progress: number): string => {
		const transition = transitions.value.get(clipId);
		if (!transition || !transition.enabled) return "";

		switch (transition.type) {
			case "fade":
				return `opacity: ${progress}`;
			case "dissolve":
				return `opacity: ${progress}`;
			case "slide-left":
				return `transform: translateX(${(1 - progress) * -100}%)`;
			case "slide-right":
				return `transform: translateX(${(1 - progress) * 100}%)`;
			case "slide-up":
				return `transform: translateY(${(1 - progress) * -100}%)`;
			case "slide-down":
				return `transform: translateY(${(1 - progress) * 100}%)`;
			case "zoom-in":
				return `transform: scale(${progress})`;
			case "zoom-out":
				return `transform: scale(${2 - progress})`;
			default:
				return "";
		}
	};

	const clearTransitions = () => {
		transitions.value.clear();
	};

	return {
		transitions,
		selectedTransitionId,
		transitionPresets,
		addTransition,
		updateTransition,
		removeTransition,
		getTransition,
		toggleTransition,
		applyPreset,
		getTransitionStyle,
		clearTransitions,
	};
};
