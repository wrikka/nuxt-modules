import type { FlameData } from './flame-types';

/**
 * Filter flame graph by value threshold
 */
export function filterFlameByValue(
	flame: FlameData,
	minValue: number,
	maxValue?: number,
): FlameData {
	const filteredFrames = flame.frames.filter((frame) => {
		const withinMin = frame.value >= minValue;
		const withinMax = maxValue === undefined || frame.value <= maxValue;
		return withinMin && withinMax;
	});

	// Remove frames whose parents were filtered out
	const validIds = new Set(filteredFrames.map((f) => f.id));
	const finalFrames = filteredFrames.filter(
		(frame) => !frame.parent || validIds.has(frame.parent),
	);

	return {
		...flame,
		frames: finalFrames,
	};
}

/**
 * Zoom flame graph to specific frame
 */
export function zoomFlameToFrame(
	flame: FlameData,
	frameId: string,
	zoomFactor: number = 2,
): FlameData {
	const targetFrame = flame.frames.find((f) => f.id === frameId);
	if (!targetFrame) return flame;

	// Create zoomed view centered on target frame
	const zoomedFrames = flame.frames.map((frame) => ({
		...frame,
		x: flame.bounds.x + (frame.x - targetFrame.x) * zoomFactor,
		y: frame.y, // Keep Y position for flame graph
		width: frame.width * zoomFactor,
		height: frame.height,
	}));

	return {
		...flame,
		frames: zoomedFrames,
	};
}


