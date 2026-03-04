<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  initialSeconds?: number
  autoStart?: boolean
  format?: 'hms' | 'ms'
}

const props = withDefaults(defineProps<Props>(), {
  initialSeconds: 0,
  autoStart: false,
  format: 'hms'
})

const emit = defineEmits<{
  tick: [seconds: number]
  finish: []
}>()

const seconds = ref(props.initialSeconds)
const isRunning = ref(false)
let interval: ReturnType<typeof setInterval>

const start = () => {
  if (isRunning.value) return
  isRunning.value = true
  interval = setInterval(() => {
    seconds.value++
    emit('tick', seconds.value)
  }, 1000)
}

const stop = () => {
  isRunning.value = false
  clearInterval(interval)
}

const reset = () => {
  stop()
  seconds.value = 0
}

onMounted(() => {
  if (props.autoStart) start()
})

onUnmounted(() => {
  clearInterval(interval)
})

defineExpose({ start, stop, reset })

const hours = Math.floor(seconds.value / 3600)
const mins = Math.floor((seconds.value % 3600) / 60)
const secs = seconds.value % 60

const display = computed(() => {
  if (props.format === 'ms') {
    return `${String(mins + hours * 60).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})
</script>

<template>
  <div class="flex items-center gap-2">
    <time class="font-mono text-xl">{{ display }}</time>
    <slot :start="start" :stop="stop" :reset="reset" :is-running="isRunning">
      <Button size="sm" @click="isRunning ? stop() : start()">
        {{ isRunning ? 'Stop' : 'Start' }}
      </Button>
      <Button size="sm" variant="outline" @click="reset">
        Reset
      </Button>
    </slot>
  </div>
</template>
