export interface TrackMix {
	trackId: string;
	volume: number;
	pan: number;
	muted: boolean;
	solo: boolean;
}

export const useAudioMixer = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject } = storeToRefs(videoStore);

	const trackMixes = ref<Map<string, TrackMix>>(new Map());
	const masterVolume = ref(100);
	const masterMuted = ref(false);

	const initializeTrackMixes = () => {
		if (!currentVideoProject.value) return;

		trackMixes.value.clear();

		for (const track of currentVideoProject.value.tracks) {
			if (track.type === "audio") {
				trackMixes.value.set(track.id, {
					trackId: track.id,
					volume: track.volume || 100,
					pan: 0,
					muted: false,
					solo: false,
				});
			}
		}
	};

	const updateTrackVolume = (trackId: string, volume: number) => {
		const mix = trackMixes.value.get(trackId);
		if (mix) {
			mix.volume = Math.max(0, Math.min(100, volume));
			videoStore.updateTrack(trackId, { volume: mix.volume });
		}
	};

	const updateTrackPan = (trackId: string, pan: number) => {
		const mix = trackMixes.value.get(trackId);
		if (mix) {
			mix.pan = Math.max(-100, Math.min(100, pan));
		}
	};

	const toggleTrackMute = (trackId: string) => {
		const mix = trackMixes.value.get(trackId);
		if (mix) {
			mix.muted = !mix.muted;
			if (mix.muted) {
				videoStore.updateTrack(trackId, { volume: 0 });
			} else {
				videoStore.updateTrack(trackId, { volume: mix.volume });
			}
		}
	};

	const toggleTrackSolo = (trackId: string) => {
		const mix = trackMixes.value.get(trackId);
		if (mix) {
			mix.solo = !mix.solo;

			const hasSolo = Array.from(trackMixes.value.values()).some((m) => m.solo);

			for (const [id, m] of trackMixes.value) {
				if (hasSolo) {
					m.muted = !m.solo;
					videoStore.updateTrack(id, { volume: m.muted ? 0 : m.volume });
				} else {
					m.muted = false;
					videoStore.updateTrack(id, { volume: m.volume });
				}
			}
		}
	};

	const updateMasterVolume = (volume: number) => {
		masterVolume.value = Math.max(0, Math.min(100, volume));
	};

	const toggleMasterMute = () => {
		masterMuted.value = !masterMuted.value;
	};

	const getEffectiveVolume = (trackId: string): number => {
		const mix = trackMixes.value.get(trackId);
		if (!mix) return 0;

		if (mix.muted || masterMuted.value) return 0;

		const hasSolo = Array.from(trackMixes.value.values()).some((m) => m.solo);
		if (hasSolo && !mix.solo) return 0;

		return (mix.volume / 100) * (masterVolume.value / 100);
	};

	const resetAll = () => {
		for (const [trackId, mix] of trackMixes.value) {
			mix.volume = 100;
			mix.pan = 0;
			mix.muted = false;
			mix.solo = false;
			videoStore.updateTrack(trackId, { volume: 100 });
		}

		masterVolume.value = 100;
		masterMuted.value = false;
	};

	watch(currentVideoProject, () => {
		initializeTrackMixes();
	}, { immediate: true });

	return {
		trackMixes,
		masterVolume,
		masterMuted,
		initializeTrackMixes,
		updateTrackVolume,
		updateTrackPan,
		toggleTrackMute,
		toggleTrackSolo,
		updateMasterVolume,
		toggleMasterMute,
		getEffectiveVolume,
		resetAll,
	};
};
