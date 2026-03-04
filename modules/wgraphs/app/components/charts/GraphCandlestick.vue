<script setup lang="ts">
interface CandlestickData {
  date: string
  open: number
  high: number
  low: number
  close: number
}

interface Props {
  data: CandlestickData[]
  width?: number
  height?: number
  bullishColor?: string
  bearishColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 800,
  height: 400,
  bullishColor: '#22c55e',
  bearishColor: '#ef4444'
})

const maxPrice = computed(() => Math.max(...props.data.map(d => d.high)))
const minPrice = computed(() => Math.min(...props.data.map(d => d.low)))

const candleWidth = computed(() => (props.width - 80) / props.data.length * 0.7)
const spacing = computed(() => (props.width - 80) / props.data.length)

const getY = (price: number): number => props.height - 60 - ((price - minPrice.value) / (maxPrice.value - minPrice.value)) * (props.height - 100)
const getX = (index: number): number => 40 + index * spacing.value + (spacing.value - candleWidth.value) / 2
const isBullish = (d: CandlestickData): boolean => d.close > d.open
</script>

<template>
  <svg :width="width" :height="height" class="w-graph-candlestick">
    <line x1="40" :y1="height - 60" :x2="width - 40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    <line x1="40" y1="20" x2="40" :y2="height - 60" stroke="#e5e7eb" stroke-width="2" />
    
    <g v-for="(candle, index) in data" :key="candle.date">
      <line
        :x1="getX(index) + candleWidth / 2"
        :y1="getY(candle.low)"
        :x2="getX(index) + candleWidth / 2"
        :y2="getY(candle.high)"
        :stroke="isBullish(candle) ? bullishColor : bearishColor"
        stroke-width="2"
      />
      <rect
        :x="getX(index)"
        :y="getY(Math.max(candle.open, candle.close))"
        :width="candleWidth"
        :height="Math.abs(getY(candle.close) - getY(candle.open)) || 1"
        :fill="isBullish(candle) ? bullishColor : bearishColor"
        rx="2"
      />
    </g>
  </svg>
</template>
