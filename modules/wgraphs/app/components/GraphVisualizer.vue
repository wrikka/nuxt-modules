<template>
  <div class="graph-visualizer-container">
    <div class="controls">
      <button @click="resetView" class="control-btn">Reset View</button>
      <button @click="toggleLayout" class="control-btn">
        {{ layout === 'circular' ? 'Grid Layout' : 'Circular Layout' }}
      </button>
      <button @click="exportSVG" class="control-btn">Export SVG</button>
    </div>

    <div class="graph-area" ref="graphArea">
      <svg
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="viewBox"
        class="graph-svg"
        @mousedown="startPan"
        @mousemove="pan"
        @mouseup="endPan"
        @wheel="zoom"
      >
        <!-- Grid background for better visualization -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
          </pattern>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
          </marker>
          <marker id="arrowhead-highlighted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4A90E2"/>
          </marker>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Edges -->
        <g class="edges">
          <line
            v-for="edge in visibleEdges"
            :key="`edge-${edge.from}-${edge.to}`"
            :x1="getNodePosition(edge.from).x"
            :y1="getNodePosition(edge.from).y"
            :x2="getNodePosition(edge.to).x"
            :y2="getNodePosition(edge.to).y"
            :stroke="edge.highlighted ? '#4A90E2' : '#666'"
            :stroke-width="edge.highlighted ? '3' : '2'"
            :marker-end="`url(#${edge.highlighted ? 'arrowhead-highlighted' : 'arrowhead'})`"
            class="edge-line"
          />

          <!-- Edge labels -->
          <text
            v-for="edge in visibleEdges"
            :key="`edge-label-${edge.from}-${edge.to}`"
            :x="(getNodePosition(edge.from).x + getNodePosition(edge.to).x) / 2"
            :y="(getNodePosition(edge.from).y + getNodePosition(edge.to).y) / 2 - 5"
            text-anchor="middle"
            :fill="edge.highlighted ? '#4A90E2' : '#666'"
            font-size="12"
            font-weight="bold"
          >
            {{ edge.weight }}
          </text>
        </g>

        <!-- Nodes -->
        <g class="nodes">
          <circle
            v-for="node in visibleNodes"
            :key="`node-${node.id}`"
            :cx="getNodePosition(node.id).x"
            :cy="getNodePosition(node.id).y"
            :r="nodeSize"
            :fill="node.color || '#4A90E2'"
            :stroke="node.selected ? '#fff' : '#333'"
            :stroke-width="node.selected ? '3' : '2'"
            class="node-circle"
            @mousedown.stop="selectNode(node)"
            @dblclick="onNodeDoubleClick(node)"
          />

          <!-- Node labels -->
          <text
            v-for="node in visibleNodes"
            :key="`label-${node.id}`"
            :x="getNodePosition(node.id).x"
            :y="getNodePosition(node.id).y + 5"
            text-anchor="middle"
            fill="#fff"
            font-size="14"
            font-weight="bold"
            class="node-label"
          >
            {{ node.label || node.id }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Info panel -->
    <div class="info-panel" v-if="selectedNode">
      <h4>Node: {{ selectedNode.label || selectedNode.id }}</h4>
      <p>ID: {{ selectedNode.id }}</p>
      <p v-if="selectedNode.data">Data: {{ JSON.stringify(selectedNode.data) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface Node {
  id: string | number
  label?: string
  x?: number
  y?: number
  color?: string
  selected?: boolean
  data?: any
}

interface Edge {
  from: string | number
  to: string | number
  weight?: number
  highlighted?: boolean
}

interface Props {
  nodes: Node[]
  edges: Edge[]
  width?: number
  height?: number
  nodeSize?: number
  layout?: 'circular' | 'grid' | 'force'
  zoomLevel?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  nodeSize: 25,
  layout: 'circular',
  zoomLevel: 1
})

const emit = defineEmits<{
  nodeClick: [node: Node]
  nodeDoubleClick: [node: Node]
  edgeClick: [edge: Edge]
}>()

// Reactive state
const selectedNode = ref<Node | null>(null)
const panOffset = ref({ x: 0, y: 0 })
const zoomLevel = ref(props.zoomLevel)
const isPanning = ref(false)
const lastPanPoint = ref({ x: 0, y: 0 })
const graphArea = ref<HTMLElement>()

// Computed properties
const svgWidth = computed(() => props.width)
const svgHeight = computed(() => props.height)
const viewBox = computed(() => {
  const centerX = props.width / 2
  const centerY = props.height / 2
  const viewWidth = props.width / zoomLevel.value
  const viewHeight = props.height / zoomLevel.value
  return `${centerX - viewWidth/2 - panOffset.value.x} ${centerY - viewHeight/2 - panOffset.value.y} ${viewWidth} ${viewHeight}`
})

const visibleNodes = computed(() => props.nodes)
const visibleEdges = computed(() => props.edges)

// Node positioning based on layout
const nodePositions = computed(() => {
  const positions: Record<string | number, { x: number; y: number }> = {}

  if (props.layout === 'circular') {
    const centerX = props.width / 2
    const centerY = props.height / 2
    const radius = Math.min(props.width, props.height) / 3

    props.nodes.forEach((node, index) => {
      const angle = (index / props.nodes.length) * 2 * Math.PI - Math.PI / 2
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })
  } else if (props.layout === 'grid') {
    const cols = Math.ceil(Math.sqrt(props.nodes.length))
    const rows = Math.ceil(props.nodes.length / cols)
    const cellWidth = props.width / cols
    const cellHeight = props.height / rows

    props.nodes.forEach((node, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      positions[node.id] = {
        x: col * cellWidth + cellWidth / 2,
        y: row * cellHeight + cellHeight / 2
      }
    })
  } else {
    // Random layout (can be enhanced with force-directed layout later)
    props.nodes.forEach((node) => {
      positions[node.id] = {
        x: Math.random() * (props.width - 2 * props.nodeSize) + props.nodeSize,
        y: Math.random() * (props.height - 2 * props.nodeSize) + props.nodeSize
      }
    })
  }

  return positions
})

const getNodePosition = (nodeId: string | number) => {
  return nodePositions.value[nodeId] || { x: props.width / 2, y: props.height / 2 }
}

// Event handlers
const selectNode = (node: Node) => {
  selectedNode.value = node
  emit('nodeClick', node)
}

const onNodeDoubleClick = (node: Node) => {
  emit('nodeDoubleClick', node)
}

const startPan = (event: MouseEvent) => {
  isPanning.value = true
  lastPanPoint.value = { x: event.clientX, y: event.clientY }
}

const pan = (event: MouseEvent) => {
  if (!isPanning.value) return

  const deltaX = event.clientX - lastPanPoint.value.x
  const deltaY = event.clientY - lastPanPoint.value.y

  panOffset.value.x += deltaX / zoomLevel.value
  panOffset.value.y += deltaY / zoomLevel.value

  lastPanPoint.value = { x: event.clientX, y: event.clientY }
}

const endPan = () => {
  isPanning.value = false
}

const zoom = (event: WheelEvent) => {
  event.preventDefault()
  const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
  zoomLevel.value *= zoomFactor
  zoomLevel.value = Math.max(0.1, Math.min(5, zoomLevel.value))
}

const resetView = () => {
  panOffset.value = { x: 0, y: 0 }
  zoomLevel.value = 1
  selectedNode.value = null
}

const toggleLayout = () => {
  // This would need to be handled by parent component
  // For now, just emit an event
  console.log('Layout toggle requested')
}

const exportSVG = () => {
  const svgElement = graphArea.value?.querySelector('.graph-svg') as SVGElement
  if (!svgElement) return

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(svgElement)

  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'graph.svg'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Initialize
onMounted(() => {
  // Add keyboard shortcuts
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selectedNode.value = null
    } else if (event.key === 'r' || event.key === 'R') {
      resetView()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.graph-visualizer-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.controls {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 8px;
}

.control-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #e9e9e9;
  border-color: #bbb;
}

.graph-area {
  position: relative;
  overflow: hidden;
  cursor: grab;
}

.graph-area:active {
  cursor: grabbing;
}

.graph-svg {
  display: block;
  background: #fafafa;
}

.node-circle {
  cursor: pointer;
  transition: all 0.2s;
}

.node-circle:hover {
  stroke-width: 3;
  stroke: #fff;
}

.edge-line {
  cursor: pointer;
  transition: stroke-width 0.2s;
}

.edge-line:hover {
  stroke-width: 4;
}

.node-label {
  pointer-events: none;
  user-select: none;
}

.info-panel {
  padding: 12px;
  border-top: 1px solid #eee;
  background: #f9f9f9;
  font-size: 14px;
}

.info-panel h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.info-panel p {
  margin: 4px 0;
  color: #666;
}
</style>
