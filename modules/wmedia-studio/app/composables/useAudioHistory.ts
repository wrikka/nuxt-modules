import type { AudioClip, AudioHistoryAction, AudioMarker, AudioRegion, AudioTrack } from "#shared/types/audio";
import { computed, ref } from "vue";

export const useAudioHistory = () => {
	const history = ref<AudioHistoryAction[]>([]);
	const historyIndex = ref(-1);
	const maxHistorySize = 100;

	const canUndo = computed(() => historyIndex.value > 0);
	const canRedo = computed(() => historyIndex.value < history.value.length - 1);

	const pushAction = (action: AudioHistoryAction) => {
		if (historyIndex.value < history.value.length - 1) {
			history.value = history.value.slice(0, historyIndex.value + 1);
		}

		history.value.push(action);
		historyIndex.value = history.value.length - 1;

		if (history.value.length > maxHistorySize) {
			history.value.shift();
			historyIndex.value--;
		}
	};

	const undo = () => {
		if (!canUndo.value) return null;

		historyIndex.value--;
		return history.value[historyIndex.value];
	};

	const redo = () => {
		if (!canRedo.value) return null;

		historyIndex.value++;
		return history.value[historyIndex.value];
	};

	const clear = () => {
		history.value = [];
		historyIndex.value = -1;
	};

	const createAction = (
		type: AudioHistoryAction["type"],
		data: any,
		previousData?: any,
	): AudioHistoryAction => ({
		type,
		timestamp: Date.now(),
		data,
		previousData,
	});

	const addTrackAction = (track: AudioTrack) => {
		pushAction(createAction("addTrack", { track }));
	};

	const _removeTrackAction = (track: AudioTrack, trackIndex: number) => {
		pushAction(createAction("removeTrack", { track, trackIndex }));
	};

	const addClipAction = (clip: AudioClip, trackId: string) => {
		pushAction(createAction("addClip", { clip, trackId }));
	};

	const removeClipAction = (clip: AudioClip, trackId: string, clipIndex: number) => {
		pushAction(createAction("removeClip", { clip, trackId, clipIndex }));
	};

	const updateClipAction = (
		clipId: string,
		trackId: string,
		updates: Partial<AudioClip>,
		previousData: Partial<AudioClip>,
	) => {
		pushAction(createAction("updateClip", { clipId, trackId, updates, previousData }));
	};

	const _moveClipAction = (
		clipId: string,
		fromTrackId: string,
		toTrackId: string,
		newOffset: number,
		previousOffset: number,
	) => {
		pushAction(
			createAction("moveClip", {
				clipId,
				fromTrackId,
				toTrackId,
				newOffset,
				previousOffset,
			}),
		);
	};

	const _trimClipAction = (
		clipId: string,
		trackId: string,
		newStartTime: number,
		newEndTime: number,
		previousStartTime: number,
		previousEndTime: number,
	) => {
		pushAction(
			createAction("trimClip", {
				clipId,
				trackId,
				newStartTime,
				newEndTime,
				previousStartTime,
				previousEndTime,
			}),
		);
	};

	const addMarkerAction = (marker: AudioMarker) => {
		pushAction(createAction("addMarker", { marker }));
	};

	const removeMarkerAction = (marker: AudioMarker, markerIndex: number) => {
		pushAction(createAction("removeMarker", { marker, markerIndex }));
	};

	const addRegionAction = (region: AudioRegion) => {
		pushAction(createAction("addRegion", { region }));
	};

	const removeRegionAction = (region: AudioRegion, regionIndex: number) => {
		pushAction(createAction("removeRegion", { region, regionIndex }));
	};

	const updateSettingsAction = (
		settings: Partial<{
			masterVolume: number;
			bpm: number;
			timeSignature: { numerator: number; denominator: number };
			snapToGrid: boolean;
			gridSize: number;
		}>,
		previousSettings: Partial<{
			masterVolume: number;
			bpm: number;
			timeSignature: { numerator: number; denominator: number };
			snapToGrid: boolean;
			gridSize: number;
		}>,
	) => {
		pushAction(createAction("updateSettings", { settings, previousSettings }));
	};

	return {
		history,
		historyIndex,
		canUndo,
		canRedo,
		pushAction,
		undo,
		redo,
		clear,
		createAction,
		addTrackAction,
		_removeTrackAction,
		addClipAction,
		removeClipAction,
		updateClipAction,
		_moveClipAction,
		_trimClipAction,
		addMarkerAction,
		removeMarkerAction,
		addRegionAction,
		removeRegionAction,
		updateSettingsAction,
	};
};
