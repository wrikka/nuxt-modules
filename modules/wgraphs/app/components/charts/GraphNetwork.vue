<script setup lang="ts">
interface Node {
  id: string
  label: string
  x?: number
  y?: number
  color?: string
  size?: number
}

interface Edge {
  source: string
  target: string
  weight?: number
}

interface Props {
  nodes: Node[]
  edges: Edge[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600
})

const positionedNodes = computed(() => {
  const radius = Math.min(props.width, props.height) / 2 - 100
  const centerX = props.width / 2
  const centerY = props.height / 2
  return props.nodes.map((node, index) => ({
    ...node,
    x: centerX + radius * Math.cos((2 * Math.PI * index) / props.nodes.length),
    y: centerY + radius * Math.sin((2 * Math.PI * index) / props.nodes.length)
  }))
})

const nodeMap = computed(() => new Map(positionedNodes.value.map(n => [n.id, n])))

const getEdgePath = (edge: Edge): string => {
  const source = nodeMap.value.get(edge.source)
  const target = nodeMap.value.get(edge.target)
  if (!source || !target) return ''
  return `M ${source.x} ${source.y} L ${target.x} ${target.y}`
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-network">
    <g v-for="(edge, index) in edges" :key="`edge-${index}`">
      <path
        :d="getEdgePath(edge)"
        stroke="#9ca3af"
        :stroke-width="edge.weight || 2"
        opacity="0.5"
      />
    </g>
    <g v-for="(node, index) in positionedNodes" :key="`node-${node.id}`">
      <circle
        :cx="node.x"
        :cy="node.y"
        :r="node.size || 30"
        :fill="node.color || '#3b82f6'"
        stroke="white"
        stroke-width="3"
      />
      <text
        :x="node.x"
        :y="node.y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-xs fill-white font-medium"
      >{{ node.label }}</text>
    </g>
  </svg>
</template>
