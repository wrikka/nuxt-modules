# Configuration

## Module Options

The graphs module doesn't require any configuration by default, but you can customize its behavior:

```ts
export default defineNuxtConfig({
  modules: [
    '@wpackages/graphs'
  ],
  graphs: {
    // Module options (if any are added in the future)
  }
})
```

## Auto-imports

All graph algorithms are automatically imported as composables:

```vue
<script setup>
<!-- No need to import - these are auto-imported -->
const result = dijkstra(graph, start, end)
const path = aStar(graph, start, end, heuristic)
</script>
```

## TypeScript Support

The module provides full TypeScript support:

```ts
import type { Graph, WeightedGraph } from '@wpackages/graphs'

const graph: Graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A'],
  D: ['B']
}

const weightedGraph: WeightedGraph = {
  A: { B: 4, C: 2 },
  B: { A: 4, D: 1 },
  C: { A: 2 },
  D: { B: 1 }
}
```

## Vue Components

Graph visualization components are available:

```vue
<template>
  <GraphVisualizer
    :nodes="nodes"
    :edges="edges"
    layout="circular"
    @node-click="handleNodeClick"
  />
</template>

<script setup>
const nodes = [
  { id: 'A', label: 'Node A' },
  { id: 'B', label: 'Node B' }
]

const edges = [
  { from: 'A', to: 'B', weight: 5 }
]

const handleNodeClick = (node) => {
  console.log('Clicked:', node)
}
</script>
```

## Performance Considerations

- For large graphs, consider using more efficient algorithms
- Vue components use SVG for rendering - suitable for most use cases
- Algorithms are optimized for performance but test with your data size
