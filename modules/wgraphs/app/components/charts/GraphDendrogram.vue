<script setup lang="ts">
interface ClusterNode {
  id: string
  label: string
  distance: number
  children?: ClusterNode[]
}

interface Props {
  data: ClusterNode
  width?: number
  height?: number
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  orientation: 'horizontal'
})

const maxDistance = computed(() => {
  const findMax = (node: ClusterNode): number => {
    let max = node.distance
    if (node.children) {
      node.children.forEach(child => {
        max = Math.max(max, findMax(child))
      })
    }
    return max
  }
  return findMax(props.data)
})

const flattenDendrogram = (node: ClusterNode, x: number = 0, parentY?: number, level: number = 0): Array<{ node: ClusterNode, x: number, y: number, parentY?: number }> => {
  const isHorizontal = props.orientation === 'horizontal'
  const nodeX = isHorizontal ? (node.distance / maxDistance.value) * (props.width - 100) + 50 : x
  const nodeY = isHorizontal ? x : (node.distance / maxDistance.value) * (props.height - 100) + 50
  
  const result: Array<{ node: ClusterNode, x: number, y: number, parentY?: number }> = [{
    node,
    x: nodeX,
    y: nodeY,
    parentY: parentY !== undefined ? parentY : undefined
  }]
  
  if (node.children) {
    const childSpacing = isHorizontal ? props.height / (node.children.length + 1) : props.width / (node.children.length + 1)
    node.children.forEach((child, index) => {
      const childX = isHorizontal ? childSpacing * (index + 1) : nodeX
      const childY = isHorizontal ? nodeY : childSpacing * (index + 1)
      result.push(...flattenDendrogram(child, isHorizontal ? childX : x + 150, isHorizontal ? nodeY : childY, level + 1))
    })
  }
  
  return result
}

const nodes = computed(() => flattenDendrogram(props.data, props.orientation === 'horizontal' ? 50 : 50))
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-dendrogram">
    <g v-for="(item, index) in nodes" :key="index">
      <line
        v-if="item.parentY !== undefined"
        :x1="orientation === 'horizontal' ? item.x : item.parentY"
        :y1="orientation === 'horizontal' ? item.parentY : item.y"
        :x2="item.x"
        :y2="item.y"
        stroke="#9ca3af"
        stroke-width="2"
      />
      <circle
        :cx="item.x"
        :cy="item.y"
        r="6"
        fill="#3b82f6"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="item.x + (orientation === 'horizontal' ? 15 : 0)"
        :y="item.y + (orientation === 'horizontal' ? 0 : 20)"
        :text-anchor="orientation === 'horizontal' ? 'start' : 'middle'"
        class="text-xs fill-gray-700"
      >{{ item.node.label }}</text>
    </g>
  </svg>
</template>
