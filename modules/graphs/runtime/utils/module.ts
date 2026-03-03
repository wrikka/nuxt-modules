import { defineNuxtModule, addImports, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@wpackages/graphs',
    configKey: 'graphs'
  },
  setup(options, nuxt) {
    // Add auto-imports for graph algorithms
    const algorithms = [
      'aStar',
      'bellmanFord',
      'breadthFirstSearch',
      'bipartiteCheck',
      'connectedComponents',
      'cycleDetection',
      'depthFirstSearch',
      'dijkstra',
      'floydWarshall',
      'kruskal',
      'prim',
      'stronglyConnectedComponents',
      'topologicalSort',
      'unionFind'
    ]

    algorithms.forEach(algorithm => {
      addImports({
        name: algorithm,
        from: '@wpackages/graphs'
      })
    })

    // Add graph types
    addImports({
      name: 'Graph',
      from: '@wpackages/graphs',
      type: true
    })

    addImports({
      name: 'WeightedGraph',
      from: '@wpackages/graphs',
      type: true
    })

    // Add Vue components directory if it exists
    addComponentsDir({
      path: '~/components/graphs',
      global: false
    })
  }
})
