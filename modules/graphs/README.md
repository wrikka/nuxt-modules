# @wpackages/graphs

A comprehensive Nuxt module for graph algorithms and visualization, providing both algorithmic utilities and Vue components for graph rendering.

## Features

- **Graph Algorithms**: Complete implementation of common graph algorithms including:
  - Pathfinding: A*, Dijkstra, Bellman-Ford, Floyd-Warshall
  - Traversal: BFS, DFS
  - Spanning Trees: Kruskal, Prim
  - Connectivity: Connected Components, Strongly Connected Components
  - Graph Analysis: Cycle Detection, Bipartite Check, Topological Sort
  - Utilities: Union-Find, Graph Operations

- **Vue Components**: Ready-to-use Vue components for graph visualization
- **TypeScript**: Full TypeScript support with type definitions
- **Nuxt Integration**: Seamless integration with Nuxt 3 applications

## Installation

```bash
# Using bun (recommended)
bun add @wpackages/graphs

# Or using npm
npm install @wpackages/graphs

# Or using yarn
yarn add @wpackages/graphs
```

## Setup

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@wpackages/graphs'
  ]
})
```

## Usage

### Using Graph Algorithms

All graph algorithms are automatically imported as composables:

```vue
<script setup>
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 }
}

// Use Dijkstra's algorithm
const { shortestPath, shortestDistance } = dijkstra(graph, 'A', 'D')
console.log(shortestPath) // ['A', 'C', 'D']
console.log(shortestDistance) // 5

// Use A* algorithm (requires heuristic function)
const heuristic = (node: string) => {
  const heuristics = { A: 7, B: 6, C: 2, D: 0 }
  return heuristics[node] || 0
}
const { path: aStarPath } = aStar(graph, 'A', 'D', heuristic)
</script>
```

### Available Algorithms

#### Pathfinding
- `dijkstra(graph, start, end)` - Shortest path in weighted graphs
- `aStar(graph, start, end, heuristic)` - A* search algorithm
- `bellmanFord(graph, start, end)` - Handles negative weights
- `floydWarshall(graph)` - All-pairs shortest paths

#### Traversal
- `breadthFirstSearch(graph, start)` - BFS traversal
- `depthFirstSearch(graph, start)` - DFS traversal

#### Minimum Spanning Trees
- `kruskal(edges)` - Kruskal's algorithm
- `prim(graph, start)` - Prim's algorithm

#### Graph Analysis
- `connectedComponents(graph)` - Find connected components
- `stronglyConnectedComponents(graph)` - Find SCCs
- `cycleDetection(graph)` - Detect cycles
- `bipartiteCheck(graph)` - Check if bipartite
- `topologicalSort(graph)` - Topological ordering

#### Utilities
- `unionFind(size)` - Union-Find data structure
- Graph utilities for creating, modifying, and analyzing graphs

### Graph Visualization

Use the `GraphVisualizer` component to render graphs:

```vue
<template>
  <GraphVisualizer
    :nodes="nodes"
    :edges="edges"
    :width="800"
    :height="600"
    layout="circular"
    @node-click="onNodeClick"
  />
</template>

<script setup>
const nodes = [
  { id: 'A', label: 'Node A' },
  { id: 'B', label: 'Node B' },
  { id: 'C', label: 'Node C' },
  { id: 'D', label: 'Node D' }
]

const edges = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 5 },
  { from: 'C', to: 'D', weight: 3 }
]

const onNodeClick = (node) => {
  console.log('Clicked node:', node)
}
</script>
```

### Graph Types

```ts
interface Graph {
  [node: string]: { [neighbor: string]: number }
}

interface WeightedGraph {
  nodes: string[]
  edges: Array<{ from: string; to: string; weight: number }>
}

interface Node {
  id: string | number
  label?: string
  x?: number
  y?: number
}

interface Edge {
  from: string | number
  to: string | number
  weight?: number
}
```

## Examples

### Finding Shortest Path

```vue
<script setup>
const graph = {
  'New York': { 'Boston': 4, 'Philadelphia': 2 },
  'Boston': { 'New York': 4, 'Washington': 5 },
  'Philadelphia': { 'New York': 2, 'Washington': 3 },
  'Washington': { 'Boston': 5, 'Philadelphia': 3 }
}

const { shortestPath, shortestDistance } = dijkstra(graph, 'New York', 'Washington')
</script>
```

### Minimum Spanning Tree

```vue
<script setup>
const edges = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 5 },
  { from: 'B', to: 'D', weight: 10 },
  { from: 'C', to: 'D', weight: 3 }
]

const mst = kruskal(edges)
</script>
```

## Development

### Building

```bash
bun run build
```

### Testing

```bash
bun run test
```

### Linting

```bash
bun run lint
```

## License

MIT
