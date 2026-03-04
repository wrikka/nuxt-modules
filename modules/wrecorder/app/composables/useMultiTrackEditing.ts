export type TrackType = "video" | "audio" | "screen" | "webcam";

export interface TrackClip {
	id: string;
	trackId: string;
	startTime: number;
	duration: number;
	sourceStart: number;
	sourceEnd: number;
	blob?: Blob;
	url?: string;
}

export interface Track {
	id: string;
	type: TrackType;
	name: string;
	isMuted: boolean;
	isVisible: boolean;
	volume: number;
	opacity: number;
	clips: TrackClip[];
	zIndex: number;
}

export interface MultiTrackState {
	tracks: Track[];
	selectedTrackId?: string;
	selectedClipId?: string;
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	zoom: number;
}

export const useMultiTrackEditing = () => {
	const state = reactive<MultiTrackState>({
		tracks: [],
		currentTime: 0,
		duration: 0,
		isPlaying: false,
		zoom: 1,
	});

	let playbackInterval: ReturnType<typeof setInterval> | null = null;

	const addTrack = (type: TrackType, name?: string): string => {
		const id = `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const track: Track = {
			id,
			type,
			name: name || `${type} ${state.tracks.filter(t => t.type === type).length + 1}`,
			isMuted: false,
			isVisible: true,
			volume: 1,
			opacity: 1,
			clips: [],
			zIndex: state.tracks.length,
		};
		state.tracks.push(track);
		return id;
	};

	const removeTrack = (trackId: string) => {
		state.tracks = state.tracks.filter(t => t.id !== trackId);
		if (state.selectedTrackId === trackId) {
			state.selectedTrackId = undefined;
		}
		updateZIndices();
	};

	const selectTrack = (trackId: string) => {
		state.selectedTrackId = trackId;
	};

	const moveTrackUp = (trackId: string) => {
		const index = state.tracks.findIndex(t => t.id === trackId);
		if (index > 0) {
			const [track] = state.tracks.splice(index, 1);
			state.tracks.splice(index - 1, 0, track);
			updateZIndices();
		}
	};

	const moveTrackDown = (trackId: string) => {
		const index = state.tracks.findIndex(t => t.id === trackId);
		if (index < state.tracks.length - 1) {
			const [track] = state.tracks.splice(index, 1);
			state.tracks.splice(index + 1, 0, track);
			updateZIndices();
		}
	};

	const updateZIndices = () => {
		state.tracks.forEach((track, index) => {
			track.zIndex = index;
		});
	};

	const addClip = (
		trackId: string,
		blob: Blob,
		startTime: number,
		duration: number,
		url?: string
	): string => {
		const track = state.tracks.find(t => t.id === trackId);
		if (!track) return "";

		const id = `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		const clip: TrackClip = {
			id,
			trackId,
			startTime,
			duration,
			sourceStart: 0,
			sourceEnd: duration,
			blob,
			url,
		};

		track.clips.push(clip);
		updateDuration();
		return id;
	};

	const removeClip = (clipId: string) => {
		state.tracks.forEach(track => {
			track.clips = track.clips.filter(c => c.id !== clipId);
		});
		if (state.selectedClipId === clipId) {
			state.selectedClipId = undefined;
		}
		updateDuration();
	};

	const moveClip = (clipId: string, newStartTime: number) => {
		for (const track of state.tracks) {
			const clip = track.clips.find(c => c.id === clipId);
			if (clip) {
				clip.startTime = Math.max(0, newStartTime);
				updateDuration();
				return;
			}
		}
	};

	const trimClip = (clipId: string, sourceStart: number, sourceEnd: number) => {
		for (const track of state.tracks) {
			const clip = track.clips.find(c => c.id === clipId);
			if (clip) {
				clip.sourceStart = Math.max(0, sourceStart);
				clip.sourceEnd = Math.max(clip.sourceStart, sourceEnd);
				clip.duration = clip.sourceEnd - clip.sourceStart;
				updateDuration();
				return;
			}
		}
	};

	const splitClip = (clipId: string, splitTime: number): [string, string] | null => {
		for (const track of state.tracks) {
			const clipIndex = track.clips.findIndex(c => c.id === clipId);
			const clip = track.clips[clipIndex];
			
			if (clip) {
				const relativeSplitTime = splitTime - clip.startTime + clip.sourceStart;
				
				if (relativeSplitTime <= clip.sourceStart || relativeSplitTime >= clip.sourceEnd) {
					return null;
				}

				const id1 = `clip-${Date.now()}-1`;
				const id2 = `clip-${Date.now()}-2`;

				const clip1: TrackClip = {
					id: id1,
					trackId: track.id,
					startTime: clip.startTime,
					duration: relativeSplitTime - clip.sourceStart,
					sourceStart: clip.sourceStart,
					sourceEnd: relativeSplitTime,
					blob: clip.blob,
					url: clip.url,
				};

				const clip2: TrackClip = {
					id: id2,
					trackId: track.id,
					startTime: clip.startTime + clip1.duration,
					duration: clip.sourceEnd - relativeSplitTime,
					sourceStart: relativeSplitTime,
					sourceEnd: clip.sourceEnd,
					blob: clip.blob,
					url: clip.url,
				};

				track.clips.splice(clipIndex, 1, clip1, clip2);
				updateDuration();

				return [id1, id2];
			}
		}
		return null;
	};

	const updateDuration = () => {
		let maxEnd = 0;
		state.tracks.forEach(track => {
			track.clips.forEach(clip => {
				const endTime = clip.startTime + clip.duration;
				if (endTime > maxEnd) {
					maxEnd = endTime;
				}
			});
		});
		state.duration = maxEnd;
	};

	const setTrackVolume = (trackId: string, volume: number) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.volume = Math.max(0, Math.min(2, volume));
		}
	};

	const setTrackOpacity = (trackId: string, opacity: number) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.opacity = Math.max(0, Math.min(1, opacity));
		}
	};

	const muteTrack = (trackId: string) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.isMuted = true;
		}
	};

	const unmuteTrack = (trackId: string) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.isMuted = false;
		}
	};

	const hideTrack = (trackId: string) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.isVisible = false;
		}
	};

	const showTrack = (trackId: string) => {
		const track = state.tracks.find(t => t.id === trackId);
		if (track) {
			track.isVisible = true;
		}
	};

	const play = () => {
		if (state.isPlaying) return;
		state.isPlaying = true;
		
		playbackInterval = setInterval(() => {
			state.currentTime += 1000 / 30; // 30fps
			if (state.currentTime >= state.duration) {
				pause();
				state.currentTime = 0;
			}
		}, 1000 / 30);
	};

	const pause = () => {
		state.isPlaying = false;
		if (playbackInterval) {
			clearInterval(playbackInterval);
			playbackInterval = null;
		}
	};

	const seek = (time: number) => {
		state.currentTime = Math.max(0, Math.min(state.duration, time));
	};

	const getActiveClipsAtTime = (time: number): TrackClip[] => {
		const active: TrackClip[] = [];
		state.tracks.forEach(track => {
			const clip = track.clips.find(
				c => time >= c.startTime && time < c.startTime + c.duration
			);
			if (clip) {
				active.push(clip);
			}
		});
		return active;
	};

	const exportTimeline = () => {
		return JSON.stringify({
			tracks: state.tracks.map(t => ({
				...t,
				clips: t.clips.map(c => ({
					...c,
					blob: undefined, // Don't export blobs
				})),
			})),
			duration: state.duration,
		}, null, 2);
	};

	const clearTimeline = () => {
		state.tracks = [];
		state.selectedTrackId = undefined;
		state.selectedClipId = undefined;
		state.currentTime = 0;
		state.duration = 0;
		pause();
	};

	onUnmounted(() => {
		pause();
	});

	return {
		state: readonly(state),
		tracks: computed(() => state.tracks),
		currentTime: computed(() => state.currentTime),
		duration: computed(() => state.duration),
		isPlaying: computed(() => state.isPlaying),
		addTrack,
		removeTrack,
		selectTrack,
		moveTrackUp,
		moveTrackDown,
		addClip,
		removeClip,
		moveClip,
		trimClip,
		splitClip,
		setTrackVolume,
		setTrackOpacity,
		muteTrack,
		unmuteTrack,
		hideTrack,
		showTrack,
		play,
		pause,
		seek,
		getActiveClipsAtTime,
		exportTimeline,
		clearTimeline,
	};
};
