import type { ColorCorrection } from "#shared/types";

export const useColorFeatures = (
	videoStore: ReturnType<typeof useVideoStore>,
	currentVideoProject: Ref<import("#shared/types").VideoProject | null>
) => {
	// Color Correction
	const updateColorCorrection = (clipId: string, updates: Partial<ColorCorrection>) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		if (!clip.colorCorrection) {
			clip.colorCorrection = { brightness: 0, contrast: 0, saturation: 0 };
		}
		Object.assign(clip.colorCorrection, updates);
	};

	const resetColorCorrection = (clipId: string) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;
		clip.colorCorrection = { brightness: 0, contrast: 0, saturation: 0 };
	};

	const getColorCorrection = (clip: import("#shared/types").VideoClip): ColorCorrection => {
		return clip.colorCorrection || { brightness: 0, contrast: 0, saturation: 0 };
	};

	// Color Grading
	const updateColorGrading = (clipId: string, colorGrading: Partial<import("#shared/types").VideoClip["colorGrading"]>) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip || (clip.type !== "video" && clip.type !== "image")) return;

		const defaultWheel = () => ({ hue: 0, saturation: 0, value: 0 });
		clip.colorGrading = {
			enabled: true,
			wheels: { shadows: defaultWheel(), midtones: defaultWheel(), highlights: defaultWheel() },
			curves: {
				rgb: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				red: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				green: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				blue: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				luma: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
			},
			temperature: 0, tint: 0, vibrance: 0,
			...clip.colorGrading, ...colorGrading,
		};
	};

	const resetColorGrading = (clipId: string) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;
		clip.colorGrading = undefined;
	};

	const getColorGrading = (clipId: string) => {
		return videoStore.getClipById(clipId)?.colorGrading || null;
	};

	return { updateColorCorrection, resetColorCorrection, getColorCorrection, updateColorGrading, resetColorGrading, getColorGrading };
};
