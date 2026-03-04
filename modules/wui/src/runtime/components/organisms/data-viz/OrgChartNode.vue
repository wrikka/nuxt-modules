<script setup lang="ts">
interface OrgNode {
  id: string
  name: string
  title?: string
  avatar?: string
  children?: OrgNode[]
}

interface Props {
  node: OrgNode
  orientation: 'vertical' | 'horizontal'
  nodeWidth: number
  nodeHeight: number
  gapX: number
  gapY: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ nodeClick: [node: OrgNode] }>()

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

const childPositions = computed(() => {
  if (!hasChildren.value) return []
  
  let offset = 0
  return props.node.children!.map((child, index) => {
    const prevOffset = offset
    if (props.orientation === 'vertical') {
      offset += 200 + props.gapX
      return { x: prevOffset, y: props.nodeHeight + props.gapY }
    } else {
      offset += props.nodeHeight + props.gapY
      return { x: props.nodeWidth + props.gapX, y: prevOffset }
    }
  })
})
</script>

<template>
  <div class="relative">
    <div
      class="absolute z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      :style="{
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`
      }"
      @click="emit('nodeClick', node)"
    >
      <div class="flex items-center gap-3 h-full">
        <Avatar v-if="node.avatar" :src="node.avatar" :alt="node.name" />
        <Avatar v-else :alt="node.name" />
        <div class="min-w-0">
          <p class="font-medium truncate">{{ node.name }}</p>
          <p v-if="node.title" class="text-sm text-gray-500 truncate">{{ node.title }}</p>
        </div>
      </div>
    </div>
    
    <template v-if="hasChildren">
      <svg
        class="absolute pointer-events-none"
        :style="{
          top: 0,
          left: 0,
          width: orientation === 'vertical' ? `${(node.children!.length * 200) + ((node.children!.length - 1) * gapX)}px` : `${nodeWidth + gapX}px`,
          height: orientation === 'vertical' ? `${nodeHeight + gapY}px` : `${(node.children!.length * nodeHeight) + ((node.children!.length - 1) * gapY)}px`
        }"
      >
        <line
          v-for="(_, i) in node.children"
          :key="`line-${i}`"
          :x1="nodeWidth / 2"
          :y1="nodeHeight"
          :x2="orientation === 'vertical' ? (i * (200 + gapX)) + 100 : nodeWidth + gapX"
          :y2="orientation === 'vertical' ? nodeHeight + gapY : (i * (nodeHeight + gapY)) + nodeHeight / 2"
          stroke="#d1d5db"
          stroke-width="2"
        />
      </svg>
      
      <div
        v-for="(child, i) in node.children"
        :key="child.id"
        :style="{
          position: 'absolute',
          left: orientation === 'vertical' ? `${i * (200 + gapX)}px` : `${nodeWidth + gapX}px`,
          top: orientation === 'vertical' ? `${nodeHeight + gapY}px` : `${i * (nodeHeight + gapY)}px`
        }"
      >
        <OrgChartNode
          :node="child"
          :orientation="orientation"
          :node-width="200"
          :node-height="nodeHeight"
          :gap-x="gapX"
          :gap-y="gapY"
          @node-click="emit('nodeClick', $event)"
        />
      </div>
    </template>
  </div>
</template>
