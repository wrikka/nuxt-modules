export const useAIFeatures = (
	videoStore: ReturnType<typeof useVideoStore>,
	currentVideoProject: Ref<import("#shared/types").VideoProject | null>
) => {
	const generateCaptions = async (clipId: string, language = "en") => {
		if (!currentVideoProject.value) return;

		const clip = videoStore.getClipById(clipId);
		if (!clip || (clip.type !== "video" && clip.type !== "audio")) return;

		try {
			const fileResponse = await fetch(clip.sourceUrl);
			const blob = await fileResponse.blob();
			const file = new File([blob], clip.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);
			formData.append("language", language);

			const response = await $fetch<{
				success: boolean;
				data: { captions: Array<{ id: number; startTime: number; endTime: number; text: string }>; language: string };
			}>("/api/ai/captions", { method: "POST", body: formData });

			if (response.success) {
				videoStore.clearCaptions();
				const captionsWithClipId = response.data.captions.map(c => ({
					...c, clipId, startTime: c.startTime + clip.startTime, endTime: c.endTime + clip.startTime,
				}));
				videoStore.addCaptions(captionsWithClipId);
			}
		} catch (error) {
			console.error("Failed to generate captions:", error);
		}
	};

	const applyNoiseReduction = async (clipId: string, strength = 50) => {
		if (!currentVideoProject.value) return;

		const clip = videoStore.getClipById(clipId);
		if (!clip || (clip.type !== "video" && clip.type !== "audio")) return;

		try {
			const fileResponse = await fetch(clip.sourceUrl);
			const blob = await fileResponse.blob();
			const file = new File([blob], clip.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);
			formData.append("strength", strength.toString());

			const response = await $fetch<{
				success: boolean;
				data: { processedUrl: string; strength: number };
			}>("/api/ai/noise-reduction", { method: "POST", body: formData });

			if (response.success) {
				videoStore.updateClipAudioSettings(clipId, {
					noiseReduction: { enabled: true, strength, processedUrl: response.data.processedUrl },
				});
			}
		} catch (error) {
			console.error("Failed to apply noise reduction:", error);
		}
	};

	return { generateCaptions, applyNoiseReduction };
};
