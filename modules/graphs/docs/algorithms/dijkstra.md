# Dijkstra's Algorithm

Dijkstra's algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights.

## Overview

Dijkstra's algorithm uses a priority queue to always expand the node with the smallest distance from the source. It guarantees the shortest path in graphs with non-negative weights.

## Usage

```typescript
import { dijkstra } from '@wpackages/graphs'

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 }
}

const result = dijkstra(graph, 'A', 'D')
// result.shortestPath: ['A', 'C', 'D']
// result.shortestDistance: 5
```

## Parameters

- `graph`: Weighted graph object where keys are node IDs and values are objects mapping neighbors to weights
- `start`: Starting node ID
- `end`: Target node ID

## Return Value

```typescript
{
  shortestPath: string[],     // Array of node IDs representing the path
  shortestDistance: number,   // Total distance of the path
  distances: Record<string, number>, // Distance from start to each node
  previous: Record<string, string | null> // Previous node in optimal path
}
```

## Time Complexity

- **Time**: O((V + E) log V) with binary heap
- **Space**: O(V)

## Example

```vue
<script setup>
import { dijkstra } from '@wpackages/graphs'

const graph = {
  'New York': { 'Boston': 4, 'Philadelphia': 2 },
  'Boston': { 'New York': 4, 'Washington': 3 },
  'Philadelphia': { 'New York': 2, 'Washington': 2 },
  'Washington': { 'Boston': 3, 'Philadelphia': 2 }
}

const result = dijkstra(graph, 'New York', 'Washington')
</script>

<template>
  <div>
    <h3>Shortest Path: {{ result.shortestPath.join(' → ') }}</h3>
    <p>Distance: {{ result.shortestDistance }} hours</p>
  </div>
</template>
```

## Applications

- GPS navigation systems
- Network routing protocols
- Finding minimum cost paths in transportation networks
- Resource allocation problems
