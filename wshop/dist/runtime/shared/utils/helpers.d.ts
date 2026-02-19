/**
 * Debounce function
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Clamp number between min and max
 */
export declare function clamp(number: number, min: number, max: number): number;
//# sourceMappingURL=helpers.d.ts.map