export interface Marker {
	id: string;
	time: number;
	label: string;
	color: string;
	description?: string;
}

interface MarkerKeyframe {
	id: string;
	clipId: string;
	time: number;
	property: string;
	value: number | string | boolean;
	easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export const useMarkers = () => {
	const markers = ref<Marker[]>([]);
	const keyframes = ref<Map<string, MarkerKeyframe[]>>(new Map());
	const selectedMarkerId = ref<string | null>(null);
	const selectedKeyframeId = ref<string | null>(null);

	const addMarker = (time: number, label: string, color: string = "#ff0000") => {
		const marker: Marker = {
			id: `marker-${Date.now()}`,
			time,
			label,
			color,
		};

		markers.value.push(marker);
		markers.value.sort((a, b) => a.time - b.time);

		return marker;
	};

	const updateMarker = (markerId: string, updates: Partial<Marker>) => {
		const index = markers.value.findIndex((m) => m.id === markerId);
		if (index !== -1) {
			Object.assign(markers.value[index]!, updates);
			markers.value.sort((a, b) => a.time - b.time);
		}
	};

	const deleteMarker = (markerId: string) => {
		markers.value = markers.value.filter((m) => m.id !== markerId);
		if (selectedMarkerId.value === markerId) {
			selectedMarkerId.value = null;
		}
	};

	const selectMarker = (markerId: string | null) => {
		selectedMarkerId.value = markerId;
	};

	const getMarkerAtTime = (time: number, tolerance: number = 0.5): Marker | null => {
		return markers.value.find((m) => Math.abs(m.time - time) <= tolerance) || null;
	};

	const getMarkersInRange = (startTime: number, endTime: number): Marker[] => {
		return markers.value.filter((m) => m.time >= startTime && m.time <= endTime);
	};

	const clearMarkers = () => {
		markers.value = [];
		selectedMarkerId.value = null;
	};

	const addKeyframe = (
		clipId: string,
		time: number,
		property: string,
		value: number | string | boolean,
		easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out",
	) => {
		const keyframe: MarkerKeyframe = {
			id: `keyframe-${Date.now()}`,
			clipId,
			time,
			property,
			value,
			easing,
		};

		if (!keyframes.value.has(clipId)) {
			keyframes.value.set(clipId, []);
		}

		const clipKeyframes = keyframes.value.get(clipId)!;
		clipKeyframes.push(keyframe);
		clipKeyframes.sort((a, b) => a.time - b.time);

		return keyframe;
	};

	const updateKeyframe = (keyframeId: string, updates: Partial<MarkerKeyframe>) => {
		for (const [_clipId, kfList] of keyframes.value) {
			const index = kfList.findIndex((kf) => kf.id === keyframeId);
			if (index !== -1) {
				Object.assign(kfList[index]!, updates);
				kfList.sort((a, b) => a.time - b.time);
				break;
			}
		}
	};

	const deleteKeyframe = (keyframeId: string) => {
		for (const [clipId, kfList] of keyframes.value) {
			const index = kfList.findIndex((kf) => kf.id === keyframeId);
			if (index !== -1) {
				kfList.splice(index, 1);
				if (kfList.length === 0) {
					keyframes.value.delete(clipId);
				}
				break;
			}
		}

		if (selectedKeyframeId.value === keyframeId) {
			selectedKeyframeId.value = null;
		}
	};

	const getKeyframesForClip = (clipId: string): MarkerKeyframe[] => {
		return keyframes.value.get(clipId) || [];
	};

	const getKeyframesAtTime = (clipId: string, time: number, tolerance: number = 0.1): MarkerKeyframe[] => {
		const clipKeyframes = keyframes.value.get(clipId) || [];
		return clipKeyframes.filter((kf) => Math.abs(kf.time - time) <= tolerance);
	};

	const interpolateValue = (clipId: string, property: string, time: number): number | string | boolean | null => {
		const clipKeyframes = keyframes.value.get(clipId) || [];
		const propertyKeyframes = clipKeyframes.filter((kf) => kf.property === property);

		if (propertyKeyframes.length === 0) return null;

		if (propertyKeyframes.length === 1) {
			return propertyKeyframes[0]?.value ?? null;
		}

		let before: MarkerKeyframe | undefined = propertyKeyframes[0];
		let after: MarkerKeyframe | undefined = propertyKeyframes[propertyKeyframes.length - 1];

		for (let i = 0; i < propertyKeyframes.length; i++) {
			const kf = propertyKeyframes[i];
			if (!kf) continue;
			if (kf.time <= time) {
				before = kf;
			}
			if (kf.time >= time) {
				after = kf;
				break;
			}
		}

		if (!before || !after) {
			return before?.value ?? after?.value ?? 0;
		}

		if (before.time === after.time) {
			return before.value;
		}

		const progress = (time - before.time) / (after?.time ?? before.time);

		if (typeof before.value === "number" && typeof after?.value === "number") {
			return before.value + (after.value - before.value) * progress;
		}

		return progress < 0.5 ? before.value : (after?.value ?? before.value);
	};

	const clearKeyframes = (clipId?: string) => {
		if (clipId) {
			keyframes.value.delete(clipId);
		} else {
			keyframes.value.clear();
		}
		selectedKeyframeId.value = null;
	};

	return {
		markers,
		keyframes,
		selectedMarkerId,
		selectedKeyframeId,
		addMarker,
		updateMarker,
		deleteMarker,
		selectMarker,
		getMarkerAtTime,
		getMarkersInRange,
		clearMarkers,
		addKeyframe,
		updateKeyframe,
		deleteKeyframe,
		getKeyframesForClip,
		getKeyframesAtTime,
		interpolateValue,
		clearKeyframes,
	};
};
