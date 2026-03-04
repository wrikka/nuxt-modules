<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AlgorithmInfo } from '../utils/graph-types.ts'

// Algorithm data for the grid
const algorithms = ref<AlgorithmInfo[]>([
  {
    name: 'Dijkstra',
    description: 'Finds the shortest path between nodes in a weighted graph with non-negative edge weights.',
    category: 'pathfinding',
    timeComplexity: 'V + E log V',
    spaceComplexity: 'V',
    tags: ['shortest path', 'weighted', 'greedy']
  },
  {
    name: 'A*',
    description: 'Optimal pathfinding using heuristics for faster search in large graphs.',
    category: 'pathfinding',
    timeComplexity: 'E',
    spaceComplexity: 'V',
    tags: ['heuristic', 'optimal', 'pathfinding']
  },
  {
    name: 'Bellman-Ford',
    description: 'Finds shortest paths from a single source, handles negative weights.',
    category: 'pathfinding',
    timeComplexity: 'V × E',
    spaceComplexity: 'V',
    tags: ['negative weights', 'single source', 'dynamic programming']
  },
  {
    name: 'Floyd-Warshall',
    description: 'Finds shortest paths between all pairs of vertices.',
    category: 'pathfinding',
    timeComplexity: 'V³',
    spaceComplexity: 'V²',
    tags: ['all pairs', 'dynamic programming', 'dense graphs']
  },
  {
    name: 'BFS',
    description: 'Breadth-first search explores neighbors level by level.',
    category: 'traversal',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['unweighted', 'shortest path', 'level order']
  },
  {
    name: 'DFS',
    description: 'Depth-first search explores as far as possible along each branch.',
    category: 'traversal',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['backtracking', 'connected components', 'topological sort']
  },
  {
    name: 'Kruskal',
    description: 'Finds minimum spanning tree by sorting edges and using union-find.',
    category: 'mst',
    timeComplexity: 'E log E',
    spaceComplexity: 'V',
    tags: ['mst', 'greedy', 'union-find']
  },
  {
    name: 'Prim',
    description: 'Finds minimum spanning tree by growing from a starting vertex.',
    category: 'mst',
    timeComplexity: 'E log V',
    spaceComplexity: 'V',
    tags: ['mst', 'greedy', 'priority queue']
  },
  {
    name: 'Topological Sort',
    description: 'Orders vertices such that for every edge (u,v), u comes before v.',
    category: 'analysis',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['dag', 'ordering', 'dependency']
  },
  {
    name: 'Cycle Detection',
    description: 'Detects if a graph contains any cycles using DFS or Union-Find.',
    category: 'analysis',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['cycle', 'validation', 'dfs']
  },
  {
    name: 'Connected Components',
    description: 'Finds all connected components in an undirected graph.',
    category: 'analysis',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['components', 'undirected', 'bfs/dfs']
  },
  {
    name: 'Strongly Connected',
    description: 'Finds strongly connected components using Kosaraju or Tarjan.',
    category: 'analysis',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['scc', 'directed', 'kosaraju']
  },
  {
    name: 'Bipartite Check',
    description: 'Determines if a graph can be divided into two disjoint sets.',
    category: 'analysis',
    timeComplexity: 'V + E',
    spaceComplexity: 'V',
    tags: ['bipartite', '2-coloring', 'bfs']
  },
  {
    name: 'Union-Find',
    description: 'Data structure for tracking disjoint sets with path compression.',
    category: 'utility',
    timeComplexity: 'α(V)',
    spaceComplexity: 'V',
    tags: ['disjoint set', 'path compression', 'kruskal']
  }
])

// Graph demo data - Force Directed
const forceGraphNodes = ref([
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
  { id: 'G', label: 'G' },
  { id: 'H', label: 'H' },
])

const forceGraphEdges = ref([
  { source: 'A', target: 'B' },
  { source: 'A', target: 'C' },
  { source: 'B', target: 'D' },
  { source: 'C', target: 'D' },
  { source: 'D', target: 'E' },
  { source: 'E', target: 'F' },
  { source: 'C', target: 'G' },
  { source: 'G', target: 'H' },
  { source: 'F', target: 'H' },
])

// Network Graph Data
const networkNodes = ref([
  { id: '1', label: 'Server', group: 'infra', size: 35 },
  { id: '2', label: 'DB', group: 'infra', size: 30 },
  { id: '3', label: 'Cache', group: 'infra', size: 28 },
  { id: '4', label: 'API', group: 'service', size: 32 },
  { id: '5', label: 'Auth', group: 'service', size: 30 },
  { id: '6', label: 'Web', group: 'client', size: 28 },
  { id: '7', label: 'Mobile', group: 'client', size: 28 },
])

const networkEdges = ref([
  { source: '1', target: '2', label: 'SQL', style: 'solid' as const },
  { source: '1', target: '3', label: 'Redis', style: 'dashed' as const },
  { source: '4', target: '1', label: 'HTTP', style: 'solid' as const },
  { source: '5', target: '1', label: 'HTTP', style: 'solid' as const },
  { source: '6', target: '4', label: 'REST', style: 'solid' as const },
  { source: '6', target: '5', label: 'OAuth', style: 'dotted' as const },
  { source: '7', target: '4', label: 'REST', style: 'solid' as const },
  { source: '7', target: '5', label: 'OAuth', style: 'dotted' as const },
])

// Tree Graph Data
const treeData = ref({
  id: 'root',
  label: 'Root',
  expanded: true,
  children: [
    {
      id: 'child1',
      label: 'Child 1',
      expanded: true,
      children: [
        { id: 'leaf1', label: 'Leaf 1' },
        { id: 'leaf2', label: 'Leaf 2' },
      ]
    },
    {
      id: 'child2',
      label: 'Child 2',
      expanded: true,
      children: [
        { id: 'leaf3', label: 'Leaf 3' },
        {
          id: 'child3',
          label: 'Child 3',
          expanded: true,
          children: [
            { id: 'leaf4', label: 'Leaf 4' },
            { id: 'leaf5', label: 'Leaf 5' },
          ]
        },
      ]
    },
    {
      id: 'child4',
      label: 'Child 4',
      expanded: true,
      children: [
        { id: 'leaf6', label: 'Leaf 6' },
      ]
    },
  ]
})

// Radial Graph Data
const radialNodes = ref([
  { id: 'center', label: 'Core', level: 0, size: 40 },
  { id: 'n1', label: 'A', level: 1 },
  { id: 'n2', label: 'B', level: 1 },
  { id: 'n3', label: 'C', level: 1 },
  { id: 'n4', label: 'D', level: 1 },
  { id: 'n5', label: 'E', level: 2 },
  { id: 'n6', label: 'F', level: 2 },
  { id: 'n7', label: 'G', level: 2 },
  { id: 'n8', label: 'H', level: 2 },
  { id: 'n9', label: 'I', level: 2 },
  { id: 'n10', label: 'J', level: 2 },
  { id: 'n11', label: 'K', level: 3 },
  { id: 'n12', label: 'L', level: 3 },
])

const radialEdges = ref([
  { source: 'center', target: 'n1' },
  { source: 'center', target: 'n2' },
  { source: 'center', target: 'n3' },
  { source: 'center', target: 'n4' },
  { source: 'n1', target: 'n5' },
  { source: 'n1', target: 'n6' },
  { source: 'n2', target: 'n7' },
  { source: 'n2', target: 'n8' },
  { source: 'n3', target: 'n9' },
  { source: 'n4', target: 'n10' },
  { source: 'n5', target: 'n11' },
  { source: 'n6', target: 'n12' },
])

// Filter state
const categories = ref([
  { id: 'pathfinding', label: 'Pathfinding', checked: false },
  { id: 'traversal', label: 'Traversal', checked: false },
  { id: 'mst', label: 'MST', checked: false },
  { id: 'analysis', label: 'Analysis', checked: false },
  { id: 'utility', label: 'Utility', checked: false }
])

const algorithmFilters = ref([
  { id: 'shortest path', label: 'Shortest Path', checked: false },
  { id: 'mst', label: 'MST', checked: false },
  { id: 'traversal', label: 'Traversal', checked: false }
])

// Filtered algorithms
const filteredAlgorithms = computed(() => {
  const selectedCategories = categories.value.filter(c => c.checked).map(c => c.id)
  const selectedTags = algorithmFilters.value.filter(a => a.checked).map(a => a.id)

  if (selectedCategories.length === 0 && selectedTags.length === 0) {
    return algorithms.value
  }

  return algorithms.value.filter(alg => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(alg.category)
    const tagMatch = selectedTags.length === 0 || alg.tags.some(tag => selectedTags.includes(tag))
    return categoryMatch || tagMatch
  })
})

const handleFilterUpdate = (filters: { categories: string[]; algorithms: string[] }) => {
  // Filters are reactive, no additional action needed
}

const resetFilters = () => {
  // Reset already handled by SidebarFilter component
}

const runAlgorithm = (name: string) => {
  // Navigate to algorithm demo or show modal
  console.log('Running algorithm:', name)
}

// Graph event handlers
const onForceNodeClick = (node: { id: string, label: string }) => {
  console.log('Force graph node clicked:', node)
}

const onNetworkNodeClick = (node: { id: string, label: string, group?: string }) => {
  console.log('Network node clicked:', node)
}

const onTreeNodeClick = (node: { id: string, label: string }) => {
  console.log('Tree node clicked:', node)
}

const onRadialNodeClick = (node: { id: string, label: string, level: number }) => {
  console.log('Radial node clicked:', node)
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <SidebarFilter
      :categories="categories"
      :algorithms="algorithmFilters"
      @update="handleFilterUpdate"
      @reset="resetFilters"
    />

    <main class="flex-1 overflow-auto">
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              @wrikka/graphs
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ filteredAlgorithms.length }} algorithms available | 4 graph visualization components
            </p>
          </div>

          <div class="flex items-center gap-4">
            <a
              href="https://github.com/wrikka/bun-packages"
              target="_blank"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span class="i-carbon-logo-github w-5 h-5" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <!-- Graph Components Grid - 2x2 -->
      <section class="p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Graph Visualization Components (Like D3/Cytoscape.js)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <WForceGraph
            title="Force-Directed Graph"
            :nodes="forceGraphNodes"
            :edges="forceGraphEdges"
            :height="300"
            :animated="true"
            @node-click="onForceNodeClick"
          />
          <WNetworkGraph
            title="Network Graph"
            :nodes="networkNodes"
            :edges="networkEdges"
            :height="300"
            layout="circular"
            show-edge-labels
            @node-click="onNetworkNodeClick"
          />
          <WTreeGraph
            title="Hierarchical Tree"
            :data="treeData"
            :height="300"
            @node-click="onTreeNodeClick"
          />
          <WRadialGraph
            title="Radial Graph"
            :nodes="radialNodes"
            :edges="radialEdges"
            :height="300"
            @node-click="onRadialNodeClick"
          />
        </div>

        <!-- Algorithm Grid -->
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Graph Algorithms
        </h2>
        <ChartGrid
          :algorithms="filteredAlgorithms"
          @run="runAlgorithm"
        />
      </section>
    </main>
  </div>
</template>
