# @wrikka/wgraphs

Nuxt Module สำหรับ graph algorithms และแสดงผลกราฟ visualization 40+ แบบ

## Features

- **Graph Algorithms**: Complete implementation of common graph algorithms
  - Pathfinding: A*, Dijkstra, Bellman-Ford, Floyd-Warshall
  - Traversal: BFS, DFS
  - Spanning Trees: Kruskal, Prim
  - Connectivity: Connected Components, Strongly Connected Components
  - Graph Analysis: Cycle Detection, Bipartite Check, Topological Sort

- **Chart Components**: 40+ chart types using D3
  - Statistical, Relationship, Geographic, Time-based, Specialized charts

## Installation

```bash
bun install @wrikka/wgraphs
```

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wgraphs']
})
```

## Graph Algorithms

```vue
<script setup>
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 }
}

// Dijkstra's algorithm
const { shortestPath, shortestDistance } = dijkstra(graph, 'A', 'D')
</script>
```

### Available Algorithms

- `dijkstra(graph, start, end)` - Shortest path
- `aStar(graph, start, end, heuristic)` - A* search
- `bellmanFord(graph, start, end)` - Handles negative weights
- `floydWarshall(graph)` - All-pairs shortest paths
- `breadthFirstSearch(graph, start)` - BFS
- `depthFirstSearch(graph, start)` - DFS
- `kruskal(edges)` - Kruskal's MST
- `prim(graph, start)` - Prim's MST
- `connectedComponents(graph)` - Find connected components
- `stronglyConnectedComponents(graph)` - Find SCCs
- `cycleDetection(graph)` - Detect cycles
- `bipartiteCheck(graph)` - Check bipartite
- `topologicalSort(graph)` - Topological ordering
- `unionFind(size)` - Union-Find data structure

## Chart Components (40+)

### Statistical Charts (10)
- `WGraphBar` - กราฟแท่ง
- `WGraphLine` - กราฟเส้น
- `WGraphPie` - กราฟวงกลม
- `WGraphDonut` - กราฟวงแหวน
- `WGraphArea` - กราฟพื้นที่
- `WGraphScatter` - กราฟกระจาย
- `WGraphBubble` - กราฟฟอง
- `WGraphHistogram` - ฮิสโทแกรม
- `WGraphBoxPlot` - กล่องข้อมูล
- `WGraphViolin` - กราฟไวโอลิน

### Relationship & Hierarchy (8)
- `WGraphTree` - โครงสร้างต้นไม้
- `WGraphTreemap` - แผนที่ต้นไม้
- `WGraphSunburst` - วงกลมซ้อน
- `WGraphNetwork` - กราฟเครือข่าย
- `WGraphSankey` - แผนภูมิแซงกี
- `WGraphChord` - กราฟคอร์ด
- `WGraphArc` - กราฟอาร์ค
- `WGraphDendrogram` - กราฟเดนโดรแกรม

### Geographic & Spatial (5)
- `WGraphChoropleth` - แผนที่สี
- `WGraphBubbleMap` - แผนที่ฟอง
- `WGraphFlowMap` - แผนที่เส้นทาง
- `WGraphHeatmapGrid` - ตารางความร้อน
- `WGraphHexbin` - แผนที่หกเหลี่ยม

### Time-Based (5)
- `WGraphTimeline` - เส้นเวลา
- `WGraphGantt` - แผนงาน
- `WGraphCandlestick` - กราฟหุ้น
- `WGraphSparkline` - เส้นสรุป
- `WGraphCalendarHeatmap` - ปฏิทินความร้อน

### Specialized (7)
- `WGraphRadar` - กราฟแมงมุม
- `WGraphParallel` - พิกัดขนาน
- `WGraphFunnel` - กราฟกรวย
- `WGraphGauge` - มาตรวัด
- `WGraphWordCloud` - เมฆคำ
- `WGraphPareto` - กราฟพาเรโต
- `WGraphWaterfall` - กราฟน้ำตก
- `WGraphStackedBar` - กราฟแท่งซ้อน

### Interactive Advanced (5)
- `WGraphForce` - กราฟแรง
- `WGraphSurface` - กราฟพื้นผิว 3D
- `WGraphTransition` - กราฟเคลื่อนไหว
- `WGraphStream` - กราฟสตรีม
- `WGraphDrilldown` - กราฟซูม

## Example

```vue
<template>
  <WGraphBar
    :data="[
      { label: 'A', value: 30 },
      { label: 'B', value: 50 },
      { label: 'C', value: 40 }
    ]"
    :width="600"
    :height="400"
  />
</template>
```

## License

MIT
