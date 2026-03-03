# Interactive Demos

Experience the graph algorithms in action with these interactive visualizations. Click "Run Algorithm" to see how each algorithm works step by step.

## Dijkstra's Algorithm

Find the shortest path between two nodes in a weighted graph.

<AlgorithmDemo
  title="Dijkstra's Shortest Path"
  algorithm="dijkstra"
  :nodes="dijkstraNodes"
  :edges="dijkstraEdges"
  explanation="Dijkstra's algorithm finds the shortest path from a start node to all other nodes in a weighted graph with non-negative edge weights."
/>

## A* Algorithm

Intelligent pathfinding using heuristics to guide the search.

<AlgorithmDemo
  title="A* Pathfinding"
  algorithm="astar"
  :nodes="astarNodes"
  :edges="astarEdges"
  explanation="A* combines Dijkstra's algorithm with a heuristic function to find the shortest path more efficiently than Dijkstra alone."
/>

## Breadth-First Search

Explore a graph level by level, finding the shortest path in unweighted graphs.

<AlgorithmDemo
  title="BFS Traversal"
  algorithm="bfs"
  :nodes="bfsNodes"
  :edges="bfsEdges"
  explanation="Breadth-First Search explores nodes level by level, guaranteeing the shortest path in unweighted graphs."
/>

## Depth-First Search

Explore as far as possible along each branch before backtracking.

<AlgorithmDemo
  title="DFS Traversal"
  algorithm="dfs"
  :nodes="dfsNodes"
  :edges="dfsEdges"
  explanation="Depth-First Search explores as deep as possible along each branch before backtracking, useful for topological sorting and cycle detection."
/>

<script setup>
import AlgorithmDemo from '../../../src/utils/components/AlgorithmDemo.vue'

// Dijkstra's demo data
const dijkstraNodes = [
  { id: 'A', label: 'Seattle' },
  { id: 'B', label: 'Portland' },
  { id: 'C', label: 'Boise' },
  { id: 'D', label: 'Salt Lake City' },
  { id: 'E', label: 'Denver' }
]

const dijkstraEdges = [
  { from: 'A', to: 'B', weight: 174 },
  { from: 'A', to: 'C', weight: 606 },
  { from: 'B', to: 'C', weight: 429 },
  { from: 'B', to: 'D', weight: 762 },
  { from: 'C', to: 'D', weight: 341 },
  { from: 'C', to: 'E', weight: 649 },
  { from: 'D', to: 'E', weight: 371 }
]

// A* demo data (grid-based)
const astarNodes = [
  { id: '0-0', label: 'Start' },
  { id: '0-1', label: '' },
  { id: '0-2', label: '' },
  { id: '1-0', label: '' },
  { id: '1-1', label: '' },
  { id: '1-2', label: '' },
  { id: '2-0', label: '' },
  { id: '2-1', label: '' },
  { id: '2-2', label: 'Goal' }
]

const astarEdges = [
  { from: '0-0', to: '0-1', weight: 1 },
  { from: '0-0', to: '1-0', weight: 1 },
  { from: '0-1', to: '0-0', weight: 1 },
  { from: '0-1', to: '0-2', weight: 1 },
  { from: '0-1', to: '1-1', weight: 1 },
  { from: '0-2', to: '0-1', weight: 1 },
  { from: '0-2', to: '1-2', weight: 1 },
  { from: '1-0', to: '0-0', weight: 1 },
  { from: '1-0', to: '1-1', weight: 1 },
  { from: '1-0', to: '2-0', weight: 1 },
  { from: '1-1', to: '0-1', weight: 1 },
  { from: '1-1', to: '1-0', weight: 1 },
  { from: '1-1', to: '1-2', weight: 1 },
  { from: '1-1', to: '2-1', weight: 1 },
  { from: '1-2', to: '0-2', weight: 1 },
  { from: '1-2', to: '1-1', weight: 1 },
  { from: '1-2', to: '2-2', weight: 1 },
  { from: '2-0', to: '1-0', weight: 1 },
  { from: '2-0', to: '2-1', weight: 1 },
  { from: '2-1', to: '1-1', weight: 1 },
  { from: '2-1', to: '2-0', weight: 1 },
  { from: '2-1', to: '2-2', weight: 1 },
  { from: '2-2', to: '1-2', weight: 1 },
  { from: '2-2', to: '2-1', weight: 1 }
]

// BFS demo data
const bfsNodes = [
  { id: 'A', label: 'Alice' },
  { id: 'B', label: 'Bob' },
  { id: 'C', label: 'Charlie' },
  { id: 'D', label: 'Diana' },
  { id: 'E', label: 'Eve' },
  { id: 'F', label: 'Frank' }
]

const bfsEdges = [
  { from: 'A', to: 'B', weight: 1 },
  { from: 'A', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 1 },
  { from: 'B', to: 'E', weight: 1 },
  { from: 'C', to: 'F', weight: 1 },
  { from: 'D', to: 'E', weight: 1 }
]

// DFS demo data
const dfsNodes = [
  { id: 'A', label: 'Root' },
  { id: 'B', label: 'Left' },
  { id: 'C', label: 'Right' },
  { id: 'D', label: 'Left-Left' },
  { id: 'E', label: 'Left-Right' },
  { id: 'F', label: 'Right-Left' }
]

const dfsEdges = [
  { from: 'A', to: 'B', weight: 1 },
  { from: 'A', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 1 },
  { from: 'B', to: 'E', weight: 1 },
  { from: 'C', to: 'F', weight: 1 }
]
</script>

<style scoped>
/* Additional styles for the demo page */
.demo-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
}

.demo-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}
</style>
