<script setup lang="ts">
interface DataPoint {
  id: string
  label: string
  value: number
  children?: DataPoint[]
  color?: string
}

interface Props {
  data: DataPoint
  width?: number
  height?: number
  maxDepth?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 600,
  maxDepth: 3
})

const currentLevel = ref(0)
const currentNode = ref<DataPoint>(props.data)
const breadcrumbs = ref<DataPoint[]>([props.data])

const drillDown = (node: DataPoint) => {
  if (node.children && node.children.length > 0 && currentLevel.value < props.maxDepth) {
    currentLevel.value++
    currentNode.value = node
    breadcrumbs.value.push(node)
  }
}

const drillUp = () => {
  if (currentLevel.value > 0) {
    currentLevel.value--
    breadcrumbs.value.pop()
    currentNode.value = breadcrumbs.value[breadcrumbs.value.length - 1]
  }
}

const visibleData = computed(() => currentNode.value.children || [currentNode.value])
const maxValue = computed(() => Math.max(...visibleData.value.map(d => d.value)))

const barWidth = computed(() => (props.width - 80) / visibleData.value.length * 0.7)
const spacing = computed(() => (props.width - 80) / visibleData.value.length)

const getBarHeight = (value: number): number => (value / maxValue.value) * (props.height - 150)
const getBarX = (index: number): number => 40 + index * spacing.value + (spacing.value - barWidth.value) / 2
const getBarY = (value: number): number => props.height - 100 - getBarHeight(value)
</script>

<template>
  <div class="w-graph-drilldown relative">
    <div class="flex items-center gap-2 mb-4">
      <button
        v-if="currentLevel > 0"
        class="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        @click="drillUp"
      >← ย้อนกลับ</button>
      <div class="flex items-center gap-1 text-sm text-gray-600">
        <span v-for="(crumb, index) in breadcrumbs" :key="crumb.id">
          {{ crumb.label }} <span v-if="index < breadcrumbs.length - 1">/</span>
        </span>
      </div>
    </div>
    <svg :width="width" :height="height">
      <line x1="40" :y1="height - 100" :x2="width - 40" :y2="height - 100" stroke="#e5e7eb" stroke-width="2" />
      <line x1="40" y1="50" x2="40" :y2="height - 100" stroke="#e5e7eb" stroke-width="2" />
      
      <g
        v-for="(item, index) in visibleData"
        :key="item.id"
        class="cursor-pointer"
        @click="drillDown(item)"
      >
        <rect
          :x="getBarX(index)"
          :y="getBarY(item.value)"
          :width="barWidth"
          :height="getBarHeight(item.value)"
          :fill="item.color || `hsl(${index * 360 / visibleData.length}, 70%, 60%)`"
          rx="4"
          opacity="0.8"
        />
        <text
          :x="getBarX(index) + barWidth / 2"
          :y="height - 80"
          text-anchor="middle"
          class="text-xs fill-gray-600"
        >{{ item.label }}</text>
        <text
          :x="getBarX(index) + barWidth / 2"
          :y="getBarY(item.value) - 8"
          text-anchor="middle"
          class="text-xs fill-gray-700 font-medium"
        >{{ item.value }}</text>
      </g>
    </svg>
  </div>
</template>
