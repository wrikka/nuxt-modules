import type { AnimatableProperty } from "#shared/types/project";
import { nanoid } from "nanoid";

export const useKeyframeAnimation = (
	videoStore: ReturnType<typeof useVideoStore>,
	currentVideoProject: Ref<import("#shared/types").VideoProject | null>
) => {
	const addKeyframe = (clipId: string, property: AnimatableProperty, time: number, value: number) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip?.transform) return;

		const newKeyframe: import("#shared/types").Keyframe = { id: `kf-${property}-${nanoid()}`, time, value, easing: "linear" };
		const keyframes = clip.transform[property];
		const existingIndex = keyframes.findIndex(kf => kf.time === time);

		if (existingIndex !== -1) {
			const existing = keyframes[existingIndex];
			if (existing) keyframes[existingIndex] = { ...existing, value };
		} else {
			keyframes.push(newKeyframe);
			keyframes.sort((a, b) => a.time - b.time);
		}
	};

	const removeKeyframe = (clipId: string, property: AnimatableProperty, keyframeId: string) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip?.transform) return;

		const keyframes = clip.transform[property];
		const index = keyframes.findIndex(kf => kf.id === keyframeId);
		if (index !== -1 && keyframes.length > 1) keyframes.splice(index, 1);
	};

	const updateKeyframe = (clipId: string, property: AnimatableProperty, keyframeId: string, updates: Partial<import("#shared/types").Keyframe>) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip?.transform) return;

		const keyframe = clip.transform[property].find(kf => kf.id === keyframeId);
		if (keyframe) Object.assign(keyframe, updates);
	};

	return { addKeyframe, removeKeyframe, updateKeyframe };
};
