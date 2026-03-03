import { dijkstra, aStar, bfs, dfs } from '../utils'

export function useGraphAlgorithms() {
  let isRunning = false
  let results: any = null

  const runDijkstra = (graph: Record<string, Record<string, number>>, start: string, end: string) => {
    return dijkstra(buildGraphFromObject(graph), start)
  }

  const runAStar = (graph: Record<string, Record<string, number>>, start: string, end: string, heuristic: (node: string) => number) => {
    return aStar(buildGraphFromObject(graph), start, end, heuristic)
  }

  const runBFS = (graph: Record<string, Record<string, number>>, start: string) => {
    return bfs(buildGraphFromObject(graph), start)
  }

  const runDFS = (graph: Record<string, Record<string, number>>, start: string) => {
    return dfs(buildGraphFromObject(graph), start)
  }

  const buildGraphFromObject = (graphObj: Record<string, Record<string, number>>) => {
    const graph = new Map<string, Map<string, number>>()
    for (const [node, neighbors] of Object.entries(graphObj)) {
      const neighborMap = new Map<string, number>()
      for (const [neighbor, weight] of Object.entries(neighbors)) {
        neighborMap.set(neighbor, weight)
      }
      graph.set(node, neighborMap)
    }
    return graph
  }

  const runAlgorithm = async (
    algorithm: 'dijkstra' | 'astar' | 'bfs' | 'dfs',
    graph: Record<string, Record<string, number>>,
    startNode: string,
    endNode?: string
  ) => {
    if (isRunning) return

    isRunning = true
    results = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      switch (algorithm) {
        case 'dijkstra':
          if (!endNode) throw new Error('End node required for Dijkstra')
          results = dijkstra(buildGraphFromObject(graph), startNode)
          break
        case 'astar':
          if (!endNode) throw new Error('End node required for A*')
          const heuristic = (node: string) => {
            if (!endNode) return 0
            // Simple Manhattan distance
            const nodePos = getNodePosition(node)
            const endPos = getNodePosition(endNode)
            return Math.abs(nodePos.x - endPos.x) + Math.abs(nodePos.y - endPos.y)
          }
          results = aStar(buildGraphFromObject(graph), startNode, endNode, heuristic)
          break
        case 'bfs':
          results = bfs(buildGraphFromObject(graph), startNode)
          break
        case 'dfs':
          results = dfs(buildGraphFromObject(graph), startNode)
          break
      }
    } catch (error) {
      console.error('Algorithm error:', error)
      results = { error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      isRunning = false
    }

    return results
  }

  const getNodePosition = (nodeId: string) => {
    // Simple position calculation for heuristic
    const index = parseInt(nodeId.replace(/\D/g, '')) || 0
    const angle = (index / 10) * 2 * Math.PI
    return {
      x: 250 + 150 * Math.cos(angle),
      y: 200 + 150 * Math.sin(angle)
    }
  }

  return {
    get isRunning() { return isRunning },
    get results() { return results },
    runAlgorithm,
    reset: () => {
      results = null
      isRunning = false
    }
  }
}
