<script setup lang="ts">
interface DataPoint {
  x: number
  y: number
  z: number
}

interface Props {
  data: DataPoint[]
  width?: number
  height?: number
  rotationX?: number
  rotationY?: number
  gridSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  rotationX: 30,
  rotationY: 45,
  gridSize: 10
})

const maxX = computed(() => Math.max(...props.data.map(d => d.x)))
const minX = computed(() => Math.min(...props.data.map(d => d.x)))
const maxY = computed(() => Math.max(...props.data.map(d => d.y)))
const minY = computed(() => Math.min(...props.data.map(d => d.y)))
const maxZ = computed(() => Math.max(...props.data.map(d => d.z)))
const minZ = computed(() => Math.min(...props.data.map(d => d.z)))

const project3D = (x: number, y: number, z: number): { x: number, y: number } => {
  const rx = (props.rotationX * Math.PI) / 180
  const ry = (props.rotationY * Math.PI) / 180
  
  const x1 = x * Math.cos(ry) - z * Math.sin(ry)
  const z1 = x * Math.sin(ry) + z * Math.cos(ry)
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx)
  
  return {
    x: props.width / 2 + x1,
    y: props.height / 2 - y2
  }
}

const gridPoints = computed(() => {
  const points: Array<{ x: number; y: number; z: number }> = []
  const stepX = (maxX.value - minX.value) / props.gridSize
  const stepY = (maxY.value - minY.value) / props.gridSize
  
  for (let i = 0; i <= props.gridSize; i++) {
    for (let j = 0; j <= props.gridSize; j++) {
      const x = minX.value + i * stepX
      const y = minY.value + j * stepY
      const distances = props.data.map(p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)))
      const weights = distances.map(d => 1 / (d + 0.1))
      const totalWeight = weights.reduce((a, b) => a + b, 0)
      const z = weights.reduce((sum, w, idx) => sum + w * props.data[idx].z, 0) / totalWeight
      points.push({ x, y, z })
    }
  }
  return points
})

const surfacePolygons = computed(() => {
  const polygons: Array<{ points: string; color: string; z: number }> = []
  const points = gridPoints.value
  
  for (let i = 0; i < props.gridSize; i++) {
    for (let j = 0; j < props.gridSize; j++) {
      const idx = i * (props.gridSize + 1) + j
      const p1 = points[idx]
      const p2 = points[idx + 1]
      const p3 = points[idx + props.gridSize + 2]
      const p4 = points[idx + props.gridSize + 1]
      
      const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4
      const projected1 = project3D(p1.x, p1.y, p1.z)
      const projected2 = project3D(p2.x, p2.y, p2.z)
      const projected3 = project3D(p3.x, p3.y, p3.z)
      const projected4 = project3D(p4.x, p4.y, p4.z)
      
      const path = `${projected1.x},${projected1.y} ${projected2.x},${projected2.y} ${projected3.x},${projected3.y} ${projected4.x},${projected4.y}`
      
      const ratio = (avgZ - minZ.value) / (maxZ.value - minZ.value || 1)
      const hue = 200 + ratio * 60
      
      polygons.push({ points: path, color: `hsl(${hue}, 70%, ${50 + ratio * 20}%)`, z: avgZ })
    }
  }
  
  return polygons.sort((a, b) => b.z - a.z)
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-surface">
    <polygon
      v-for="(poly, index) in surfacePolygons"
      :key="index"
      :points="poly.points"
      :fill="poly.color"
      stroke="white"
      stroke-width="0.5"
      opacity="0.9"
    />
  </svg>
</template>
