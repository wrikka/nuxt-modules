<script setup lang="ts">
interface NetworkRequest {
  id: string
  method: string
  url: string
  status: number
  duration: number
  timestamp: Date
  requestHeaders: Record<string, string>
  responseHeaders: Record<string, string>
  requestBody?: string
  responseBody?: string
}

const props = defineProps<{
  maxRequests?: number
}>()

const isVisible = ref(false)
const requests = ref<NetworkRequest[]>([])
const selectedRequest = ref<NetworkRequest | null>(null)
const filter = ref<'all' | 'xhr' | 'fetch' | 'ws'>('all')

const originalFetch = ref<typeof fetch | null>(null)

const interceptFetch = () => {
  if (typeof window === 'undefined') return
  
  originalFetch.value = window.fetch
  window.fetch = async (...args) => {
    const start = performance.now()
    const [url, options] = args
    
    try {
      const response = await originalFetch.value!(...args)
      const duration = performance.now() - start
      
      const request: NetworkRequest = {
        id: Math.random().toString(36).substr(2, 9),
        method: options?.method || 'GET',
        url: url.toString(),
        status: response.status,
        duration,
        timestamp: new Date(),
        requestHeaders: options?.headers as Record<string, string> || {},
        responseHeaders: Object.fromEntries(response.headers.entries()),
        requestBody: options?.body?.toString()
      }
      
      requests.value.unshift(request)
      if (props.maxRequests && requests.value.length > props.maxRequests) {
        requests.value = requests.value.slice(0, props.maxRequests)
      }
      
      return response
    } catch (error) {
      const duration = performance.now() - start
      
      const request: NetworkRequest = {
        id: Math.random().toString(36).substr(2, 9),
        method: options?.method || 'GET',
        url: url.toString(),
        status: 0,
        duration,
        timestamp: new Date(),
        requestHeaders: options?.headers as Record<string, string> || {},
        responseHeaders: {},
        requestBody: options?.body?.toString()
      }
      
      requests.value.unshift(request)
      throw error
    }
  }
}

const filteredRequests = computed(() => {
  if (filter.value === 'all') return requests.value
  return requests.value.filter(r => {
    if (filter.value === 'xhr') return r.url.includes('api')
    if (filter.value === 'fetch') return true
    return true
  })
})

const statusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-600'
  if (status >= 300 && status < 400) return 'text-yellow-600'
  if (status >= 400) return 'text-red-600'
  return 'text-gray-600'
}

const clear = () => {
  requests.value = []
  selectedRequest.value = null
}

onMounted(() => {
  interceptFetch()
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      isVisible.value = !isVisible.value
    }
  })
})

onUnmounted(() => {
  if (originalFetch.value && typeof window !== 'undefined') {
    window.fetch = originalFetch.value
  }
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-4 z-[9999] rounded-lg border border-gray-200 bg-white shadow-2xl md:inset-10"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div class="flex items-center gap-4">
          <h3 class="font-semibold">Network</h3>
          <div class="flex gap-1">
            <button
              v-for="f in ['all', 'xhr', 'fetch', 'ws']"
              :key="f"
              class="rounded px-3 py-1 text-xs font-medium capitalize"
              :class="filter === f ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'"
              @click="filter = f as any"
            >
              {{ f }}
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">{{ requests.length }} requests</span>
          <button class="rounded p-1 text-gray-400 hover:bg-gray-100" @click="clear">
            <span class="i-lucide-trash-2 size-4" />
          </button>
          <button class="text-gray-400 hover:text-gray-600" @click="isVisible = false">
            <span class="i-lucide-x size-5" />
          </button>
        </div>
      </div>
      
      <div class="flex flex-1 overflow-hidden">
        <div class="w-1/2 overflow-auto border-r border-gray-200">
          <table class="w-full text-xs">
            <thead class="sticky top-0 bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left font-medium">Method</th>
                <th class="px-3 py-2 text-left font-medium">Status</th>
                <th class="px-3 py-2 text-left font-medium">URL</th>
                <th class="px-3 py-2 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="req in filteredRequests"
                :key="req.id"
                class="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                :class="selectedRequest?.id === req.id ? 'bg-blue-50' : ''"
                @click="selectedRequest = req"
              >
                <td class="px-3 py-2 font-mono">{{ req.method }}</td>
                <td class="px-3 py-2 font-mono" :class="statusColor(req.status)">{{ req.status || 'ERR' }}</td>
                <td class="px-3 py-2 max-w-xs truncate">{{ req.url }}</td>
                <td class="px-3 py-2 text-right">{{ req.duration.toFixed(0) }}ms</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="selectedRequest" class="w-1/2 overflow-auto p-4">
          <h4 class="mb-2 font-semibold">Request Details</h4>
          <div class="space-y-4 text-xs">
            <div>
              <p class="font-medium text-gray-500">General</p>
              <p><span class="text-gray-400">URL:</span> {{ selectedRequest.url }}</p>
              <p><span class="text-gray-400">Method:</span> {{ selectedRequest.method }}</p>
              <p><span class="text-gray-400">Status:</span> {{ selectedRequest.status }}</p>
              <p><span class="text-gray-400">Duration:</span> {{ selectedRequest.duration.toFixed(2) }}ms</p>
            </div>
            <div>
              <p class="font-medium text-gray-500">Request Headers</p>
              <pre class="rounded bg-gray-50 p-2">{{ JSON.stringify(selectedRequest.requestHeaders, null, 2) }}</pre>
            </div>
            <div>
              <p class="font-medium text-gray-500">Response Headers</p>
              <pre class="rounded bg-gray-50 p-2">{{ JSON.stringify(selectedRequest.responseHeaders, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
