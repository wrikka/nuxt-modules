<script setup lang="ts">
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  rating: 'good' | 'needs-improvement' | 'poor'
}

const props = defineProps<{
  autoRefresh?: boolean
  refreshInterval?: number
}>()

const isVisible = ref(false)
const metrics = ref<PerformanceMetric[]>([])
const lastRefresh = ref<Date>(new Date())

const calculateMetrics = () => {
  const nav = performance as any
  const timing = nav.timing
  
  if (!timing) return
  
  metrics.value = [
    {
      name: 'DNS Lookup',
      value: timing.domainLookupEnd - timing.domainLookupStart,
      unit: 'ms',
      rating: timing.domainLookupEnd - timing.domainLookupStart < 100 ? 'good' : 'needs-improvement'
    },
    {
      name: 'TCP Connection',
      value: timing.connectEnd - timing.connectStart,
      unit: 'ms',
      rating: timing.connectEnd - timing.connectStart < 100 ? 'good' : 'needs-improvement'
    },
    {
      name: 'DOM Ready',
      value: timing.domContentLoadedEventEnd - timing.navigationStart,
      unit: 'ms',
      rating: timing.domContentLoadedEventEnd - timing.navigationStart < 1000 ? 'good' : timing.domContentLoadedEventEnd - timing.navigationStart < 3000 ? 'needs-improvement' : 'poor'
    },
    {
      name: 'Page Load',
      value: timing.loadEventEnd - timing.navigationStart,
      unit: 'ms',
      rating: timing.loadEventEnd - timing.navigationStart < 2000 ? 'good' : timing.loadEventEnd - timing.navigationStart < 5000 ? 'needs-improvement' : 'poor'
    }
  ]
  
  lastRefresh.value = new Date()
}

const ratingClasses = {
  good: 'text-green-600',
  'needs-improvement': 'text-yellow-600',
  poor: 'text-red-600'
}

onMounted(() => {
  calculateMetrics()
  
  if (props.autoRefresh) {
    setInterval(calculateMetrics, props.refreshInterval || 5000)
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      isVisible.value = !isVisible.value
    }
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed right-4 top-4 z-[9999] w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
  >
    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-semibold">Performance</h3>
      <button class="text-gray-400 hover:text-gray-600" @click="isVisible = false">
        <span class="i-lucide-x size-4" />
      </button>
    </div>
    
    <div class="space-y-3">
      <div v-for="metric in metrics" :key="metric.name" class="flex items-center justify-between">
        <span class="text-sm text-gray-600">{{ metric.name }}</span>
        <span :class="ratingClasses[metric.rating]" class="font-mono text-sm font-medium">
          {{ metric.value }}{{ metric.unit }}
        </span>
      </div>
    </div>
    
    <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
      Last updated: {{ lastRefresh.toLocaleTimeString() }}
      <button class="ml-2 text-blue-600 hover:text-blue-700" @click="calculateMetrics">Refresh</button>
    </div>
  </div>
</template>
