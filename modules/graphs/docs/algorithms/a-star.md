# A* Algorithm

A* (A-star) is an informed search algorithm that finds the shortest path between nodes using both the actual cost and an estimated cost to the goal.

## Overview

A* combines the advantages of Dijkstra's algorithm (guaranteed shortest path) with heuristic search (potentially faster). It uses a heuristic function to estimate the cost from current node to goal.

## Usage

```typescript
import { aStar } from '@wpackages/graphs'

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 }
}

// Manhattan distance heuristic for grid-based graphs
const heuristic = (node: string) => {
  const positions = {
    A: [0, 0], B: [1, 0], C: [0, 1], D: [1, 1]
  }
  const [x1, y1] = positions[node as keyof typeof positions] || [0, 0]
  const [x2, y2] = positions.D // goal position
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

const result = aStar(graph, 'A', 'D', heuristic)
// result.path: ['A', 'C', 'D']
// result.cost: 5
```

## Parameters

- `graph`: Weighted graph object
- `start`: Starting node ID
- `goal`: Target node ID
- `heuristic`: Function that estimates cost from node to goal

## Return Value

```typescript
{
  path: string[],     // Array of node IDs representing the path
  cost: number,       // Total cost of the path
  visited: string[]   // Nodes visited during search
}
```

## Heuristic Functions

### Manhattan Distance (Grid)
```typescript
const manhattanHeuristic = (node: string, goal: string) => {
  const positions = { A: [0,0], B: [1,0], C: [0,1], D: [1,1] }
  const [x1, y1] = positions[node as keyof typeof positions]
  const [x2, y2] = positions[goal as keyof typeof positions]
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}
```

### Euclidean Distance
```typescript
const euclideanHeuristic = (node: string, goal: string) => {
  const positions = { A: [0,0], B: [1,0], C: [0,1], D: [1,1] }
  const [x1, y1] = positions[node as keyof typeof positions]
  const [x2, y2] = positions[goal as keyof typeof positions]
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}
```

## Time Complexity

- **Time**: O(b^d) worst case, but often much better with good heuristics
- **Space**: O(b^d) for the priority queue

## Admissibility

For A* to guarantee optimal paths, the heuristic must be **admissible** (never overestimate the true cost) and **consistent** (satisfy triangle inequality).

## Applications

- Pathfinding in video games
- Robot navigation
- Route planning in maps
- Puzzle solving (8-puzzle, 15-puzzle)
