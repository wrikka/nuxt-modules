# Getting Started

Welcome to `@wpackages/graphs`! This comprehensive Nuxt module provides graph algorithms and Vue components for graph visualization.

## What is @wpackages/graphs?

This module includes:

- **Pathfinding Algorithms**: A*, Dijkstra, Bellman-Ford, Floyd-Warshall
- **Graph Traversal**: BFS, DFS
- **Minimum Spanning Trees**: Kruskal, Prim
- **Graph Analysis**: Connected components, cycle detection, topological sort
- **Vue Components**: GraphVisualizer for rendering graphs
- **TypeScript Support**: Full type safety and IntelliSense

## Quick Example

```vue
<script setup>
import { dijkstra } from '@wpackages/graphs'

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 }
}

const { shortestPath, shortestDistance } = dijkstra(graph, 'A', 'D')
console.log(shortestPath) // ['A', 'C', 'D']
console.log(shortestDistance) // 5
</script>
```

## Next Steps

- [Installation Guide](./installation.md)
- [Configuration](./configuration.md)
- [Algorithm Reference](../algorithms/)
