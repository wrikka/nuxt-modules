/**
 * Additional utility functions for Media Studio
 * Auto-imported by Nuxt in the app/utils/ directory
 *
 * Note: Common utilities like formatBytes, formatDuration, formatDate,
 * formatRelativeTime, and generateId are available from #shared/utils
 */

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle = false;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== "object") return obj;
	if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
	if (Array.isArray(obj)) return obj.map((item) => deepClone(item)) as unknown as T;
	if (typeof obj === "object") {
		const cloned = {} as Record<string, unknown>;
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
			}
		}
		return cloned as T;
	}
	return obj;
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === "string") return value.trim() === "";
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
	return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
	const lastDotIndex = filename.lastIndexOf(".");
	return lastDotIndex === -1 ? filename : filename.substring(0, lastDotIndex);
}
