import type { ColorCorrection, VideoClip, VideoTransition } from "#shared/types";
import type { AnimatableProperty } from "#shared/types/project";
import { getActiveClipsAtTime, getTransformPropertiesAtTime, getTransitionAtTime } from "#shared/utils/animation";
import { formatTime } from "#shared/utils/formatters";
import { usePlayback } from "./usePlayback";
import { useClipOperations } from "./useClipOperations";
import { useKeyframeAnimation } from "./useKeyframeAnimation";
import { useColorFeatures } from "./useColorFeatures";
import { useMediaAssets } from "./useMediaAssets";
import { useAIFeatures } from "./useAIFeatures";

export const useVideoEditor = () => {
	const videoStore = useVideoStore();
	const { currentTime, isPlaying, selectedClipId, selectedTrackId, currentVideoProject } = storeToRefs(videoStore);

	const playback = usePlayback(videoStore, currentTime, isPlaying, currentVideoProject);
	const clips = useClipOperations(videoStore, currentVideoProject, selectedClipId, currentTime);
	const keyframes = useKeyframeAnimation(videoStore, currentVideoProject);
	const colors = useColorFeatures(videoStore, currentVideoProject);
	const media = useMediaAssets(videoStore, currentVideoProject);
	const ai = useAIFeatures(videoStore, currentVideoProject);

	const selectedClip = computed(() => {
		if (!selectedClipId.value || !currentVideoProject.value) return null;
		return currentVideoProject.value.clips.find(c => c.id === selectedClipId.value) || null;
	});

	const getActiveClipsAtTimeLocal = (time: number): VideoClip[] => {
		return currentVideoProject.value ? getActiveClipsAtTime(currentVideoProject.value, time) : [];
	};

	return {
		// State
		currentTime, isPlaying, selectedClipId, selectedTrackId, selectedClip, currentVideoProject,
		// Playback
		...playback,
		// Clip operations
		...clips,
		// Keyframes
		...keyframes,
		// Transitions (re-export from utils)
		addTransition: (clipId: string, type: VideoTransition["type"], duration: number, position: "in" | "out") => {
			const clip = videoStore.getClipById(clipId);
			if (!clip) return;
			const transition: VideoTransition = { type, duration };
			if (position === "in") clip.transitionIn = transition;
			else clip.transitionOut = transition;
		},
		removeTransition: (clipId: string, position: "in" | "out") => {
			const clip = videoStore.getClipById(clipId);
			if (!clip) return;
			if (position === "in") delete clip.transitionIn;
			else delete clip.transitionOut;
		},
		getTransitionAtTime,
		getTransformPropertiesAtTime,
		// Color
		...colors,
		// Media
		...media,
		// AI
		...ai,
		// Utils
		getActiveClipsAtTime: getActiveClipsAtTimeLocal,
		formatTime,
	};
};
