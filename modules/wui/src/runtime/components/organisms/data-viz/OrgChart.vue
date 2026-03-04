<script setup lang="ts">
interface OrgNode {
  id: string
  name: string
  title?: string
  avatar?: string
  children?: OrgNode[]
}

interface Props {
  data: OrgNode
  orientation?: 'vertical' | 'horizontal'
  nodeWidth?: number
  nodeHeight?: number
  gapX?: number
  gapY?: number
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
  nodeWidth: 180,
  nodeHeight: 80,
  gapX: 40,
  gapY: 60
})

const emit = defineEmits<{
  nodeClick: [node: OrgNode]
}>()

const containerRef = ref<HTMLDivElement>()
const scale = ref(1)

const zoomIn = () => scale.value = Math.min(scale.value + 0.1, 2)
const zoomOut = () => scale.value = Math.max(scale.value - 0.1, 0.5)
const resetZoom = () => scale.value = 1

function calculateTreeDimensions(node: OrgNode, depth = 0): { width: number; height: number } {
  if (!node.children?.length) {
    return {
      width: props.nodeWidth,
      height: props.nodeHeight
    }
  }
  
  const childDimensions = node.children.map(child => calculateTreeDimensions(child, depth + 1))
  
  if (props.orientation === 'vertical') {
    const totalWidth = childDimensions.reduce((sum, d) => sum + d.width, 0) + (node.children.length - 1) * props.gapX
    const maxChildHeight = Math.max(...childDimensions.map(d => d.height))
    return {
      width: Math.max(props.nodeWidth, totalWidth),
      height: props.nodeHeight + props.gapY + maxChildHeight
    }
  } else {
    const totalHeight = childDimensions.reduce((sum, d) => sum + d.height, 0) + (node.children.length - 1) * props.gapY
    const maxChildWidth = Math.max(...childDimensions.map(d => d.width))
    return {
      width: props.nodeWidth + props.gapX + maxChildWidth,
      height: Math.max(props.nodeHeight, totalHeight)
    }
  }
}

const treeDimensions = computed(() => calculateTreeDimensions(props.data))
</script>

<template>
  <div class="relative rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
      <Button size="sm" variant="ghost" @click="zoomOut">
        <span class="i-lucide-zoom-out size-4" />
      </Button>
      <span class="text-sm">{{ Math.round(scale * 100) }}%</span>
      <Button size="sm" variant="ghost" @click="zoomIn">
        <span class="i-lucide-zoom-in size-4" />
      </Button>
      <Button size="sm" variant="ghost" @click="resetZoom">
        <span class="i-lucide-rotate-ccw size-4" />
      </Button>
    </div>
    
    <div
      ref="containerRef"
      class="overflow-auto p-8"
      :style="{
        minHeight: '400px',
        maxHeight: '600px'
      }"
    >
      <div
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${treeDimensions.width}px`,
          height: `${treeDimensions.height}px`
        }"
      >
        <OrgChartNode
          :node="data"
          :orientation="orientation"
          :node-width="nodeWidth"
          :node-height="nodeHeight"
          :gap-x="gapX"
          :gap-y="gapY"
          @node-click="emit('nodeClick', $event)"
        />
      </div>
    </div>
  </div>
</template>
