<script setup lang="ts">
interface DataPoint {
  label: string
  value: number
  children?: DataPoint[]
  color?: string
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600
})

const flattenHierarchy = (nodes: DataPoint[], x: number = 0, y: number = 0, w: number = props.width, h: number = props.height, level: number = 0): Array<{ node: DataPoint, x: number, y: number, w: number, h: number, level: number }> => {
  const total = nodes.reduce((sum, n) => sum + n.value, 0)
  let currentX = x
  let currentY = y
  const result: Array<{ node: DataPoint, x: number, y: number, w: number, h: number, level: number }> = []
  
  nodes.forEach(node => {
    const ratio = node.value / total
    if (level % 2 === 0) {
      const nodeW = w * ratio
      result.push({ node, x: currentX, y, w: nodeW, h, level })
      if (node.children) {
        result.push(...flattenHierarchy(node.children, currentX, y, nodeW, h, level + 1))
      }
      currentX += nodeW
    } else {
      const nodeH = h * ratio
      result.push({ node, x, y: currentY, w, h: nodeH, level })
      if (node.children) {
        result.push(...flattenHierarchy(node.children, x, currentY, w, nodeH, level + 1))
      }
      currentY += nodeH
    }
  })
  return result
}

const rectangles = computed(() => {
  const flattened = flattenHierarchy(props.data)
  const maxLevel = Math.max(...flattened.map(r => r.level))
  return flattened.filter(r => r.level === maxLevel || !r.node.children)
})

const getTextSize = (w: number, h: number): string => {
  const min = Math.min(w, h)
  return min > 60 ? 'text-xs' : min > 40 ? 'text-[10px]' : 'text-[8px]'
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-treemap">
    <g v-for="(rect, index) in rectangles" :key="index">
      <rect
        :x="rect.x"
        :y="rect.y"
        :width="rect.w"
        :height="rect.h"
        :fill="rect.node.color || `hsl(${index * 360 / rectangles.length}, 70%, 60%)`"
        stroke="white"
        stroke-width="2"
      />
      <text
        v-if="rect.w > 40 && rect.h > 30"
        :x="rect.x + rect.w / 2"
        :y="rect.y + rect.h / 2"
        text-anchor="middle"
        dominant-baseline="middle"
        :class="getTextSize(rect.w, rect.h)"
        class="fill-white font-medium"
      >{{ rect.node.label }}</text>
    </g>
  </svg>
</template>
