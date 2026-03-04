import { ref, computed } from 'vue'

interface MindMapNode {
  id: string
  text: string
  children: MindMapNode[]
  collapsed?: boolean
  level: number
}

interface MindMapOptions {
  direction?: 'right' | 'left' | 'center'
  layout?: 'tree' | 'radial'
}

export function useMindMapView(options: MindMapOptions = {}) {
  const rootNode = ref<MindMapNode | null>(null)
  const selectedNodeId = ref<string | null>(null)
  const zoom = ref(1)
  const pan = ref({ x: 0, y: 0 })

  const selectedNode = computed(() => {
    return findNode(rootNode.value, selectedNodeId.value)
  })

  const flattenedNodes = computed(() => {
    const nodes: MindMapNode[] = []
    const traverse = (node: MindMapNode) => {
      nodes.push(node)
      if (!node.collapsed) {
        node.children.forEach(traverse)
      }
    }
    if (rootNode.value) traverse(rootNode.value)
    return nodes
  })

  const fromMarkdown = (markdown: string) => {
    const lines = markdown.split('\n')
    const stack: MindMapNode[] = []
    let root: MindMapNode | null = null

    for (const line of lines) {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2]
        const node: MindMapNode = {
          id: generateId(),
          text,
          children: [],
          level
        }

        if (!root) {
          root = node
          stack.push(node)
        } else {
          // Find parent based on heading level
          while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop()
          }

          if (stack.length > 0) {
            stack[stack.length - 1].children.push(node)
          }
          stack.push(node)
        }
      }
    }

    rootNode.value = root
  }

  const toMarkdown = (): string => {
    const lines: string[] = []

    const traverse = (node: MindMapNode) => {
      lines.push(`${'#'.repeat(node.level)} ${node.text}`)
      if (!node.collapsed) {
        node.children.forEach(traverse)
      }
    }

    if (rootNode.value) traverse(rootNode.value)
    return lines.join('\n')
  }

  const toggleCollapse = (nodeId: string) => {
    const node = findNode(rootNode.value, nodeId)
    if (node) {
      node.collapsed = !node.collapsed
    }
  }

  const expandAll = () => {
    const traverse = (node: MindMapNode) => {
      node.collapsed = false
      node.children.forEach(traverse)
    }
    if (rootNode.value) traverse(rootNode.value)
  }

  const collapseAll = () => {
    const traverse = (node: MindMapNode) => {
      node.collapsed = true
      node.children.forEach(traverse)
    }
    if (rootNode.value) traverse(rootNode.value)
  }

  const selectNode = (nodeId: string | null) => {
    selectedNodeId.value = nodeId
  }

  const addChild = (parentId: string, text: string): MindMapNode | null => {
    const parent = findNode(rootNode.value, parentId)
    if (!parent) return null

    const child: MindMapNode = {
      id: generateId(),
      text,
      children: [],
      level: parent.level + 1
    }

    parent.children.push(child)
    parent.collapsed = false
    return child
  }

  const removeNode = (nodeId: string): boolean => {
    if (!rootNode.value) return false
    if (rootNode.value.id === nodeId) {
      rootNode.value = null
      return true
    }

    return removeFromParent(rootNode.value, nodeId)
  }

  const updateNode = (nodeId: string, text: string): boolean => {
    const node = findNode(rootNode.value, nodeId)
    if (!node) return false
    node.text = text
    return true
  }

  const zoomIn = () => {
    zoom.value = Math.min(zoom.value * 1.2, 3)
  }

  const zoomOut = () => {
    zoom.value = Math.max(zoom.value / 1.2, 0.3)
  }

  const resetZoom = () => {
    zoom.value = 1
    pan.value = { x: 0, y: 0 }
  }

  const panTo = (x: number, y: number) => {
    pan.value = { x, y }
  }

  return {
    rootNode,
    selectedNode,
    selectedNodeId,
    zoom,
    pan,
    flattenedNodes,
    fromMarkdown,
    toMarkdown,
    toggleCollapse,
    expandAll,
    collapseAll,
    selectNode,
    addChild,
    removeNode,
    updateNode,
    zoomIn,
    zoomOut,
    resetZoom,
    panTo
  }
}

function findNode(root: MindMapNode | null, id: string | null): MindMapNode | null {
  if (!root || !id) return null
  if (root.id === id) return root

  for (const child of root.children) {
    const found = findNode(child, id)
    if (found) return found
  }

  return null
}

function removeFromParent(parent: MindMapNode, id: string): boolean {
  const index = parent.children.findIndex(c => c.id === id)
  if (index !== -1) {
    parent.children.splice(index, 1)
    return true
  }

  for (const child of parent.children) {
    if (removeFromParent(child, id)) return true
  }

  return false
}

function generateId(): string {
  return 'mm-' + Math.random().toString(36).substr(2, 9)
}
