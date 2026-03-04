<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  target: Date | string | number
  format?: 'dhms' | 'hms' | 'ms'
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'dhms',
  autoStart: true
})

const emit = defineEmits<{
  finish: []
}>()

const remaining = ref(0)
let interval: ReturnType<typeof setInterval>

const calculateRemaining = () => {
  const target = new Date(props.target).getTime()
  const now = Date.now()
  remaining.value = Math.max(0, target - now)
  
  if (remaining.value === 0) {
    emit('finish')
    clearInterval(interval)
  }
}

const days = computed(() => Math.floor(remaining.value / (1000 * 60 * 60 * 24)))
const hours = computed(() => Math.floor((remaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
const minutes = computed(() => Math.floor((remaining.value % (1000 * 60 * 60)) / (1000 * 60)))
const seconds = computed(() => Math.floor((remaining.value % (1000 * 60)) / 1000))

const formatNumber = (n: number) => n.toString().padStart(2, '0')

const display = computed(() => {
  switch (props.format) {
    case 'hms':
      return `${formatNumber(hours.value + days.value * 24)}:${formatNumber(minutes.value)}:${formatNumber(seconds.value)}`
    case 'ms':
      return `${formatNumber(minutes.value + hours.value * 60 + days.value * 24 * 60)}:${formatNumber(seconds.value)}`
    default:
      return remaining.value > 0
        ? `${days.value > 0 ? days.value + 'd ' : ''}${formatNumber(hours.value)}:${formatNumber(minutes.value)}:${formatNumber(seconds.value)}`
        : '00:00:00'
  }
})

onMounted(() => {
  calculateRemaining()
  if (props.autoStart) {
    interval = setInterval(calculateRemaining, 1000)
  }
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <time class="font-mono text-xl font-semibold">
    {{ display }}
  </time>
</template>
