import type { AudioClip, AudioTrack } from "#shared/types/audio";
import { nanoid } from "nanoid";
import { computed, ref } from "vue";

export interface UseAudioTracksOptions {
	onTrackChange?: () => void;
	onClipChange?: () => void;
}

export const useAudioTracks = (options: UseAudioTracksOptions = {}) => {
	const tracks = ref<AudioTrack[]>([]);
	const selectedClipId = ref<string | null>(null);
	const selectedTrackId = ref<string | null>(null);
	const clipboard = ref<{ clip: AudioClip; trackId: string } | null>(null);

	const selectedClip = computed(() => {
		if (!selectedClipId.value) return null;
		for (const track of tracks.value) {
			const clip = track.clips.find((c) => c.id === selectedClipId.value);
			if (clip) return clip;
		}
		return null;
	});

	const selectedTrack = computed(() => {
		if (!selectedTrackId.value) return null;
		return tracks.value.find((t) => t.id === selectedTrackId.value) || null;
	});

	const createTrack = (name: string = "New Track"): AudioTrack => {
		const track: AudioTrack = {
			id: nanoid(),
			name,
			clips: [],
			volume: 1,
			muted: false,
			solo: false,
			color: `hsl(${Math.random() * 360}, 70%, 50%)`,
		};
		tracks.value.push(track);
		options.onTrackChange?.();
		return track;
	};

	const addClipToTrack = async (file: File, trackId: string): Promise<AudioClip | null> => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return null;

		const url = URL.createObjectURL(file);
		const audio = new Audio(url);
		await new Promise((resolve) => {
			audio.onloadedmetadata = resolve;
		});

		const clip: AudioClip = {
			id: nanoid(),
			name: file.name,
			url,
			duration: audio.duration,
			startTime: 0,
			endTime: audio.duration,
			offset: 0,
			volume: 1,
			fadeIn: 0,
			fadeOut: 0,
			effects: {
				reverb: 0,
				delay: 0,
				eq: { low: 0, mid: 0, high: 0 },
				compressor: 0,
				limiter: 0,
				chorus: 0,
			},
		};

		track.clips.push(clip);
		selectedClipId.value = clip.id;
		selectedTrackId.value = trackId;
		options.onClipChange?.();
		return clip;
	};

	const removeClip = (clipId: string, trackId: string): AudioClip | null => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return null;

		const clipIndex = track.clips.findIndex((c) => c.id === clipId);
		if (clipIndex === -1) return null;

		const clip = track.clips[clipIndex];
		if (!clip) return null;
		track.clips = track.clips.filter((c) => c.id !== clipId);
		if (selectedClipId.value === clipId) {
			selectedClipId.value = null;
		}
		options.onClipChange?.();
		return clip;
	};

	const updateClip = (clipId: string, updates: Partial<AudioClip>): boolean => {
		for (const track of tracks.value) {
			const clip = track.clips.find((c) => c.id === clipId);
			if (clip) {
				Object.assign(clip, updates);
				options.onClipChange?.();
				return true;
			}
		}
		return false;
	};

	const copyClip = (clipId: string, trackId: string) => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return;

		const clip = track.clips.find((c) => c.id === clipId);
		if (clip) {
			clipboard.value = { clip: { ...clip }, trackId };
		}
	};

	const pasteClip = (targetTrackId: string): AudioClip | null => {
		if (!clipboard.value) return null;

		const targetTrack = tracks.value.find((t) => t.id === targetTrackId);
		if (!targetTrack) return null;

		const newClip: AudioClip = {
			...clipboard.value.clip,
			id: nanoid(),
			name: `${clipboard.value.clip.name} (copy)`,
		};

		targetTrack.clips.push(newClip);
		selectedClipId.value = newClip.id;
		selectedTrackId.value = targetTrackId;
		options.onClipChange?.();
		return newClip;
	};

	const cutClip = (clipId: string, trackId: string): AudioClip | null => {
		copyClip(clipId, trackId);
		return removeClip(clipId, trackId);
	};

	const deleteClip = (clipId: string, trackId: string): AudioClip | null => {
		return removeClip(clipId, trackId);
	};

	const selectClip = (clipId: string | null, trackId: string | null) => {
		selectedClipId.value = clipId;
		selectedTrackId.value = trackId;
	};

	const moveClip = (clipId: string, fromTrackId: string, toTrackId: string, newOffset: number): boolean => {
		const fromTrack = tracks.value.find((t) => t.id === fromTrackId);
		const toTrack = tracks.value.find((t) => t.id === toTrackId);
		if (!fromTrack || !toTrack) return false;

		const clip = fromTrack.clips.find((c) => c.id === clipId);
		if (!clip) return false;

		fromTrack.clips = fromTrack.clips.filter((c) => c.id !== clipId);
		clip.offset = newOffset;
		toTrack.clips.push(clip);
		options.onClipChange?.();
		return true;
	};

	const trimClip = (clipId: string, trackId: string, startTime: number, endTime: number): boolean => {
		const track = tracks.value.find((t) => t.id === trackId);
		if (!track) return false;

		const clip = track.clips.find((c) => c.id === clipId);
		if (!clip) return false;

		clip.startTime = startTime;
		clip.endTime = endTime;
		options.onClipChange?.();
		return true;
	};

	return {
		tracks,
		selectedClipId,
		selectedTrackId,
		selectedClip,
		selectedTrack,
		clipboard,
		createTrack,
		addClipToTrack,
		removeClip,
		updateClip,
		copyClip,
		pasteClip,
		cutClip,
		deleteClip,
		selectClip,
		moveClip,
		trimClip,
	};
};
