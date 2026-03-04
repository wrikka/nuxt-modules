export interface VideoEffect {
	id: string;
	type: "brightness" | "contrast" | "saturation" | "blur" | "hue-rotate" | "invert" | "grayscale" | "sepia";
	value: number;
	enabled: boolean;
}

export interface EffectPreset {
	name: string;
	effects: Omit<VideoEffect, "id">[];
}

export const useVideoEffects = () => {
	const effects = ref<Map<string, VideoEffect[]>>(new Map());
	const selectedClipId = ref<string | null>(null);

	const effectPresets: EffectPreset[] = [
		{
			name: "None",
			effects: [],
		},
		{
			name: "Bright",
			effects: [
				{ type: "brightness", value: 1.2, enabled: true },
			],
		},
		{
			name: "Dark",
			effects: [
				{ type: "brightness", value: 0.8, enabled: true },
			],
		},
		{
			name: "High Contrast",
			effects: [
				{ type: "contrast", value: 1.5, enabled: true },
			],
		},
		{
			name: "Vivid",
			effects: [
				{ type: "saturation", value: 1.5, enabled: true },
			],
		},
		{
			name: "Black & White",
			effects: [
				{ type: "grayscale", value: 1, enabled: true },
			],
		},
		{
			name: "Sepia",
			effects: [
				{ type: "sepia", value: 1, enabled: true },
			],
		},
		{
			name: "Blur",
			effects: [
				{ type: "blur", value: 3, enabled: true },
			],
		},
		{
			name: "Vintage",
			effects: [
				{ type: "sepia", value: 0.5, enabled: true },
				{ type: "contrast", value: 1.2, enabled: true },
				{ type: "saturation", value: 0.8, enabled: true },
			],
		},
	];

	const addEffect = (clipId: string, type: VideoEffect["type"], value: number = 100) => {
		if (!effects.value.has(clipId)) {
			effects.value.set(clipId, []);
		}

		const clipEffects = effects.value.get(clipId)!;
		const existingEffect = clipEffects.find((e) => e.type === type);

		if (existingEffect) {
			existingEffect.value = value;
			existingEffect.enabled = true;
		} else {
			clipEffects.push({
				id: `effect-${Date.now()}`,
				type,
				value,
				enabled: true,
			});
		}
	};

	const updateEffect = (clipId: string, effectId: string, updates: Partial<VideoEffect>) => {
		const clipEffects = effects.value.get(clipId);
		if (!clipEffects) return;

		const effect = clipEffects.find((e) => e.id === effectId);
		if (effect) {
			Object.assign(effect, updates);
		}
	};

	const removeEffect = (clipId: string, effectId: string) => {
		const clipEffects = effects.value.get(clipId);
		if (!clipEffects) return;

		const index = clipEffects.findIndex((e) => e.id === effectId);
		if (index !== -1) {
			clipEffects.splice(index, 1);
		}
	};

	const toggleEffect = (clipId: string, effectId: string) => {
		const clipEffects = effects.value.get(clipId);
		if (!clipEffects) return;

		const effect = clipEffects.find((e) => e.id === effectId);
		if (effect) {
			effect.enabled = !effect.enabled;
		}
	};

	const getEffectsForClip = (clipId: string): VideoEffect[] => {
		return effects.value.get(clipId) || [];
	};

	const applyPreset = (clipId: string, preset: EffectPreset) => {
		effects.value.set(
			clipId,
			preset.effects.map((effect) => ({
				...effect,
				id: `effect-${Date.now()}-${Math.random()}`,
			})),
		);
	};

	const getFilterString = (clipId: string): string => {
		const clipEffects = effects.value.get(clipId) || [];
		const enabledEffects = clipEffects.filter((e) => e.enabled);

		if (enabledEffects.length === 0) return "none";

		return enabledEffects.map((effect) => {
			switch (effect.type) {
				case "brightness":
					return `brightness(${effect.value}%)`;
				case "contrast":
					return `contrast(${effect.value}%)`;
				case "saturation":
					return `saturate(${effect.value}%)`;
				case "blur":
					return `blur(${effect.value}px)`;
				case "hue-rotate":
					return `hue-rotate(${effect.value}deg)`;
				case "invert":
					return `invert(${effect.value}%)`;
				case "grayscale":
					return `grayscale(${effect.value}%)`;
				case "sepia":
					return `sepia(${effect.value}%)`;
				default:
					return "";
			}
		}).join(" ");
	};

	const clearEffects = (clipId: string) => {
		effects.value.delete(clipId);
	};

	const resetAllEffects = () => {
		effects.value.clear();
	};

	return {
		effects,
		selectedClipId,
		effectPresets,
		addEffect,
		updateEffect,
		removeEffect,
		toggleEffect,
		getEffectsForClip,
		applyPreset,
		getFilterString,
		clearEffects,
		resetAllEffects,
	};
};
