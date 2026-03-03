/**
 * Flame utilities - Flame graphs for performance analysis
 */

// Re-export types
export type { FlameData } from './flame-types';

// Re-export generators
export {
	generateFlameData,
	generateFlameFromStackTraces,
	generateInvertedFlame,
} from './flame-generators';

// Re-export statistics
export { calculateFlameStatistics } from './flame-statistics';

// Re-export utilities
export { filterFlameByValue, zoomFlameToFrame } from './flame-utils';


