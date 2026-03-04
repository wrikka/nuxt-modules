<script setup lang="ts">
interface FlowNode {
  id: string
  label: string
  value: number
  color?: string
}

interface FlowLink {
  source: string
  target: string
  value: number
}

interface Props {
  nodes: FlowNode[]
  links: FlowLink[]
  width?: number
  height?: number
  nodeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  nodeWidth: 20
})

const levels = computed(() => {
  const nodeLevels = new Map<string, number>()
  const levelNodes = new Map<number, FlowNode[]>()
  
  props.nodes.forEach(node => {
    const level = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : 2
    nodeLevels.set(node.id, level)
    if (!levelNodes.has(level)) levelNodes.set(level, [])
    levelNodes.get(level)!.push(node)
  })
  
  return { nodeLevels, levelNodes }
})

const positionedNodes = computed(() => {
  const { nodeLevels, levelNodes } = levels.value
  const maxLevel = Math.max(...Array.from(levelNodes.keys()))
  const levelWidth = (props.width - 80) / (maxLevel + 1)
  
  return props.nodes.map(node => {
    const level = nodeLevels.get(node.id) || 0
    const nodesInLevel = levelNodes.get(level) || []
    const index = nodesInLevel.findIndex(n => n.id === node.id)
    const levelHeight = props.height / (nodesInLevel.length + 1)
    
    return {
      ...node,
      x: 40 + level * levelWidth,
      y: levelHeight * (index + 1)
    }
  })
})

const nodeMap = computed(() => new Map(positionedNodes.value.map(n => [n.id, n])))

const sankeyLinks = computed(() => {
  return props.links.map(link => {
    const source = nodeMap.value.get(link.source)
    const target = nodeMap.value.get(link.target)
    if (!source || !target) return null
    
    const path = `M ${source.x + props.nodeWidth} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`
    
    return {
      ...link,
      path,
      strokeWidth: Math.max(1, link.value / 10)
    }
  }).filter(Boolean)
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-sankey">
    <g v-for="(link, index) in sankeyLinks" :key="`link-${index}`">
      <path
        :d="link!.path"
        fill="none"
        stroke="#3b82f6"
        :stroke-width="link!.strokeWidth"
        opacity="0.4"
      />
    </g>
    <g v-for="node in positionedNodes" :key="`node-${node.id}`">
      <rect
        :x="node.x"
        :y="node.y - node.value / 2"
        :width="nodeWidth"
        :height="node.value"
        :fill="node.color || '#1f2937'"
        rx="2"
      />
      <text
        :x="node.x + nodeWidth / 2"
        :y="node.y - node.value / 2 - 8"
        text-anchor="middle"
        class="text-xs fill-gray-700"
      >{{ node.label }}</text>
    </g>
  </svg>
</template>
