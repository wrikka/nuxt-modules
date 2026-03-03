import type { Keyframe, VideoClip, VideoTransition } from "#shared/types";

/**
 * Get animated value at a specific time from keyframes using linear interpolation
 */
export const getAnimatedValue = (keyframes: Keyframe[], time: number): number => {
	if (keyframes.length === 0) return 0;
	if (keyframes.length === 1) return keyframes[0]!.value;

	const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

	if (time <= sortedKeyframes[0]!.time) return sortedKeyframes[0]!.value;

	const lastKeyframe = sortedKeyframes[sortedKeyframes.length - 1];
	if (lastKeyframe && time >= lastKeyframe.time) {
		return lastKeyframe.value;
	}

	let prevKeyframe = sortedKeyframes[0]!;
	let nextKeyframe = sortedKeyframes[sortedKeyframes.length - 1]!;

	for (let i = 1; i < sortedKeyframes.length; i++) {
		if (sortedKeyframes[i]!.time > time) {
			prevKeyframe = sortedKeyframes[i - 1]!;
			nextKeyframe = sortedKeyframes[i]!;
			break;
		}
	}

	if (!prevKeyframe || !nextKeyframe) {
		return 0;
	}

	const timeDiff = nextKeyframe.time - prevKeyframe.time;
	const valueDiff = nextKeyframe.value - prevKeyframe.value;
	const progress = (time - prevKeyframe.time) / timeDiff;

	// Linear interpolation
	return prevKeyframe.value + valueDiff * progress;
};

/**
 * Get all transform properties at a specific time for a clip
 */
export const getTransformPropertiesAtTime = (clip: VideoClip, time: number) => {
	if (!clip.transform) return {};
	const clipTime = time - clip.startTime;

	return {
		x: getAnimatedValue(clip.transform.x, clipTime),
		y: getAnimatedValue(clip.transform.y, clipTime),
		scale: getAnimatedValue(clip.transform.scale, clipTime),
		rotation: getAnimatedValue(clip.transform.rotation, clipTime),
		opacity: getAnimatedValue(clip.transform.opacity, clipTime),
	};
};

/**
 * Get transition info at a specific time for a clip
 */
export const getTransitionAtTime = (
	clip: VideoClip,
	time: number,
): { type: VideoTransition["type"]; progress: number; position: "in" | "out" } | null => {
	const clipTime = time - clip.startTime;
	const clipDuration = clip.endTime - clip.startTime;

	// Check transition in (at the beginning)
	if (clip.transitionIn && clipTime >= 0 && clipTime < clip.transitionIn.duration) {
		return {
			type: clip.transitionIn.type,
			progress: clipTime / clip.transitionIn.duration,
			position: "in",
		};
	}

	// Check transition out (at the end)
	if (clip.transitionOut && clipTime > clipDuration - clip.transitionOut.duration && clipTime <= clipDuration) {
		return {
			type: clip.transitionOut.type,
			progress: (clipDuration - clipTime) / clip.transitionOut.duration,
			position: "out",
		};
	}

	return null;
};

/**
 * Calculate opacity with transition effects applied
 */
export const calculateTransitionOpacity = (clip: VideoClip, time: number, baseOpacity: number): number => {
	const transition = getTransitionAtTime(clip, time);
	if (!transition) return baseOpacity;

	// For fade/dissolve, same logic applies
	if (transition.position === "in") {
		return baseOpacity * transition.progress;
	} else {
		return baseOpacity * (1 - transition.progress);
	}
};

/**
 * Check if a clip is active at a given time
 */
export const isClipActiveAtTime = (clip: VideoClip, time: number): boolean => {
	return time >= clip.startTime && time < clip.endTime;
};

/**
 * Get active clips at a specific time from a project
 */
export const getActiveClipsAtTime = <T extends { clips: VideoClip[] }>(project: T, time: number): VideoClip[] => {
	return project.clips.filter((clip) => isClipActiveAtTime(clip, time));
};
