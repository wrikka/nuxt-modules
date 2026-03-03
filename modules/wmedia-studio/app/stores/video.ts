import { defineStore } from "pinia";
import { ref } from "vue";

export const useVideoStore = defineStore("video", () => {
	const currentVideoProject = ref<import("#shared/types").VideoProject | null>(null);
	const videoProjects = ref<import("#shared/types").VideoProject[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const currentTime = ref(0);
	const isPlaying = ref(false);
	const selectedClipId = ref<string | null>(null);
	const selectedTrackId = ref<string | null>(null);

	const createVideoProject = async (data: {
		name: string;
		description?: string;
		width: number;
		height: number;
		fps?: number;
	}) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: { projectId: string } }>("/api/video-projects", {
				method: "POST",
				body: {
					...data,
					fps: data.fps || 30,
				},
			});

			return response.data.projectId;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create video project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const loadProject = async (projectId: string) => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: import("#shared/types").VideoProject }>(`/api/video-projects/${projectId}`);
			currentVideoProject.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load video project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const saveProject = async () => {
		if (!currentVideoProject.value) {
			throw new Error("No video project to save");
		}

		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: import("#shared/types").VideoProject }>(
				`/api/video-projects/${currentVideoProject.value.id}`,
				{
					method: "PUT",
					body: currentVideoProject.value,
				},
			);

			currentVideoProject.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to save video project";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const addTrack = (type: "video" | "audio" | "text") => {
		if (!currentVideoProject.value) return;

		const track: import("#shared/types").VideoTrack = {
			id: `track-${Date.now()}`,
			type,
			name: `${type} track ${currentVideoProject.value.tracks.length + 1}`,
			locked: false,
			visible: true,
			volume: type === "audio" ? 100 : undefined,
		};

		currentVideoProject.value.tracks.push(track);
	};

	const removeTrack = (trackId: string) => {
		if (!currentVideoProject.value) return;

		currentVideoProject.value.tracks = currentVideoProject.value.tracks.filter((t) => t.id !== trackId);
		currentVideoProject.value.clips = currentVideoProject.value.clips.filter((c) => c.trackId !== trackId);
	};

	const addClip = (
		clip: Omit<import("#shared/types").VideoClip, "id" | "transform"> & {
			transform?: Partial<import("#shared/types").TransformProperties>;
		},
	) => {
		if (!currentVideoProject.value) return;

		const newClip: import("#shared/types").VideoClip = {
			...clip,
			id: `clip-${Date.now()}`,
			transform: {
				x: clip.transform?.x || [{ id: `kf-x-${Date.now()}`, time: 0, value: 0, easing: "linear" }],
				y: clip.transform?.y || [{ id: `kf-y-${Date.now()}`, time: 0, value: 0, easing: "linear" }],
				scale: clip.transform?.scale || [{ id: `kf-scale-${Date.now()}`, time: 0, value: 1, easing: "linear" }],
				rotation: clip.transform?.rotation
					|| [{ id: `kf-rotation-${Date.now()}`, time: 0, value: 0, easing: "linear" }],
				opacity: clip.transform?.opacity || [{ id: `kf-opacity-${Date.now()}`, time: 0, value: 1, easing: "linear" }],
			},
		};

		// Ensure transform is not added to audio clips
		if (clip.type === "audio") {
			delete (newClip as Partial<VideoClip>).transform;
		}

		currentVideoProject.value.clips.push(newClip);
		currentVideoProject.value.duration = Math.max(
			currentVideoProject.value.duration,
			clip.endTime,
		);
	};

	const removeClip = (clipId: string) => {
		if (!currentVideoProject.value) return;

		currentVideoProject.value.clips = currentVideoProject.value.clips.filter((c) => c.id !== clipId);
	};

	const updateClip = (clipId: string, updates: Partial<import("#shared/types").VideoClip>) => {
		if (!currentVideoProject.value) return;

		const clip = currentVideoProject.value.clips.find((c) => c.id === clipId);
		if (clip) {
			Object.assign(clip, updates);
		}
	};

	const moveClip = (clipId: string, newTrackId: string, newStartTime: number) => {
		if (!currentVideoProject.value) return;

		const clip = currentVideoProject.value.clips.find((c) => c.id === clipId);
		if (clip) {
			clip.trackId = newTrackId;
			const duration = clip.endTime - clip.startTime;
			clip.startTime = newStartTime;
			clip.endTime = newStartTime + duration;
		}
	};

	const trimClip = (clipId: string, newStartTime: number, newEndTime: number) => {
		if (!currentVideoProject.value) return;

		const clip = currentVideoProject.value.clips.find((c) => c.id === clipId);
		if (clip) {
			clip.startTime = newStartTime;
			clip.endTime = newEndTime;
			clip.duration = newEndTime - newStartTime;
		}
	};

	const mergeClips = (clipId1: string, clipId2: string) => {
		if (!currentVideoProject.value) return;

		const clip1 = currentVideoProject.value.clips.find((c) => c.id === clipId1);
		const clip2 = currentVideoProject.value.clips.find((c) => c.id === clipId2);

		if (!clip1 || !clip2 || clip1.trackId !== clip2.trackId) return;

		const mergedClip: import("#shared/types").VideoClip = {
			...clip1,
			id: `clip-${Date.now()}`,
			startTime: Math.min(clip1.startTime, clip2.startTime),
			endTime: Math.max(clip1.endTime, clip2.endTime),
			duration: Math.max(clip1.endTime, clip2.endTime) - Math.min(clip1.startTime, clip2.startTime),
			name: `${clip1.name} + ${clip2.name}`,
		};

		currentVideoProject.value.clips = currentVideoProject.value.clips.filter((c) =>
			c.id !== clipId1 && c.id !== clipId2
		);
		currentVideoProject.value.clips.push(mergedClip);
	};

	const splitClip = (clipId: string, splitTime: number) => {
		if (!currentVideoProject.value) return;

		const clipIndex = currentVideoProject.value.clips.findIndex((c) => c.id === clipId);
		if (clipIndex === -1) return;

		const clip = currentVideoProject.value.clips[clipIndex];
		if (!clip || splitTime <= clip.startTime || splitTime >= clip.endTime) return;

		const firstClipDuration = splitTime - clip.startTime;
		const secondClipDuration = clip.endTime - splitTime;

		const firstClip: import("#shared/types").VideoClip = {
			id: `clip-${Date.now()}-1`,
			trackId: clip.trackId,
			startTime: clip.startTime,
			endTime: splitTime,
			duration: firstClipDuration,
			sourceUrl: clip.sourceUrl,
			type: clip.type,
			name: clip.name,
			thumbnailUrl: clip.thumbnailUrl,
			// Deep copy transform properties to avoid reference issues
			transform: clip.transform ? JSON.parse(JSON.stringify(clip.transform)) : undefined,
			effects: clip.effects ? [...clip.effects] : undefined,
			audioSettings: clip.audioSettings ? { ...clip.audioSettings } : undefined,
		};

		const secondClip: import("#shared/types").VideoClip = {
			id: `clip-${Date.now()}-2`,
			trackId: clip.trackId,
			startTime: splitTime,
			endTime: clip.endTime,
			duration: secondClipDuration,
			sourceUrl: clip.sourceUrl,
			type: clip.type,
			name: clip.name,
			thumbnailUrl: clip.thumbnailUrl,
			transform: clip.transform ? JSON.parse(JSON.stringify(clip.transform)) : undefined,
			effects: clip.effects ? [...clip.effects] : undefined,
			audioSettings: clip.audioSettings ? { ...clip.audioSettings } : undefined,
		};

		currentVideoProject.value.clips.splice(clipIndex, 1, firstClip, secondClip);
	};

	const updateTrack = (trackId: string, updates: Partial<import("#shared/types").VideoTrack>) => {
		if (!currentVideoProject.value) return;

		const track = currentVideoProject.value.tracks.find((t) => t.id === trackId);
		if (!track) return;

		Object.assign(track, updates);
	};

	const updateClipAudioSettings = (
		clipId: string,
		settings: Partial<import("#shared/types").VideoClip["audioSettings"]>,
	) => {
		if (!currentVideoProject.value) return;

		const clip = currentVideoProject.value.clips.find((c) => c.id === clipId);
		if (clip) {
			clip.audioSettings = {
				volume: 100,
				fadeIn: 0,
				fadeOut: 0,
				muted: false,
				...clip.audioSettings,
				...settings,
			};
		}
	};

	const toggleClipMute = (clipId: string) => {
		if (!currentVideoProject.value) return;

		const clip = currentVideoProject.value.clips.find((c) => c.id === clipId);
		if (clip && clip.audioSettings) {
			clip.audioSettings.muted = !clip.audioSettings.muted;
		}
	};

	const updateTrackVolume = (trackId: string, volume: number) => {
		if (!currentVideoProject.value) return;

		const track = currentVideoProject.value.tracks.find((t) => t.id === trackId);
		if (track && track.volume !== undefined) {
			track.volume = Math.max(0, Math.min(100, volume));
		}
	};

	const toggleTrackMute = (trackId: string) => {
		if (!currentVideoProject.value) return;

		const track = currentVideoProject.value.tracks.find((t) => t.id === trackId);
		if (track) {
			track.volume = track.volume === 0 ? 100 : 0;
		}
	};

	const setCurrentTime = (time: number) => {
		currentTime.value = Math.max(0, time);
	};

	const togglePlayback = () => {
		isPlaying.value = !isPlaying.value;
	};

	const selectClip = (clipId: string | null) => {
		selectedClipId.value = clipId;
	};

	const selectTrack = (trackId: string | null) => {
		selectedTrackId.value = trackId;
	};

	const getClipsByTrack = (trackId: string) => {
		if (!currentVideoProject.value) return [];
		return currentVideoProject.value.clips.filter((c) => c.trackId === trackId);
	};

	const getClipById = (clipId: string) => {
		if (!currentVideoProject.value) return null;
		return currentVideoProject.value.clips.find((c) => c.id === clipId);
	};

	// --- Media Asset Management ---
	const addMediaAsset = (asset: Omit<import("#shared/types").MediaAsset, "id" | "createdAt">) => {
		if (!currentVideoProject.value) return;

		const newAsset: import("#shared/types").MediaAsset = {
			...asset,
			id: `asset-${Date.now()}`,
			createdAt: new Date(),
			tags: asset.tags || [],
		};

		currentVideoProject.value.mediaAssets.push(newAsset);
	};

	const removeMediaAsset = (assetId: string) => {
		if (!currentVideoProject.value) return;

		currentVideoProject.value.mediaAssets = currentVideoProject.value.mediaAssets.filter(
			(a) => a.id !== assetId,
		);
	};

	const updateMediaAsset = (assetId: string, updates: Partial<import("#shared/types").MediaAsset>) => {
		if (!currentVideoProject.value) return;

		const asset = currentVideoProject.value.mediaAssets.find((a) => a.id === assetId);
		if (asset) {
			Object.assign(asset, updates);
		}
	};

	const searchMediaAssets = (query: string) => {
		if (!currentVideoProject.value) return [];

		const lowerQuery = query.toLowerCase();
		return currentVideoProject.value.mediaAssets.filter(
			(a) =>
				a.name.toLowerCase().includes(lowerQuery)
				|| a.tags?.some((t) => t.toLowerCase().includes(lowerQuery)),
		);
	};

	// --- Caption Management ---
	const addCaptions = (captions: Omit<import("#shared/types").Caption, "id">[]) => {
		if (!currentVideoProject.value) return;

		const newCaptions: import("#shared/types").Caption[] = captions.map((c, index) => ({
			...c,
			id: currentVideoProject.value!.captions.length + index + 1,
		}));

		currentVideoProject.value.captions.push(...newCaptions);
	};

	const updateCaption = (captionId: number, updates: Partial<import("#shared/types").Caption>) => {
		if (!currentVideoProject.value) return;

		const caption = currentVideoProject.value.captions.find((c) => c.id === captionId);
		if (caption) {
			Object.assign(caption, updates);
		}
	};

	const removeCaption = (captionId: number) => {
		if (!currentVideoProject.value) return;

		currentVideoProject.value.captions = currentVideoProject.value.captions.filter(
			(c) => c.id !== captionId,
		);
	};

	const clearCaptions = () => {
		if (!currentVideoProject.value) return;
		currentVideoProject.value.captions = [];
	};

	// History management
	const history = ref<any[]>([]);
	const historyIndex = ref(-1);
	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const undo = () => {
		if (canUndo.value) {
			historyIndex.value--;
		}
	};

	const redo = () => {
		if (canRedo.value) {
			historyIndex.value++;
		}
	};

	const jumpToHistoryState = (index: number) => {
		if (index >= 0 && index < history.value.length) {
			historyIndex.value = index;
		}
	};

	return {
		currentVideoProject,
		videoProjects,
		loading,
		error,
		currentTime,
		isPlaying,
		selectedClipId,
		selectedTrackId,
		history,
		historyIndex,
		canUndo,
		canRedo,
		createVideoProject,
		loadProject,
		saveProject,
		addTrack,
		removeTrack,
		addClip,
		removeClip,
		updateClip,
		moveClip,
		trimClip,
		mergeClips,
		splitClip,
		updateTrack,
		updateClipAudioSettings,
		toggleClipMute,
		updateTrackVolume,
		toggleTrackMute,
		setCurrentTime,
		togglePlayback,
		selectClip,
		selectTrack,
		getClipsByTrack,
		getClipById,
		addMediaAsset,
		removeMediaAsset,
		updateMediaAsset,
		searchMediaAssets,
		addCaptions,
		updateCaption,
		removeCaption,
		clearCaptions,
		undo,
		redo,
		jumpToHistoryState,
	};
});
