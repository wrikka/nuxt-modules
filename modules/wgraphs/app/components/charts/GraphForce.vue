<script setup lang="ts">
interface Node {
  id: string
  label: string
  x?: number
  y?: number
  color?: string
  size?: number
}

interface Props {
  nodes: Node[]
  edges: Array<{ source: string; target: string }>
  width?: number
  height?: number
  iterations?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  iterations: 100
})

const positionedNodes = computed(() => {
  const result = props.nodes.map(node => ({
    ...node,
    x: node.x ?? Math.random() * (props.width - 100) + 50,
    y: node.y ?? Math.random() * (props.height - 100) + 50
  }))
  
  for (let i = 0; i < props.iterations; i++) {
    result.forEach(node => {
      let fx = 0
      let fy = 0
      
      result.forEach(other => {
        if (node.id !== other.id) {
          const dx = node.x! - other.x!
          const dy = node.y! - other.y!
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = 5000 / (dist * dist)
          fx += (dx / dist) * force
          fy += (dy / dist) * force
        }
      })
      
      props.edges.forEach(edge => {
        if (edge.source === node.id || edge.target === node.id) {
          const otherId = edge.source === node.id ? edge.target : edge.source
          const other = result.find(n => n.id === otherId)
          if (other) {
            const dx = other.x! - node.x!
            const dy = other.y! - node.y!
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            const force = dist * 0.01
            fx += (dx / dist) * force
            fy += (dy / dist) * force
          }
        }
      })
      
      const centerFx = (props.width / 2 - node.x!) * 0.001
      const centerFy = (props.height / 2 - node.y!) * 0.001
      
      node.x = Math.max(30, Math.min(props.width - 30, node.x! + fx + centerFx))
      node.y = Math.max(30, Math.min(props.height - 30, node.y! + fy + centerFy))
    })
  }
  
  return result
})

const nodeMap = computed(() => new Map(positionedNodes.value.map(n => [n.id, n])))
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-force">
    <g v-for="(edge, index) in edges" :key="`edge-${index}`">
      <line
        :x1="nodeMap.get(edge.source)?.x"
        :y1="nodeMap.get(edge.source)?.y"
        :x2="nodeMap.get(edge.target)?.x"
        :y2="nodeMap.get(edge.target)?.y"
        stroke="#9ca3af"
        stroke-width="2"
        opacity="0.5"
      />
    </g>
    <g v-for="node in positionedNodes" :key="`node-${node.id}`">
      <circle
        :cx="node.x"
        :cy="node.y"
        :r="node.size || 25"
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
