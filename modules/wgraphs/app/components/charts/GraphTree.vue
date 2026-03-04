<script setup lang="ts">
interface TreeNode {
  label: string
  children?: TreeNode[]
  color?: string
}

interface Props {
  data: TreeNode
  width?: number
  height?: number
  nodeWidth?: number
  nodeHeight?: number
  levelHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  nodeWidth: 100,
  nodeHeight: 40,
  levelHeight: 100
})

const flattenTree = (node: TreeNode, level: number = 0, parentX: number = 0, index: number = 0, totalSiblings: number = 1): Array<{ node: TreeNode, x: number, y: number, level: number, parentX?: number }> => {
  const x = parentX + (index - (totalSiblings - 1) / 2) * (props.nodeWidth + 40)
  const y = 50 + level * props.levelHeight
  const result: Array<{ node: TreeNode, x: number, y: number, level: number, parentX?: number }> = [{ node, x, y, level, parentX: level > 0 ? parentX : undefined }]
  
  if (node.children) {
    node.children.forEach((child, childIndex) => {
      result.push(...flattenTree(child, level + 1, x, childIndex, node.children!.length))
    })
  }
  return result
}

const nodes = computed(() => flattenTree(props.data))
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-tree">
    <g v-for="(item, index) in nodes" :key="index">
      <line
        v-if="item.parentX !== undefined"
        :x1="item.parentX"
        :y1="item.y - props.levelHeight + props.nodeHeight / 2"
        :x2="item.x"
        :y2="item.y - props.nodeHeight / 2"
        stroke="#9ca3af"
        stroke-width="2"
      />
      <rect
        :x="item.x - props.nodeWidth / 2"
        :y="item.y - props.nodeHeight / 2"
        :width="props.nodeWidth"
        :height="props.nodeHeight"
        :fill="item.node.color || '#3b82f6'"
        rx="4"
        stroke="white"
        stroke-width="2"
      />
      <text
        :x="item.x"
        :y="item.y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-xs fill-white font-medium"
      >{{ item.node.label }}</text>
    </g>
  </svg>
</template>
