/**
 * Adjacency utilities - Adjacency matrices for network analysis
 */

// Export types
export type { AdjacencyData } from './adjacency-types';

// Export data generation functions
export {
	generateAdjacencyData,
	generateAdjacencyFromNetwork,
} from './adjacency-data';

// Export statistics functions
export { calculateAdjacencyStatistics } from './adjacency-stats';

// Export reordering functions
export { generateReorderedAdjacencyMatrix } from './adjacency-reorder';


