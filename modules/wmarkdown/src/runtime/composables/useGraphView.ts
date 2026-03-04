import { ref, computed } from 'vue'

interface GraphNode {
  id: string
  label: string
  type: 'page' | 'heading' | 'tag' | 'link'
  x?: number
  y?: number
  color?: string
  size?: number
}

interface GraphEdge {
  source: string
  target: string
  type: 'link' | 'reference' | 'parent'
  strength?: number
}

interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

interface PageLink {
  path: string
  title: string
  outgoingLinks: string[]
  incomingLinks: string[]
  tags: string[]
}

export function useGraphView() {
  const graphData = ref<GraphData>({ nodes: [], edges: [] })
  const selectedNodeId = ref<string | null>(null)
  const hoveredNodeId = ref<string | null>(null)
  const zoom = ref(1)
  const center = ref({ x: 0, y: 0 })

  const selectedNode = computed(() => {
    return graphData.value.nodes.find(n => n.id === selectedNodeId.value) || null
  })

  const connectedNodes = computed(() => {
    if (!selectedNodeId.value) return []

    const connected = new Set<string>()
    graphData.value.edges.forEach(edge => {
      if (edge.source === selectedNodeId.value) connected.add(edge.target)
      if (edge.target === selectedNodeId.value) connected.add(edge.source)
    })

    return graphData.value.nodes.filter(n => connected.has(n.id))
  })

  const buildGraph = (pages: PageLink[]) => {
    const nodes: GraphNode[] = []
    const edges: GraphEdge[] = []
    const nodeIds = new Set<string>()

    // Create page nodes
    pages.forEach(page => {
      if (!nodeIds.has(page.path)) {
        nodes.push({
          id: page.path,
          label: page.title || page.path,
          type: 'page',
          color: '#3b82f6',
          size: 8
        })
        nodeIds.add(page.path)
      }
    })

    // Create edges from links
    pages.forEach(page => {
      page.outgoingLinks.forEach(target => {
        const targetPage = pages.find(p => p.path === target || p.title === target)
        if (targetPage && nodeIds.has(targetPage.path)) {
          edges.push({
            source: page.path,
            target: targetPage.path,
            type: 'link',
            strength: 1
          })
        }
      })
    })

    // Create tag nodes
    const allTags = new Set<string>()
    pages.forEach(page => page.tags.forEach(tag => allTags.add(tag)))

    allTags.forEach(tag => {
      const tagId = `tag:${tag}`
      nodes.push({
        id: tagId,
        label: tag,
        type: 'tag',
        color: '#f59e0b',
        size: 5
      })

      // Connect pages to tags
      pages.forEach(page => {
        if (page.tags.includes(tag)) {
          edges.push({
            source: page.path,
            target: tagId,
            type: 'reference',
            strength: 0.5
          })
        }
      })
    })

    // Calculate node sizes based on connections
    nodes.forEach(node => {
      const connectionCount = edges.filter(
        e => e.source === node.id || e.target === node.id
      ).length
      node.size = Math.max(5, Math.min(15, 5 + connectionCount * 1.5))
    })

    graphData.value = { nodes, edges }
  }

  const extractLinksFromContent = (content: string): string[] => {
    const links: string[] = []
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

    let match
    while ((match = wikiLinkRegex.exec(content)) !== null) {
      links.push(match[1])
    }

    while ((match = mdLinkRegex.exec(content)) !== null) {
      const linkPath = match[2]
      if (!linkPath.startsWith('http')) {
        links.push(linkPath)
      }
    }

    return links
  }

  const selectNode = (nodeId: string | null) => {
    selectedNodeId.value = nodeId
  }

  const hoverNode = (nodeId: string | null) => {
    hoveredNodeId.value = nodeId
  }

  const zoomIn = () => {
    zoom.value = Math.min(zoom.value * 1.2, 3)
  }

  const zoomOut = () => {
    zoom.value = Math.max(zoom.value / 1.2, 0.3)
  }

  const resetView = () => {
    zoom.value = 1
    center.value = { x: 0, y: 0 }
  }

  const focusNode = (nodeId: string) => {
    const node = graphData.value.nodes.find(n => n.id === nodeId)
    if (node && node.x !== undefined && node.y !== undefined) {
      center.value = { x: node.x, y: node.y }
    }
  }

  const getShortestPath = (startId: string, endId: string): string[] | null => {
    const queue: Array<{ nodeId: string; path: string[] }> = [{ nodeId: startId, path: [startId] }]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!

      if (nodeId === endId) {
        return path
      }

      if (visited.has(nodeId)) continue
      visited.add(nodeId)

      const neighbors = graphData.value.edges
        .filter(e => e.source === nodeId || e.target === nodeId)
        .map(e => e.source === nodeId ? e.target : e.source)

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({ nodeId: neighbor, path: [...path, neighbor] })
        }
      }
    }

    return null
  }

  return {
    graphData,
    selectedNode,
    selectedNodeId,
    hoveredNodeId,
    zoom,
    center,
    connectedNodes,
    buildGraph,
    extractLinksFromContent,
    selectNode,
    hoverNode,
    zoomIn,
    zoomOut,
    resetView,
    focusNode,
    getShortestPath
  }
}
