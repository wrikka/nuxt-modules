<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch, ref } from 'vue'

interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
  vx?: number
  vy?: number
  radius?: number
  color?: string
  mass?: number
}

interface GraphEdge {
  source: string
  target: string
  weight?: number
}

interface Props {
  nodes: GraphNode[]
  edges: GraphEdge[]
  title?: string
  height?: number
  animated?: boolean
  nodeRadius?: number
  repulsion?: number
  springLength?: number
  damping?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 400,
  animated: true,
  nodeRadius: 20,
  repulsion: 1000,
  springLength: 100,
  damping: 0.9,
})

const emit = defineEmits<{
  nodeClick: [node: GraphNode]
  nodeHover: [node: GraphNode | null]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('container')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const isVisible = ref(false)
const isRunning = ref(false)

// Internal node state with physics properties
const graphNodes = ref<Required<GraphNode>[]>([])
const graphEdges = ref<GraphEdge[]>([])
const hoveredNode = ref<string | null>(null)
const draggedNode = ref<string | null>(null)

const colorSchemes = [
  '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa',
  '#f87171', '#38bdf8', '#4ade80', '#facc15', '#c084fc',
]

const getColor = (index: number): string => colorSchemes[index % colorSchemes.length] ?? '#60a5fa'

// Initialize nodes with random positions
const initNodes = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  graphNodes.value = props.nodes.map((node, index) => ({
    ...node,
    x: node.x ?? centerX + (Math.random() - 0.5) * 200,
    y: node.y ?? centerY + (Math.random() - 0.5) * 200,
    vx: 0,
    vy: 0,
    radius: node.radius ?? props.nodeRadius,
    color: node.color ?? getColor(index),
    mass: node.mass ?? 1,
  }))

  graphEdges.value = props.edges
}

// Force-directed layout physics
const applyForces = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const width = rect.width
  const height = rect.height

  // Repulsion force between nodes
  for (let i = 0; i < graphNodes.value.length; i++) {
    for (let j = i + 1; j < graphNodes.value.length; j++) {
      const nodeA = graphNodes.value[i]
      const nodeB = graphNodes.value[j]

      const dx = nodeB.x - nodeA.x
      const dy = nodeB.y - nodeA.y
      const distance = Math.sqrt(dx * dx + dy * dy) || 1

      const force = props.repulsion / (distance * distance)
      const fx = (dx / distance) * force
      const fy = (dy / distance) * force

      if (nodeA.id !== draggedNode.value) {
        nodeA.vx -= fx / nodeA.mass
        nodeA.vy -= fy / nodeA.mass
      }
      if (nodeB.id !== draggedNode.value) {
        nodeB.vx += fx / nodeB.mass
        nodeB.vy += fy / nodeB.mass
      }
    }
  }

  // Spring force along edges
  graphEdges.value.forEach((edge) => {
    const source = graphNodes.value.find(n => n.id === edge.source)
    const target = graphNodes.value.find(n => n.id === edge.target)
    if (!source || !target) return

    const dx = target.x - source.x
    const dy = target.y - source.y
    const distance = Math.sqrt(dx * dx + dy * dy) || 1

    const displacement = distance - props.springLength
    const force = displacement * 0.05 * (edge.weight ?? 1)
    const fx = (dx / distance) * force
    const fy = (dy / distance) * force

    if (source.id !== draggedNode.value) {
      source.vx += fx / source.mass
      source.vy += fy / source.mass
    }
    if (target.id !== draggedNode.value) {
      target.vx -= fx / target.mass
      target.vy -= fy / target.mass
    }
  })

  // Center gravity
  const centerX = width / 2
  const centerY = height / 2
  graphNodes.value.forEach((node) => {
    if (node.id === draggedNode.value) return

    const dx = centerX - node.x
    const dy = centerY - node.y
    node.vx += dx * 0.001
    node.vy += dy * 0.001

    // Damping
    node.vx *= props.damping
    node.vy *= props.damping

    // Update position
    node.x += node.vx
    node.y += node.vy

    // Boundary constraints
    const padding = node.radius + 10
    node.x = Math.max(padding, Math.min(width - padding, node.x))
    node.y = Math.max(padding, Math.min(height - padding, node.y))
  })
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

  // Clear
  ctx.clearRect(0, 0, width, height)

  // Draw edges
  graphEdges.value.forEach((edge) => {
    const source = graphNodes.value.find(n => n.id === edge.source)
    const target = graphNodes.value.find(n => n.id === edge.target)
    if (!source || !target) return

    const isHovered = hoveredNode.value === source.id || hoveredNode.value === target.id

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)
    ctx.strokeStyle = isHovered ? '#94a3b8' : '#cbd5e1'
    ctx.lineWidth = isHovered ? 3 : 2
    ctx.stroke()

    // Arrowhead
    const dx = target.x - source.x
    const dy = target.y - source.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const arrowX = target.x - (dx / distance) * (target.radius + 5)
    const arrowY = target.y - (dy / distance) * (target.radius + 5)

    const angle = Math.atan2(dy, dx)
    const arrowSize = 8

    ctx.beginPath()
    ctx.moveTo(arrowX, arrowY)
    ctx.lineTo(
      arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
      arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
      arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fillStyle = isHovered ? '#94a3b8' : '#cbd5e1'
    ctx.fill()
  })

  // Draw nodes
  graphNodes.value.forEach((node) => {
    const isHovered = hoveredNode.value === node.id
    const isDragged = draggedNode.value === node.id

    // Glow effect for hovered
    if (isHovered || isDragged) {
      ctx.shadowColor = node.color
      ctx.shadowBlur = 20
    }

    // Node circle
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
    ctx.fillStyle = node.color
    ctx.fill()

    // Reset shadow
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    // Border
    ctx.strokeStyle = isHovered || isDragged ? '#ffffff' : '#e2e8f0'
    ctx.lineWidth = isHovered || isDragged ? 4 : 2
    ctx.stroke()

    // Label
    ctx.fillStyle = '#1e293b'
    ctx.font = `bold ${isHovered ? '13' : '12'}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.label, node.x, node.y)
  })
}

// Animation loop
let animationId: number | null = null

const animate = () => {
  if (!props.animated || !isRunning.value) return

  applyForces()
  draw()
  animationId = requestAnimationFrame(animate)
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

const getNodeAt = (x: number, y: number): Required<GraphNode> | null => {
  for (const node of graphNodes.value) {
    const dx = x - node.x
    const dy = y - node.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance <= node.radius) {
      return node
    }
  }
  return null
}

const onMouseMove = (e: MouseEvent) => {
  const { x, y } = getMousePos(e)

  if (draggedNode.value) {
    const node = graphNodes.value.find(n => n.id === draggedNode.value)
    if (node) {
      node.x = x
      node.y = y
      node.vx = 0
      node.vy = 0
    }
    return
  }

  const node = getNodeAt(x, y)
  if (node?.id !== hoveredNode.value) {
    hoveredNode.value = node?.id ?? null
    emit('nodeHover', node)
  }
}

const onMouseDown = (e: MouseEvent) => {
  const { x, y } = getMousePos(e)
  const node = getNodeAt(x, y)

  if (node) {
    draggedNode.value = node.id
    emit('nodeClick', node)
  }
}

const onMouseUp = () => {
  draggedNode.value = null
}

const onMouseLeave = () => {
  hoveredNode.value = null
  draggedNode.value = null
  emit('nodeHover', null)
}

// Intersection Observer
let observer: IntersectionObserver | null = null

onMounted(() => {
  initNodes()

  if (containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            isRunning.value = true
            if (props.animated) {
              animate()
            } else {
              draw()
            }
          } else {
            isVisible.value = false
            isRunning.value = false
            if (animationId) {
              cancelAnimationFrame(animationId)
              animationId = null
            }
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(containerRef.value)
  }

  window.addEventListener('resize', () => {
    initNodes()
    draw()
  })
})

onUnmounted(() => {
  observer?.disconnect()
  isRunning.value = false
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', draw)
})

watch(() => [props.nodes, props.edges], () => {
  initNodes()
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
      class="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
    >
      <h4 class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h4>
    </div>
    <div class="p-4">
      <canvas
        ref="canvas"
        :style="{ height: `${height}px`, width: '100%' }"
        class="w-full cursor-grab active:cursor-grabbing"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
      />
    </div>
  </div>
</template>
