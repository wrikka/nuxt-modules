import { ref, computed, watch } from 'vue'
import { useGraphAlgorithms } from '../composables/useGraphAlgorithms'

interface Node {
  id: string | number
  label?: string
  color?: string
  data?: any
}

interface Edge {
  from: string | number
  to: string | number
  weight?: number
  highlighted?: boolean
}

interface Props {
  title: string
  algorithm: 'dijkstra' | 'astar' | 'bfs' | 'dfs'
  nodes: Node[]
  edges: Edge[]
  explanation?: string
}

export function useAlgorithmDemo(props: Props) {
  const startNode = ref(props.nodes[0]?.id || '')
  const endNode = ref(props.nodes[props.nodes.length - 1]?.id || '')
  const selectedNode = ref<Node | null>(null)

  const { isRunning, results, runAlgorithm, reset } = useGraphAlgorithms()

  const showEndNode = computed(() => ['dijkstra', 'astar'].includes(props.algorithm))

  const resetVisualization = () => {
    props.edges.forEach(edge => {
      edge.highlighted = false
    })
    props.nodes.forEach(node => {
      node.color = undefined
    })
    reset()
  }

  const animatePath = async (path: (string | number)[]) => {
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = path[i]
      const toNode = path[i + 1]

      // Highlight the edge
      const edge = props.edges.find(e =>
        e.from.toString() === fromNode.toString() && e.to.toString() === toNode.toString()
      )
      if (edge) {
        edge.highlighted = true
      }

      // Highlight the node
      const node = props.nodes.find(n => n.id.toString() === toNode.toString())
      if (node) {
        node.color = '#28a745' // Green for visited
      }

      await new Promise(resolve => setTimeout(resolve, 800)) // Animation delay
    }
  }

  const runDemoAlgorithm = async () => {
    const graph = buildGraph()
    const result = await runAlgorithm(props.algorithm, graph, startNode.value, endNode.value)

    // Animate the path if available
    if (result?.path) {
      await animatePath(result.path)
    }

    return result
  }

  const buildGraph = () => {
    const graph: Record<string, Record<string, number>> = {}

    props.nodes.forEach(node => {
      graph[node.id.toString()] = {}
    })

    props.edges.forEach(edge => {
      graph[edge.from.toString()][edge.to.toString()] = edge.weight || 1
    })

    return graph
  }

  const selectNode = (node: Node) => {
    selectedNode.value = node
  }

  const onNodeClick = (node: Node) => {
    selectNode(node)
  }

  // Initialize
  watch(() => props.nodes, (newNodes: Node[]) => {
    if (newNodes.length > 0 && !startNode.value) {
      startNode.value = newNodes[0].id
    }
    if (newNodes.length > 1 && !endNode.value) {
      endNode.value = newNodes[newNodes.length - 1].id
    }
  }, { immediate: true })

  return {
    startNode: computed(() => startNode.value),
    endNode: computed(() => endNode.value),
    selectedNode: computed(() => selectedNode.value),
    showEndNode,
    isRunning,
    results,
    resetVisualization,
    runDemoAlgorithm,
    selectNode,
    onNodeClick
  }
}
