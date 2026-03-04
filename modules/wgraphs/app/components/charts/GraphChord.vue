<script setup lang="ts">
interface Props {
  matrix: number[][]
  labels: string[]
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 600
})

const radius = computed(() => Math.min(props.width, props.height) / 2 - 60)
const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)

const angleStep = computed(() => 360 / props.labels.length)

const getPoint = (index: number, r: number): { x: number, y: number } => {
  const angle = index * angleStep.value - 90
  const rad = angle * Math.PI / 180
  return {
    x: centerX.value + r * Math.cos(rad),
    y: centerY.value + r * Math.sin(rad)
  }
}

const ribbons = computed(() => {
  const result: Array<{ source: number, target: number, value: number, path: string }> = []
  props.matrix.forEach((row, i) => {
    row.forEach((value, j) => {
      if (value > 0 && i < j) {
        const start = getPoint(i, radius.value)
        const end = getPoint(j, radius.value)
        const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
        const cp1 = { x: centerX.value + (start.x - centerX.value) * 0.3, y: centerY.value + (start.y - centerY.value) * 0.3 }
        const cp2 = { x: centerX.value + (end.x - centerX.value) * 0.3, y: centerY.value + (end.y - centerY.value) * 0.3 }
        const path = `M ${start.x} ${start.y} Q ${cp1.x} ${cp1.y} ${mid.x} ${mid.y} Q ${cp2.x} ${cp2.y} ${end.x} ${end.y}`
        result.push({ source: i, target: j, value, path })
      }
    })
  })
  return result
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-chord">
    <g v-for="(ribbon, index) in ribbons" :key="index">
      <path
        :d="ribbon.path"
        fill="none"
        :stroke="`hsl(${ribbon.source * 360 / labels.length}, 70%, 60%)`"
        :stroke-width="Math.max(2, ribbon.value / 5)"
        opacity="0.6"
      />
    </g>
    <g v-for="(label, index) in labels" :key="`label-${index}`">
      <circle
        :cx="getPoint(index, radius).x"
        :cy="getPoint(index, radius).y"
        r="8"
        :fill="`hsl(${index * 360 / labels.length}, 70%, 60%)`"
      />
      <text
        :x="getPoint(index, radius + 30).x"
        :y="getPoint(index, radius + 30).y"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text-xs fill-gray-700"
      >{{ label }}</text>
    </g>
  </svg>
</template>
