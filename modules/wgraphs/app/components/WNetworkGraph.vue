<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch, ref, computed } from 'vue'

interface NetworkNode {
  id: string
  label: string
  group?: string
  size?: number
  color?: string
}

interface NetworkEdge {
  source: string
  target: string
  label?: string
  width?: number
  style?: 'solid' | 'dashed' | 'dotted'
}

interface Props {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  title?: string
  height?: number
  layout?: 'circular' | 'grid' | 'random'
  interactive?: boolean
  showLabels?: boolean
  showEdgeLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 400,
  layout: 'circular',
  interactive: true,
  showLabels: true,
  showEdgeLabels: false,
})

const emit = defineEmits<{
  nodeClick: [node: NetworkNode]
  edgeClick: [edge: NetworkEdge]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('container')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const isVisible = ref(false)

// Internal state
const nodePositions = ref<Map<string, { x: number, y: number }>>(new Map())
const hoveredNode = ref<string | null>(null)
const selectedNode = ref<string | null>(null)
const hoveredEdge = ref<{ source: string, target: string } | null>(null)

const colorSchemes: Record<string, string> = {
  default: '#60a5fa',
  group1: '#f472b6',
  group2: '#34d399',
  group3: '#fbbf24',
  group4: '#a78bfa',
}

const getNodeColor = (node: NetworkNode): string => {
  if (node.color) return node.color
  if (node.group && colorSchemes[node.group]) return colorSchemes[node.group]
  return colorSchemes.default
}

const getNodeSize = (node: NetworkNode): number => node.size ?? 25

// Layout algorithms
const calculateLayout = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const centerX = width / 2
  const centerY = height / 2

  const positions = new Map<string, { x: number, y: number }>()

  switch (props.layout) {
    case 'circular': {
      const radius = Math.min(width, height) * 0.35
      const angleStep = (2 * Math.PI) / props.nodes.length

      props.nodes.forEach((node, index) => {
        const angle = index * angleStep - Math.PI / 2
        positions.set(node.id, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        })
      })
      break
    }

    case 'grid': {
      const cols = Math.ceil(Math.sqrt(props.nodes.length))
      const spacing = Math.min(width, height) / (cols + 1)

      props.nodes.forEach((node, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        positions.set(node.id, {
          x: spacing * (col + 1),
          y: spacing * (row + 1),
        })
      })
      break
    }

    case 'random': {
      const padding = 60
      props.nodes.forEach((node) => {
        positions.set(node.id, {
          x: padding + Math.random() * (width - padding * 2),
          y: padding + Math.random() * (height - padding * 2),
        })
      })
      break
    }
  }

  nodePositions.value = positions
}

// Get node position
const getNodePos = (id: string): { x: number, y: number } | null => {
  return nodePositions.value.get(id) ?? null
}

// Drawing
const draw = () => {
  const canvas = canvasRef.value
  if (!canvas || !isVisible.value) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height

  ctx.clearRect(0, 0, width, height)

  // Draw edges first (behind nodes)
  props.edges.forEach((edge) => {
    const source = getNodePos(edge.source)
    const target = getNodePos(edge.target)
    if (!source || !target) return

    const isHovered = hoveredEdge.value?.source === edge.source && hoveredEdge.value?.target === edge.target
    const isConnected = hoveredNode.value === edge.source || hoveredNode.value === edge.target

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)

    // Style
    switch (edge.style) {
      case 'dashed':
        ctx.setLineDash([8, 4])
        break
      case 'dotted':
        ctx.setLineDash([2, 4])
        break
      default:
        ctx.setLineDash([])
    }

    ctx.strokeStyle = isHovered || isConnected ? '#64748b' : '#94a3b8'
    ctx.lineWidth = edge.width ?? (isHovered || isConnected ? 3 : 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Edge label
    if (props.showEdgeLabels && edge.label) {
      const midX = (source.x + target.x) / 2
      const midY = (source.y + target.y) / 2

      ctx.fillStyle = isHovered ? '#475569' : '#64748b'
      ctx.font = '11px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Background for text
      const textWidth = ctx.measureText(edge.label).width
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(midX - textWidth / 2 - 4, midY - 8, textWidth + 8, 16)

      ctx.fillStyle = isHovered ? '#475569' : '#64748b'
      ctx.fillText(edge.label, midX, midY)
    }
  })

  // Draw nodes
  props.nodes.forEach((node) => {
    const pos = getNodePos(node.id)
    if (!pos) return

    const size = getNodeSize(node)
    const isHovered = hoveredNode.value === node.id
    const isSelected = selectedNode.value === node.id
    const color = getNodeColor(node)

    // Shadow/glow
    if (isHovered || isSelected) {
      ctx.shadowColor = color
      ctx.shadowBlur = 15
    }

    // Node circle
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    // Border
    ctx.strokeStyle = isSelected ? '#1e293b' : isHovered ? '#ffffff' : '#e2e8f0'
    ctx.lineWidth = isSelected ? 4 : isHovered ? 3 : 2
    ctx.stroke()

    // Label
    if (props.showLabels) {
      ctx.fillStyle = '#1e293b'
      ctx.font = `bold ${isHovered ? '13' : '12'}px system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, pos.x, pos.y)

      // Group label
      if (node.group) {
        ctx.fillStyle = '#64748b'
        ctx.font = '10px system-ui, sans-serif'
        ctx.fillText(`(${node.group})`, pos.x, pos.y + size + 14)
      }
    }
  })
}

// Mouse interactions
const getMousePos = (e: MouseEvent): { x: number, y: number } => {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

const getNodeAt = (x: number, y: number): NetworkNode | null => {
  for (const node of props.nodes) {
    const pos = getNodePos(node.id)
    if (!pos) continue

    const size = getNodeSize(node)
    const dx = x - pos.x
    const dy = y - pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= size) {
      return node
    }
  }
  return null
}

const getEdgeAt = (x: number, y: number): NetworkEdge | null => {
  const threshold = 10

  for (const edge of props.edges) {
    const source = getNodePos(edge.source)
    const target = getNodePos(edge.target)
    if (!source || !target) continue

    // Distance from point to line segment
    const A = x - source.x
    const B = y - source.y
    const C = target.x - source.x
    const D = target.y - source.y

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1

    if (lenSq !== 0) param = dot / lenSq

    let xx: number, yy: number

    if (param < 0) {
      xx = source.x
      yy = source.y
    } else if (param > 1) {
      xx = target.x
      yy = target.y
    } else {
      xx = source.x + param * C
      yy = source.y + param * D
    }

    const dx = x - xx
    const dy = y - yy
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= threshold) {
      return edge
    }
  }
  return null
}

const onMouseMove = (e: MouseEvent) => {
  if (!props.interactive) return

  const { x, y } = getMousePos(e)

  const node = getNodeAt(x, y)
  if (node?.id !== hoveredNode.value) {
    hoveredNode.value = node?.id ?? null
    draw()
  }

  if (!node) {
    const edge = getEdgeAt(x, y)
    if (edge) {
      hoveredEdge.value = { source: edge.source, target: edge.target }
      draw()
    } else if (hoveredEdge.value) {
      hoveredEdge.value = null
      draw()
    }
  }
}

const onClick = (e: MouseEvent) => {
  if (!props.interactive) return

  const { x, y } = getMousePos(e)

  const node = getNodeAt(x, y)
  if (node) {
    selectedNode.value = node.id
    emit('nodeClick', node)
    draw()
    return
  }

  const edge = getEdgeAt(x, y)
  if (edge) {
    emit('edgeClick', edge)
    return
  }

  selectedNode.value = null
  draw()
}

// Intersection Observer
let observer: IntersectionObserver | null = null

onMounted(() => {
  calculateLayout()

  if (containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            draw()
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(containerRef.value)
  }

  window.addEventListener('resize', () => {
    calculateLayout()
    draw()
  })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', draw)
})

watch(() => [props.nodes, props.edges, props.layout], () => {
  calculateLayout()
  if (isVisible.value) draw()
}, { deep: true })
</script>

<template>
  <div
    ref="container"
    class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
  >
    <div
      v-if="title"
      class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between"
    >
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h4>
      <span class="text-xs text-gray-500">
        {{ nodes.length }} nodes, {{ edges.length }} edges
      </span>
    </div>
    <div class="p-4">
      <canvas
        ref="canvas"
        :style="{ height: `${height}px`, width: '100%' }"
        class="w-full"
        :class="{ 'cursor-pointer': interactive }"
        @mousemove="onMouseMove"
        @click="onClick"
      />
    </div>
  </div>
</template>
