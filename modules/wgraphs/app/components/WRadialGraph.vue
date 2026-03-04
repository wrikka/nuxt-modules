<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch, ref } from 'vue'

interface RadialNode {
  id: string
  label: string
  level: number
  color?: string
  size?: number
}

interface RadialEdge {
  source: string
  target: string
  weight?: number
}

interface Props {
  nodes: RadialNode[]
  edges: RadialEdge[]
  title?: string
  height?: number
  interactive?: boolean
  showLabels?: boolean
  maxLevels?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 400,
  interactive: true,
  showLabels: true,
  maxLevels: 4,
})

const emit = defineEmits<{
  nodeClick: [node: RadialNode]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('container')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const isVisible = ref(false)

// Internal state
const nodePositions = ref<Map<string, { x: number, y: number, angle: number, radius: number }>>(new Map())
const hoveredNode = ref<string | null>(null)
const selectedNode = ref<string | null>(null)

const colorSchemes = [
  '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa',
  '#f87171', '#38bdf8', '#4ade80', '#facc15', '#c084fc',
]

const getColor = (level: number): string => colorSchemes[level % colorSchemes.length] ?? '#60a5fa'

// Group nodes by level
const getNodesByLevel = (): Map<number, RadialNode[]> => {
  const levels = new Map<number, RadialNode[]>()

  for (const node of props.nodes) {
    const level = Math.min(node.level, props.maxLevels - 1)
    if (!levels.has(level)) {
      levels.set(level, [])
    }
    levels.get(level)?.push(node)
  }

  return levels
}

// Calculate radial layout
const calculateRadialLayout = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const maxRadius = Math.min(centerX, centerY) - 60

  const levels = getNodesByLevel()
  const positions = new Map<string, { x: number, y: number, angle: number, radius: number }>()

  // Level 0 is at center
  const centerNodes = levels.get(0) ?? []
  for (const node of centerNodes) {
    positions.set(node.id, {
      x: centerX,
      y: centerY,
      angle: 0,
      radius: 0,
    })
  }

  // Other levels are in concentric circles
  for (let level = 1; level < props.maxLevels; level++) {
    const levelNodes = levels.get(level) ?? []
    if (levelNodes.length === 0) continue

    const radius = (maxRadius / (props.maxLevels - 1)) * level
    const angleStep = (2 * Math.PI) / levelNodes.length

    levelNodes.forEach((node, index) => {
      const angle = index * angleStep - Math.PI / 2
      positions.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        angle,
        radius,
      })
    })
  }

  nodePositions.value = positions
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
  const centerX = width / 2
  const centerY = height / 2

  ctx.clearRect(0, 0, width, height)

  // Draw concentric circles for levels
  const maxRadius = Math.min(centerX, centerY) - 60
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1

  for (let level = 1; level < props.maxLevels; level++) {
    const radius = (maxRadius / (props.maxLevels - 1)) * level
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Level label
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`L${level}`, centerX + radius + 12, centerY)
  }

  // Draw edges
  props.edges.forEach((edge) => {
    const source = nodePositions.value.get(edge.source)
    const target = nodePositions.value.get(edge.target)
    if (!source || !target) return

    const isConnected = hoveredNode.value === edge.source || hoveredNode.value === edge.target

    ctx.beginPath()
    ctx.moveTo(source.x, source.y)

    // Curved connection
    const midX = (source.x + target.x) / 2
    const midY = (source.y + target.y) / 2
    const cpX = (midX + centerX) / 2
    const cpY = (midY + centerY) / 2

    ctx.quadraticCurveTo(cpX, cpY, target.x, target.y)

    ctx.strokeStyle = isConnected ? '#64748b' : '#94a3b8'
    ctx.lineWidth = (edge.weight ?? 1) * (isConnected ? 2.5 : 1.5)
    ctx.stroke()
  })

  // Draw nodes
  props.nodes.forEach((node) => {
    const pos = nodePositions.value.get(node.id)
    if (!pos) return

    const isHovered = hoveredNode.value === node.id
    const isSelected = selectedNode.value === node.id
    const color = node.color ?? getColor(node.level)
    const size = node.size ?? (node.level === 0 ? 35 : 25)

    // Glow effect
    if (isHovered || isSelected) {
      ctx.shadowColor = color
      ctx.shadowBlur = 20
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
      ctx.fillStyle = '#ffffff'
      ctx.font = `bold ${isHovered ? '13' : '12'}px system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, pos.x, pos.y)

      // Level indicator
      if (node.level > 0) {
        ctx.fillStyle = '#64748b'
        ctx.font = '9px system-ui, sans-serif'
        ctx.fillText(`L${node.level}`, pos.x, pos.y + size + 12)
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

const getNodeAt = (x: number, y: number): RadialNode | null => {
  for (const node of props.nodes) {
    const pos = nodePositions.value.get(node.id)
    if (!pos) continue

    const size = node.size ?? (node.level === 0 ? 35 : 25)
    const dx = x - pos.x
    const dy = y - pos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= size) {
      return node
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
}

const onClick = (e: MouseEvent) => {
  if (!props.interactive) return

  const { x, y } = getMousePos(e)
  const node = getNodeAt(x, y)

  if (node) {
    selectedNode.value = node.id
    emit('nodeClick', node)
    draw()
  } else {
    selectedNode.value = null
    draw()
  }
}

// Intersection Observer
let observer: IntersectionObserver | null = null

onMounted(() => {
  calculateRadialLayout()

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
    calculateRadialLayout()
    draw()
  })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', draw)
})

watch(() => [props.nodes, props.edges], () => {
  calculateRadialLayout()
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
        {{ nodes.length }} nodes
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
