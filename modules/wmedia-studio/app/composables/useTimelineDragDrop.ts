import type { VideoClip } from "#shared/types";

export interface DragState {
	isDragging: boolean;
	draggedClipId: string | null;
	draggedClip: VideoClip | null;
	startTrackId: string | null;
	startTime: number;
	currentTrackId: string | null;
	currentTime: number;
	offsetX: number;
	offsetY: number;
}

export const useTimelineDragDrop = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject } = storeToRefs(videoStore);

	const dragState = ref<DragState>({
		isDragging: false,
		draggedClipId: null,
		draggedClip: null,
		startTrackId: null,
		startTime: 0,
		currentTrackId: null,
		currentTime: 0,
		offsetX: 0,
		offsetY: 0,
	});

	const startDrag = (clipId: string, trackId: string, event: MouseEvent) => {
		const clip = videoStore.getClipById(clipId);
		if (!clip) return;

		dragState.value = {
			isDragging: true,
			draggedClipId: clipId,
			draggedClip: clip,
			startTrackId: trackId,
			startTime: clip.startTime,
			currentTrackId: trackId,
			currentTime: clip.startTime,
			offsetX: event.offsetX,
			offsetY: event.offsetY,
		};

		videoStore.selectClip(clipId);
	};

	const onDrag = (event: MouseEvent, pixelsPerSecond: number, trackHeight: number) => {
		if (!dragState.value.isDragging || !dragState.value.draggedClip) return;

		const deltaX = event.clientX - dragState.value.offsetX;
		const deltaY = event.clientY - dragState.value.offsetY;

		const deltaTime = deltaX / pixelsPerSecond;
		const deltaTrack = Math.floor(deltaY / trackHeight);

		const newTime = Math.max(0, dragState.value.startTime + deltaTime);

		const tracks = currentVideoProject.value?.tracks || [];
		const currentTrackIndex = tracks.findIndex((t) => t.id === dragState.value.startTrackId);
		const newTrackIndex = Math.max(0, Math.min(tracks.length - 1, currentTrackIndex + deltaTrack));
		const newTrackId = tracks[newTrackIndex]?.id || dragState.value.startTrackId;

		dragState.value.currentTime = newTime;
		dragState.value.currentTrackId = newTrackId;
	};

	const endDrag = () => {
		if (!dragState.value.isDragging || !dragState.value.draggedClipId || !dragState.value.currentTrackId) {
			dragState.value.isDragging = false;
			return;
		}

		try {
			videoStore.moveClip(
				dragState.value.draggedClipId,
				dragState.value.currentTrackId,
				dragState.value.currentTime,
			);
		} catch (error) {
			console.error("Failed to move clip:", error);
		}

		dragState.value.isDragging = false;
		dragState.value.draggedClipId = null;
		dragState.value.draggedClip = null;
		dragState.value.startTrackId = null;
		dragState.value.currentTrackId = null;
	};

	const cancelDrag = () => {
		dragState.value.isDragging = false;
		dragState.value.draggedClipId = null;
		dragState.value.draggedClip = null;
		dragState.value.startTrackId = null;
		dragState.value.currentTrackId = null;
	};

	return {
		dragState,
		startDrag,
		onDrag,
		endDrag,
		cancelDrag,
	};
};
