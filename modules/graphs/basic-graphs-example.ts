/**
 * Graphs Package Examples
 *
 * Basic usage examples for the Graphs package
 */

// Example 1: Basic Graph Data Structure
console.log('=== Graphs Package Examples ===')

interface GraphNode {
  id: string
  data: any
}

interface GraphEdge {
  from: string
  to: string
  weight?: number
  data?: any
}

class Graph {
  private nodes: Map<string, GraphNode> = new Map()
  private edges: Map<string, GraphEdge[]> = new Map()
  private adjacencyList: Map<string, string[]> = new Map()

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node)
    this.edges.set(node.id, [])
    this.adjacencyList.set(node.id, [])
  }

  addEdge(edge: GraphEdge): void {
    if (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) {
      throw new Error('Both nodes must exist before adding edge')
    }

    this.edges.get(edge.from)!.push(edge)
    this.adjacencyList.get(edge.from)!.push(edge.to)
  }

  getNode(id: string): GraphNode | null {
    return this.nodes.get(id) || null
  }

  getNeighbors(id: string): string[] {
    return this.adjacencyList.get(id) || []
  }

  getEdges(id: string): GraphEdge[] {
    return this.edges.get(id) || []
  }

  getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values())
  }

  getAllEdges(): GraphEdge[] {
    const allEdges: GraphEdge[] = []
    for (const edges of this.edges.values()) {
      allEdges.push(...edges)
    }
    return allEdges
  }

  // Depth-first search
  dfs(startId: string, visitFn: (node: GraphNode) => void): void {
    const visited = new Set<string>()
    const stack = [startId]

    while (stack.length > 0) {
      const currentId = stack.pop()!
      if (visited.has(currentId)) continue

      visited.add(currentId)
      const node = this.getNode(currentId)
      if (node) {
        visitFn(node)
        const neighbors = this.getNeighbors(currentId)
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor)
          }
        }
      }
    }
  }

  // Breadth-first search
  bfs(startId: string, visitFn: (node: GraphNode) => void): void {
    const visited = new Set<string>()
    const queue = [startId]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      if (visited.has(currentId)) continue

      visited.add(currentId)
      const node = this.getNode(currentId)
      if (node) {
        visitFn(node)
        const neighbors = this.getNeighbors(currentId)
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        }
      }
    }
  }
}

// Usage example
const graph = new Graph()

// Add nodes
graph.addNode({ id: 'A', data: { name: 'Node A', value: 1 } })
graph.addNode({ id: 'B', data: { name: 'Node B', value: 2 } })
graph.addNode({ id: 'C', data: { name: 'Node C', value: 3 } })
graph.addNode({ id: 'D', data: { name: 'Node D', value: 4 } })

// Add edges
graph.addEdge({ from: 'A', to: 'B', weight: 1 })
graph.addEdge({ from: 'A', to: 'C', weight: 2 })
graph.addEdge({ from: 'B', to: 'D', weight: 3 })
graph.addEdge({ from: 'C', to: 'D', weight: 4 })

console.log('Graph nodes:', graph.getAllNodes().map(n => n.id))
console.log('Graph edges:', graph.getAllEdges().length)

// Traverse graph
console.log('DFS traversal:')
graph.dfs('A', node => console.log(`Visited: ${node.id}`))

console.log('BFS traversal:')
graph.bfs('A', node => console.log(`Visited: ${node.id}`))

// Example 2: Weighted Graph with Shortest Path
class WeightedGraph extends Graph {
  // Dijkstra's algorithm for shortest path
  shortestPath(startId: string, endId: string): { path: string[], distance: number } | null {
    const distances: Map<string, number> = new Map()
    const previous: Map<string, string | null> = new Map()
    const unvisited = new Set(this.getAllNodes().map(n => n.id))

    // Initialize distances
    for (const node of this.getAllNodes()) {
      distances.set(node.id, node.id === startId ? 0 : Infinity)
      previous.set(node.id, null)
    }

    while (unvisited.size > 0) {
      // Find node with smallest distance
      let current: string | null = null
      let minDistance = Infinity

      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId)!
        if (distance < minDistance) {
          minDistance = distance
          current = nodeId
        }
      }

      if (current === null || minDistance === Infinity) break

      unvisited.delete(current)

      // Update neighbors
      for (const edge of this.getEdges(current)) {
        if (!unvisited.has(edge.to)) continue

        const alt = distances.get(current)! + (edge.weight || 1)
        if (alt < distances.get(edge.to)!) {
          distances.set(edge.to, alt)
          previous.set(edge.to, current)
        }
      }
    }

    // Build path
    const path: string[] = []
    let current: string | null = endId

    while (current !== null) {
      path.unshift(current)
      current = previous.get(current) || null
    }

    const distance = distances.get(endId)!
    return distance === Infinity ? null : { path, distance }
  }
}

// Weighted graph usage
const weightedGraph = new WeightedGraph()

weightedGraph.addNode({ id: 'A', data: { name: 'Start' } })
weightedGraph.addNode({ id: 'B', data: { name: 'Middle 1' } })
weightedGraph.addNode({ id: 'C', data: { name: 'Middle 2' } })
weightedGraph.addNode({ id: 'D', data: { name: 'End' } })

weightedGraph.addEdge({ from: 'A', to: 'B', weight: 1 })
weightedGraph.addEdge({ from: 'A', to: 'C', weight: 4 })
weightedGraph.addEdge({ from: 'B', to: 'D', weight: 2 })
weightedGraph.addEdge({ from: 'C', to: 'D', weight: 1 })

const shortestPath = weightedGraph.shortestPath('A', 'D')
console.log('Shortest path from A to D:', shortestPath)
