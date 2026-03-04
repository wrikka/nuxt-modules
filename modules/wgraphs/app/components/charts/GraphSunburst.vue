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
  innerRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 600,
  innerRadius: 0.2
})

const centerX = computed(() => props.width / 2)
const centerY = computed(() => props.height / 2)
const maxRadius = computed(() => Math.min(props.width, props.height) / 2 - 40)

const polarToCartesian = (cx: number, cy: number, r: number, angle: number): { x: number, y: number } => {
  const angleInRadians = (angle - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(angleInRadians), y: cy + r * Math.sin(angleInRadians) }
}

const flattenSunburst = (nodes: DataPoint[], startAngle: number = 0, endAngle: number = 360, level: number = 0, maxLevel: number = 3): Array<{ node: DataPoint, startAngle: number, endAngle: number, innerR: number, outerR: number, level: number }> => {
  const total = nodes.reduce((sum, n) => sum + n.value, 0)
  let currentAngle = startAngle
  const result: Array<{ node: DataPoint, startAngle: number, endAngle: number, innerR: number, outerR: number, level: number }> = []
  const levelRadius = maxRadius.value / (maxLevel + 1)
  
  nodes.forEach(node => {
    const angle = (node.value / total) * (endAngle - startAngle)
    const innerR = level * levelRadius + props.innerRadius * maxRadius.value
    const outerR = (level + 1) * levelRadius + props.innerRadius * maxRadius.value
    result.push({ node, startAngle: currentAngle, endAngle: currentAngle + angle, innerR, outerR, level })
    if (node.children && level < maxLevel) {
      result.push(...flattenSunburst(node.children, currentAngle, currentAngle + angle, level + 1, maxLevel))
    }
    currentAngle += angle
  })
  return result
}

const arcs = computed(() => flattenSunburst(props.data))

const getArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number): string => {
  const startOuter = polarToCartesian(centerX.value, centerY.value, outerR, endAngle)
  const endOuter = polarToCartesian(centerX.value, centerY.value, outerR, startAngle)
  const startInner = polarToCartesian(centerX.value, centerY.value, innerR, endAngle)
  const endInner = polarToCartesian(centerX.value, centerY.value, innerR, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${startOuter.x} ${startOuter.y} A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y} Z`
}
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-sunburst">
    <g v-for="(arc, index) in arcs" :key="index">
      <path
        :d="getArcPath(arc.startAngle, arc.endAngle, arc.innerR, arc.outerR)"
        :fill="arc.node.color || `hsl(${index * 360 / arcs.length}, 70%, ${60 - arc.level * 10}%)`"
        stroke="white"
        stroke-width="1"
      />
    </g>
  </svg>
</template>
