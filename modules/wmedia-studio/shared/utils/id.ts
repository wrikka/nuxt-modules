/**
 * Generate a unique ID with a prefix
 */
export const generateId = (prefix: string): string =>
	`${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Generate a sequential ID with a prefix
 */
export const generateSequentialId = (prefix: string, index: number): string => `${prefix}-${Date.now()}-${index}`;

/**
 * Generate a keyframe ID for a specific property
 */
export const generateKeyframeId = (property: string, timestamp?: number): string =>
	`kf-${property}-${timestamp ?? Date.now()}`;

/**
 * Generate a clip ID
 */
export const generateClipId = (): string => generateId("clip");

/**
 * Generate a track ID
 */
export const generateTrackId = (): string => generateId("track");

/**
 * Generate an asset ID
 */
export const generateAssetId = (): string => generateId("asset");

/**
 * Generate a project ID
 */
export const generateProjectId = (): string => generateId("project");
