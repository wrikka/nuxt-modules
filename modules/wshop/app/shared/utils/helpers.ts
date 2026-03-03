/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout
	return (...args: Parameters<T>) => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), wait)
	}
}

/**
 * Clamp number between min and max
 */
export function clamp(number: number, min: number, max: number): number {
	return Math.min(Math.max(number, min), max)
}
