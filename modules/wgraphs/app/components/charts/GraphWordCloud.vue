<script setup lang="ts">
interface WordData {
  text: string
  value: number
  color?: string
}

interface Props {
  data: WordData[]
  width?: number
  height?: number
  maxFontSize?: number
  minFontSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 600,
  height: 400,
  maxFontSize: 48,
  minFontSize: 12
})

const sortedData = computed(() => [...props.data].sort((a, b) => b.value - a.value))
const maxValue = computed(() => Math.max(...sortedData.value.map(d => d.value)))
const minValue = computed(() => Math.min(...sortedData.value.map(d => d.value)))

const getFontSize = (value: number): number => {
  const ratio = (value - minValue.value) / (maxValue.value - minValue.value || 1)
  return props.minFontSize + ratio * (props.maxFontSize - props.minFontSize)
}

const positionedWords = computed(() => {
  let x = 20
  let y = 50
  const rowHeight = 60
  return sortedData.value.map((word) => {
    const fontSize = getFontSize(word.value)
    const wordWidth = word.text.length * fontSize * 0.6
    if (x + wordWidth > props.width - 20) {
      x = 20
      y += rowHeight
    }
    const pos = { x, y, fontSize, word }
    x += wordWidth + 20
    return pos
  })
})
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-wordcloud">
    <text
      v-for="(pos, index) in positionedWords"
      :key="pos.word.text"
      :x="pos.x"
      :y="pos.y"
      :font-size="pos.fontSize"
      :fill="pos.word.color || `hsl(${index * 360 / positionedWords.length}, 70%, 50%)`"
      class="font-bold"
      style="font-family: sans-serif;"
    >{{ pos.word.text }}</text>
  </svg>
</template>
