import type { ColorCorrection, VideoClip, VideoTransition } from "#shared/types";
import type { AnimatableProperty } from "#shared/types/project";
import { getActiveClipsAtTime, getTransformPropertiesAtTime, getTransitionAtTime } from "#shared/utils/animation";
import { formatTime } from "#shared/utils/formatters";
import { nanoid } from "nanoid";
import { useMediaBunny } from "./useMediaBunny";

export const useVideoEditor = () => {
	const videoStore = useVideoStore();
	const { currentTime, isPlaying, selectedClipId, selectedTrackId, currentVideoProject } = storeToRefs(videoStore);

	const { readMediaMetadata } = useMediaBunny();

	let playbackInterval: ReturnType<typeof setInterval> | null = null;

	const startPlayback = () => {
		if (playbackInterval) return;

		videoStore.togglePlayback();
		playbackInterval = setInterval(() => {
			if (currentVideoProject.value) {
				const newTime = currentTime.value + 0.033;
				if (newTime >= currentVideoProject.value.duration) {
					stopPlayback();
					videoStore.setCurrentTime(0);
				} else {
					videoStore.setCurrentTime(newTime);
				}
			}
		}, 33);
	};

	const stopPlayback = () => {
		if (playbackInterval) {
			clearInterval(playbackInterval);
			playbackInterval = null;
		}
		if (isPlaying.value) {
			videoStore.togglePlayback();
		}
	};

	const togglePlayback = () => {
		if (isPlaying.value) {
			stopPlayback();
		} else {
			startPlayback();
		}
	};

	const seekTo = (time: number) => {
		videoStore.setCurrentTime(time);
	};

	const seekToStart = () => {
		videoStore.setCurrentTime(0);
	};

	const seekToEnd = () => {
		if (currentVideoProject.value) {
			videoStore.setCurrentTime(currentVideoProject.value.duration);
		}
	};

	const stepForward = () => {
		seekTo(currentTime.value + 0.033);
	};

	const stepBackward = () => {
		seekTo(Math.max(0, currentTime.value - 0.033));
	};

	const addVideoTrack = () => {
		videoStore.addTrack("video");
	};

	const addAudioTrack = () => {
		videoStore.addTrack("audio");
	};

	const addTextTrack = () => {
		videoStore.addTrack("text");
	};

	const addVideoClip = async (file: File, trackId: string, startTime: number) => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await $fetch<{ data: { url: string; thumbnailUrl: string } }>(
			"/api/video/upload",
			{
				method: "POST",
				body: formData,
			},
		);

		const metadata = await readMediaMetadata(file);

		videoStore.addClip({
			trackId,
			startTime,
			endTime: startTime + metadata.duration,
			duration: metadata.duration,
			sourceUrl: response.data.url,
			type: "video",
			name: file.name,
			thumbnailUrl: response.data.thumbnailUrl,
		});
	};

	const addImageClip = async (file: File, trackId: string, startTime: number, duration: number = 5) => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await $fetch<{ data: { url: string } }>("/api/assets/upload", {
			method: "POST",
			body: formData,
		});

		videoStore.addClip({
			trackId,
			startTime,
			endTime: startTime + duration,
			duration,
			sourceUrl: response.data.url,
			type: "image",
			name: file.name,
		});
	};

	const addAudioClip = async (file: File, trackId: string, startTime: number) => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await $fetch<{ data: { url: string } }>("/api/audio/upload", {
			method: "POST",
			body: formData,
		});

		const metadata = await readMediaMetadata(file);

		videoStore.addClip({
			trackId,
			startTime,
			endTime: startTime + metadata.duration,
			duration: metadata.duration,
			sourceUrl: response.data.url,
			type: "audio",
			name: file.name,
		});
	};

	const addTextClip = (trackId: string, startTime: number, text: string, duration: number = 5) => {
		videoStore.addClip({
			trackId,
			startTime,
			endTime: startTime + duration,
			duration,
			sourceUrl: "",
			type: "text",
			name: "Text",
		});
	};

	const deleteSelectedClip = () => {
		if (selectedClipId.value) {
			videoStore.removeClip(selectedClipId.value);
			videoStore.selectClip(null);
		}
	};

	const splitSelectedClip = () => {
		if (selectedClipId.value) {
			videoStore.splitClip(selectedClipId.value, currentTime.value);
		}
	};

	const trimSelectedClip = (
		clipId: string,
		{ startTime, endTime }: { startTime: number; endTime: number },
	) => {
		if (!clipId) return;
		videoStore.trimClip(clipId, startTime, endTime);
	};

	const mergeSelectedClips = () => {
		if (!selectedClipId.value || !currentVideoProject.value) return;

		const selectedClip = currentVideoProject.value.clips.find((c) => c.id === selectedClipId.value);
		if (!selectedClip) return;

		const trackClips = currentVideoProject.value.clips.filter((c) =>
			c.trackId === selectedClip.trackId && c.id !== selectedClipId.value
		);

		for (const clip of trackClips) {
			if (clip.startTime <= selectedClip.endTime && clip.endTime >= selectedClip.startTime) {
				videoStore.mergeClips(selectedClipId.value, clip.id);
				return;
			}
		}
	};

	const duplicateSelectedClip = () => {
		if (selectedClipId.value && currentVideoProject.value) {
			const clip = videoStore.getClipById(selectedClipId.value);
			if (clip) {
				videoStore.addClip({
					...clip,
					startTime: clip.endTime,
					endTime: clip.endTime + clip.duration,
				});
			}
		}
	};

	// --- Keyframe and Animation Logic ---

	const addKeyframe = (clipId: string, property: AnimatableProperty, time: number, value: number) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip || !clip.transform) return;

		const newKeyframe: import("#shared/types").Keyframe = {
			id: `kf-${property}-${nanoid()}`,
			time,
			value,
			easing: "linear",
		};

		const keyframes = clip.transform[property];
		const existingKeyframeIndex = keyframes.findIndex(kf => kf.time === time);

		if (existingKeyframeIndex !== -1) {
			// Update existing keyframe
			const existingKeyframe = keyframes[existingKeyframeIndex];
			if (!existingKeyframe) return;
			keyframes[existingKeyframeIndex] = { ...existingKeyframe, value };
		} else {
			// Add new keyframe and sort
			keyframes.push(newKeyframe);
			keyframes.sort((a, b) => a.time - b.time);
		}
	};

	const removeKeyframe = (clipId: string, property: AnimatableProperty, keyframeId: string) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip || !clip.transform) return;

		const keyframes = clip.transform[property];
		const index = keyframes.findIndex(kf => kf.id === keyframeId);
		if (index !== -1) {
			// Prevent removing the last keyframe
			if (keyframes.length > 1) {
				keyframes.splice(index, 1);
			}
		}
	};

	const updateKeyframe = (
		clipId: string,
		property: AnimatableProperty,
		keyframeId: string,
		updates: Partial<import("#shared/types").Keyframe>,
	) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip || !clip.transform) return;

		const keyframes = clip.transform[property];
		const keyframe = keyframes.find(kf => kf.id === keyframeId);
		if (keyframe) {
			Object.assign(keyframe, updates);
		}
	};

	// --- Transition Logic ---

	const addTransition = (clipId: string, type: VideoTransition["type"], duration: number, position: "in" | "out") => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		const transition: VideoTransition = { type, duration };
		if (position === "in") {
			clip.transitionIn = transition;
		} else {
			clip.transitionOut = transition;
		}
	};

	const removeTransition = (clipId: string, position: "in" | "out") => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		if (position === "in") {
			delete clip.transitionIn;
		} else {
			delete clip.transitionOut;
		}
	};

	// --- Color Correction Logic ---

	const updateColorCorrection = (clipId: string, updates: Partial<ColorCorrection>) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		if (!clip.colorCorrection) {
			clip.colorCorrection = {
				brightness: 0,
				contrast: 0,
				saturation: 0,
			};
		}

		Object.assign(clip.colorCorrection, updates);
	};

	const resetColorCorrection = (clipId: string) => {
		if (!currentVideoProject.value) return;
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		clip.colorCorrection = {
			brightness: 0,
			contrast: 0,
			saturation: 0,
		};
	};

	const getColorCorrection = (clip: VideoClip): ColorCorrection => {
		return clip.colorCorrection || { brightness: 0, contrast: 0, saturation: 0 };
	};

	const addMediaAssetToBin = async (file: File, type: "video" | "audio" | "image") => {
		if (!currentVideoProject.value) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const uploadEndpoint = type === "video" ? "/api/video/upload" : "/api/assets/upload";
			const response = await $fetch<{ data: { url: string; thumbnailUrl?: string } }>(
				uploadEndpoint,
				{
					method: "POST",
					body: formData,
				},
			);

			const metadata = await readMediaMetadata(file);

			videoStore.addMediaAsset({
				name: file.name,
				type,
				url: response.data.url,
				thumbnailUrl: response.data.thumbnailUrl,
				duration: metadata.duration,
				fileSize: file.size,
				tags: [],
			});
		} catch (error) {
			console.error("Failed to upload media asset:", error);
		}
	};

	const autoTagMediaAsset = async (assetId: string) => {
		if (!currentVideoProject.value) return;

		const asset = currentVideoProject.value.mediaAssets.find((a) => a.id === assetId);
		if (!asset || asset.type === "audio") return; // Skip audio for now

		try {
			// Fetch the file from the asset URL
			const fileResponse = await fetch(asset.url);
			const blob = await fileResponse.blob();
			const file = new File([blob], asset.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);

			const response = await $fetch<{ success: boolean; data: { tags: string[] } }>(
				"/api/ai/auto-tag",
				{
					method: "POST",
					body: formData,
				},
			);

			if (response.success) {
				videoStore.updateMediaAsset(assetId, { tags: response.data.tags });
			}
		} catch (error) {
			console.error("Failed to auto-tag asset:", error);
		}
	};

	const generateCaptions = async (clipId: string, language = "en") => {
		if (!currentVideoProject.value) return;

		const clip = videoStore.getClipById(clipId);
		if (!clip || (clip.type !== "video" && clip.type !== "audio")) return;

		try {
			// Fetch the file from the clip source URL
			const fileResponse = await fetch(clip.sourceUrl);
			const blob = await fileResponse.blob();
			const file = new File([blob], clip.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);
			formData.append("language", language);

			const response = await $fetch<{
				success: boolean;
				data: { captions: Array<{ id: number; startTime: number; endTime: number; text: string }>; language: string };
			}>("/api/ai/captions", {
				method: "POST",
				body: formData,
			});

			if (response.success) {
				// Clear existing captions for this clip
				videoStore.clearCaptions();

				// Add new captions with clipId
				const captionsWithClipId = response.data.captions.map((c) => ({
					...c,
					clipId,
					startTime: c.startTime + clip.startTime, // Adjust to timeline time
					endTime: c.endTime + clip.startTime,
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
			// Fetch the file from the clip source URL
			const fileResponse = await fetch(clip.sourceUrl);
			const blob = await fileResponse.blob();
			const file = new File([blob], clip.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);
			formData.append("strength", strength.toString());

			const response = await $fetch<{
				success: boolean;
				data: { processedUrl: string; strength: number };
			}>("/api/ai/noise-reduction", {
				method: "POST",
				body: formData,
			});

			if (response.success) {
				// Update clip with noise reduction settings
				videoStore.updateClipAudioSettings(clipId, {
					noiseReduction: {
						enabled: true,
						strength,
						processedUrl: response.data.processedUrl,
					},
				});
			}
		} catch (error) {
			console.error("Failed to apply noise reduction:", error);
		}
	};

	const updateColorGrading = (clipId: string, colorGrading: Partial<VideoClip["colorGrading"]>) => {
		if (!currentVideoProject.value) return;

		const clip = videoStore.getClipById(clipId);
		if (!clip || (clip.type !== "video" && clip.type !== "image")) return;

		const defaultWheel = () => ({ hue: 0, saturation: 0, value: 0 });

		clip.colorGrading = {
			enabled: true,
			wheels: {
				shadows: defaultWheel(),
				midtones: defaultWheel(),
				highlights: defaultWheel(),
			},
			curves: {
				rgb: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				red: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				green: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				blue: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
				luma: [{ x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }],
			},
			temperature: 0,
			tint: 0,
			vibrance: 0,
			...clip.colorGrading,
			...colorGrading,
		};
	};

	const resetColorGrading = (clipId: string) => {
		if (!currentVideoProject.value) return;

		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		clip.colorGrading = undefined;
	};

	const getColorGrading = (clipId: string): VideoClip["colorGrading"] | null => {
		const clip = videoStore.getClipById(clipId);
		return clip?.colorGrading || null;
	};

	const getActiveClipsAtTimeLocal = (time: number): import("#shared/types").VideoClip[] => {
		if (!currentVideoProject.value) return [];
		return getActiveClipsAtTime(currentVideoProject.value, time);
	};

	const selectedClip = computed(() => {
		if (!selectedClipId.value || !currentVideoProject.value) return null;
		return currentVideoProject.value.clips.find((c) => c.id === selectedClipId.value) || null;
	});

	const getClipsByTrack = (trackId: string): VideoClip[] => {
		if (!currentVideoProject.value) return [];
		return currentVideoProject.value.clips.filter((c) => c.trackId === trackId);
	};

	const selectClip = (clipId: string | null) => {
		videoStore.selectClip(clipId);
	};

	const selectTrack = (trackId: string | null) => {
		videoStore.selectTrack(trackId);
	};

	onUnmounted(() => {
		if (playbackInterval) {
			clearInterval(playbackInterval);
		}
	});

	return {
		currentTime,
		isPlaying,
		selectedClipId,
		selectedTrackId,
		selectedClip,
		currentVideoProject,
		startPlayback,
		stopPlayback,
		togglePlayback,
		seekTo,
		seekToStart,
		seekToEnd,
		stepForward,
		stepBackward,
		addVideoTrack,
		addAudioTrack,
		addTextTrack,
		addVideoClip,
		addImageClip,
		addAudioClip,
		addTextClip,
		deleteSelectedClip,
		splitSelectedClip,
		trimSelectedClip,
		mergeSelectedClips,
		duplicateSelectedClip,
		getActiveClipsAtTime: getActiveClipsAtTimeLocal,
		getTransformPropertiesAtTime,
		addKeyframe,
		removeKeyframe,
		updateKeyframe,
		addTransition,
		removeTransition,
		getTransitionAtTime,
		updateColorCorrection,
		resetColorCorrection,
		getColorCorrection,
		addMediaAssetToBin,
		autoTagMediaAsset,
		generateCaptions,
		applyNoiseReduction,
		updateColorGrading,
		resetColorGrading,
		getColorGrading,
		getClipsByTrack,
		selectClip,
		selectTrack,
		formatTime,
	};
};
