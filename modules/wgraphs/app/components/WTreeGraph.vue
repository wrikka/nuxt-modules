<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, watch, ref } from 'vue'

interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  color?: string
  expanded?: boolean
}

interface Props {
  data: TreeNode
  title?: string
  height?: number
  nodeWidth?: number
  nodeHeight?: number
  levelSpacing?: number
  siblingSpacing?: number
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: 400,
  nodeWidth: 100,
  nodeHeight: 40,
  levelSpacing: 80,
  siblingSpacing: 20,
  interactive: true,
})

const emit = defineEmits<{
  nodeClick: [node: TreeNode]
  nodeToggle: [node: TreeNode, expanded: boolean]
}>()

const containerRef = useTemplateRef<HTMLDivElement>('container')
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const isVisible = ref(false)

// Internal state
const expandedNodes = ref<Set<string>>(new Set())
const nodePositions = ref<Map<string, { x: number, y: number, node: TreeNode }>>(new Map())
const hoveredNode = ref<string | null>(null)
const selectedNode = ref<string | null>(null)

const colorSchemes = [
  '#60a5fa', '#f472b6', '#34d399', '#fbbf24', '#a78bfa',
  '#f87171', '#38bdf8', '#4ade80', '#facc15', '#c084fc',
]

const getColor = (depth: number): string => colorSchemes[depth % colorSchemes.length] ?? '#60a5fa'

// Flatten tree and calculate positions
const calculateTreeLayout = () => {
  const positions = new Map<string, { x: number, y: number, node: TreeNode }>()

  const traverse = (node: TreeNode, depth: number, xOffset: number): number => {
    const isExpanded = expandedNodes.value.has(node.id)
    const children = node.children ?? []
    const visibleChildren = isExpanded ? children : []

    let childX = xOffset
    const childWidths: number[] = []

    for (const child of visibleChildren) {
      const childWidth = traverse(child, depth + 1, childX)
      childWidths.push(childWidth)
      childX += childWidth + props.siblingSpacing
    }

    const totalWidth = childWidths.length > 0
      ? childX - xOffset - props.siblingSpacing
      : props.nodeWidth

    const x = childWidths.length > 0
      ? xOffset + totalWidth / 2
      : xOffset + props.nodeWidth / 2

    const y = 60 + depth * props.levelSpacing

    positions.set(node.id, { x, y, node })

    return Math.max(totalWidth, props.nodeWidth)
  }

  traverse(props.data, 0, 50)
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

  ctx.clearRect(0, 0, width, height)

  // Draw connections first
  const drawConnections = (node: TreeNode) => {
    const isExpanded = expandedNodes.value.has(node.id)
    const children = node.children ?? []
    const visibleChildren = isExpanded ? children : []

    const parentPos = nodePositions.value.get(node.id)
    if (!parentPos) return

    for (const child of visibleChildren) {
      const childPos = nodePositions.value.get(child.id)
      if (!childPos) continue

      ctx.beginPath()
      ctx.moveTo(parentPos.x, parentPos.y + props.nodeHeight / 2)

      // Bezier curve for smooth connection
      const midY = (parentPos.y + childPos.y) / 2
      ctx.bezierCurveTo(
        parentPos.x, midY,
        childPos.x, midY,
        childPos.x, childPos.y - props.nodeHeight / 2
      )

      ctx.strokeStyle = hoveredNode.value === child.id || hoveredNode.value === node.id
        ? '#64748b'
        : '#94a3b8'
      ctx.lineWidth = hoveredNode.value === child.id || hoveredNode.value === node.id ? 3 : 2
      ctx.stroke()

      drawConnections(child)
    }
  }

  drawConnections(props.data)

  // Draw nodes
  nodePositions.value.forEach((pos, id) => {
    const depth = Math.floor((pos.y - 60) / props.levelSpacing)
    const color = pos.node.color ?? getColor(depth)
    const isHovered = hoveredNode.value === id
    const isSelected = selectedNode.value === id
    const hasChildren = (pos.node.children?.length ?? 0) > 0
    const isExpanded = expandedNodes.value.has(id)

    // Node rectangle
    const x = pos.x - props.nodeWidth / 2
    const y = pos.y - props.nodeHeight / 2

    // Shadow
    if (isHovered || isSelected) {
      ctx.shadowColor = color
      ctx.shadowBlur = 15
    }

    // Background
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, props.nodeWidth, props.nodeHeight, 8)
    ctx.fill()

    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    // Border
    ctx.strokeStyle = isSelected ? '#1e293b' : isHovered ? '#ffffff' : '#e2e8f0'
    ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1
    ctx.stroke()

    // Label
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${isHovered ? '12' : '11'}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Truncate label if too long
    let label = pos.node.label
    const maxWidth = props.nodeWidth - 16
    while (ctx.measureText(label).width > maxWidth && label.length > 3) {
      label = label.slice(0, -4) + '...'
    }
    ctx.fillText(label, pos.x, pos.y)

    // Expand/collapse indicator
    if (hasChildren) {
      const indicatorX = pos.x + props.nodeWidth / 2 + 10
      const indicatorY = pos.y

      ctx.beginPath()
      ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2)
      ctx.fillStyle = isExpanded ? '#ef4444' : '#22c55e'
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(indicatorX - 3, indicatorY)
      ctx.lineTo(indicatorX + 3, indicatorY)
      if (!isExpanded) {
        ctx.moveTo(indicatorX, indicatorY - 3)
        ctx.lineTo(indicatorX, indicatorY + 3)
      }
      ctx.stroke()
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

const getNodeAt = (x: number, y: number): { id: string, node: TreeNode, isToggle: boolean } | null => {
  for (const [id, pos] of nodePositions.value) {
    const halfWidth = props.nodeWidth / 2
    const halfHeight = props.nodeHeight / 2

    if (x >= pos.x - halfWidth && x <= pos.x + halfWidth &&
        y >= pos.y - halfHeight && y <= pos.y + halfHeight) {
      return { id, node: pos.node, isToggle: false }
    }

    // Check toggle button
    const hasChildren = (pos.node.children?.length ?? 0) > 0
    if (hasChildren) {
      const toggleX = pos.x + halfWidth + 10
      const toggleY = pos.y
      const dist = Math.sqrt((x - toggleX) ** 2 + (y - toggleY) ** 2)
      if (dist <= 8) {
        return { id, node: pos.node, isToggle: true }
      }
    }
  }
  return null
}

const onMouseMove = (e: MouseEvent) => {
  if (!props.interactive) return

  const { x, y } = getMousePos(e)
  const result = getNodeAt(x, y)

  if (result?.id !== hoveredNode.value) {
    hoveredNode.value = result?.id ?? null
    draw()
  }
}

const onClick = (e: MouseEvent) => {
  if (!props.interactive) return

  const { x, y } = getMousePos(e)
  const result = getNodeAt(x, y)

  if (result) {
    if (result.isToggle) {
      const isExpanded = expandedNodes.value.has(result.id)
      if (isExpanded) {
        expandedNodes.value.delete(result.id)
      } else {
        expandedNodes.value.add(result.id)
      }
      emit('nodeToggle', result.node, !isExpanded)
      calculateTreeLayout()
      draw()
    } else {
      selectedNode.value = result.id
      emit('nodeClick', result.node)
      draw()
    }
  } else {
    selectedNode.value = null
    draw()
  }
}

// Initialize expanded state
const initExpanded = (node: TreeNode) => {
  if (node.expanded !== false) {
    expandedNodes.value.add(node.id)
  }
  node.children?.forEach(initExpanded)
}

// Intersection Observer
let observer: IntersectionObserver | null = null

onMounted(() => {
  expandedNodes.value.clear()
  initExpanded(props.data)
  calculateTreeLayout()

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
    calculateTreeLayout()
    draw()
  })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('resize', draw)
})

watch(() => props.data, () => {
  expandedNodes.value.clear()
  initExpanded(props.data)
  calculateTreeLayout()
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
        class="w-full"
        :class="{ 'cursor-pointer': interactive }"
        @mousemove="onMouseMove"
        @click="onClick"
      />
    </div>
  </div>
</template>
