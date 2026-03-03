import type { VideoClip } from "#shared/types";

export interface SnapPoint {
	time: number;
	type: "clip-start" | "clip-end" | "playhead";
	clipId?: string;
}

export interface SnapResult {
	snapped: boolean;
	snappedTime: number;
	snapDistance: number;
	snapPoint?: SnapPoint;
}

export const useClipSnapping = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject, currentTime } = storeToRefs(videoStore);

	const snapThreshold = ref(10);
	const snapEnabled = ref(true);

	const getSnapPoints = (): SnapPoint[] => {
		if (!currentVideoProject.value) return [];

		const points: SnapPoint[] = [];

		for (const clip of currentVideoProject.value.clips) {
			points.push({
				time: clip.startTime,
				type: "clip-start",
				clipId: clip.id,
			});

			points.push({
				time: clip.endTime,
				type: "clip-end",
				clipId: clip.id,
			});
		}

		points.push({
			time: currentTime.value,
			type: "playhead",
		});

		return points.sort((a, b) => a.time - b.time);
	};

	const findSnapPoint = (time: number, excludeClipId?: string): SnapResult => {
		if (!snapEnabled.value) {
			return { snapped: false, snappedTime: time, snapDistance: 0 };
		}

		const snapPoints = getSnapPoints();

		let closestPoint: SnapPoint | null = null;
		let closestDistance = Infinity;

		for (const point of snapPoints) {
			if (excludeClipId && point.clipId === excludeClipId) continue;

			const distance = Math.abs(point.time - time);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestPoint = point;
			}
		}

		if (closestPoint && closestDistance <= snapThreshold.value) {
			return {
				snapped: true,
				snappedTime: closestPoint.time,
				snapDistance: closestDistance,
				snapPoint: closestPoint,
			};
		}

		return { snapped: false, snappedTime: time, snapDistance: 0 };
	};

	const snapToNearest = (time: number, excludeClipId?: string): number => {
		const result = findSnapPoint(time, excludeClipId);
		return result.snappedTime;
	};

	const snapClipToTimeline = (clip: VideoClip, newStartTime: number): number => {
		const startResult = findSnapPoint(newStartTime, clip.id);
		const endResult = findSnapPoint(newStartTime + clip.duration, clip.id);

		if (startResult.snapped && (!endResult.snapped || startResult.snapDistance <= endResult.snapDistance)) {
			return startResult.snappedTime;
		}

		if (endResult.snapped) {
			return endResult.snappedTime - clip.duration;
		}

		return newStartTime;
	};

	const enableSnapping = () => {
		snapEnabled.value = true;
	};

	const disableSnapping = () => {
		snapEnabled.value = false;
	};

	const setSnapThreshold = (threshold: number) => {
		snapThreshold.value = Math.max(0, threshold);
	};

	return {
		snapThreshold,
		snapEnabled,
		getSnapPoints,
		findSnapPoint,
		snapToNearest,
		snapClipToTimeline,
		enableSnapping,
		disableSnapping,
		setSnapThreshold,
	};
};
