<script setup lang="ts">
interface LogEntry {
  id: string
  type: 'log' | 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: Date
  data?: any
}

const props = defineProps<{
  maxLogs?: number
}>()

const logs = ref<LogEntry[]>([])
const filter = ref<'all' | 'log' | 'info' | 'warn' | 'error' | 'debug'>('all')
const isExpanded = ref(false)
const searchQuery = ref('')

const addLog = (type: LogEntry['type'], message: string, data?: any) => {
  const entry: LogEntry = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    message,
    timestamp: new Date(),
    data
  }
  logs.value.unshift(entry)
  if (props.maxLogs && logs.value.length > props.maxLogs) {
    logs.value = logs.value.slice(0, props.maxLogs)
  }
}

const clear = () => logs.value = []

const filteredLogs = computed(() => {
  let result = logs.value
  if (filter.value !== 'all') {
    result = result.filter(l => l.type === filter.value)
  }
  if (searchQuery.value) {
    result = result.filter(l => 
      l.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  return result
})

const typeColors = {
  log: 'text-gray-600',
  info: 'text-blue-600',
  warn: 'text-yellow-600',
  error: 'text-red-600',
  debug: 'text-purple-600'
}

const typeIcons = {
  log: 'i-lucide-terminal',
  info: 'i-lucide-info',
  warn: 'i-lucide-alert-triangle',
  error: 'i-lucide-x-circle',
  debug: 'i-lucide-bug'
}

defineExpose({ log: (m: string, d?: any) => addLog('log', m, d), info: (m: string, d?: any) => addLog('info', m, d), warn: (m: string, d?: any) => addLog('warn', m, d), error: (m: string, d?: any) => addLog('error', m, d), debug: (m: string, d?: any) => addLog('debug', m, d), clear, logs })
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
      <div class="flex items-center gap-2">
        <span class="i-lucide-terminal size-4" />
        <span class="font-medium">Console</span>
        <span class="text-xs text-gray-500">({{ logs.length }})</span>
      </div>
      <div class="flex items-center gap-1">
        <select v-model="filter" class="rounded border border-gray-200 px-2 py-1 text-sm">
          <option value="all">All</option>
          <option value="log">Log</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
          <option value="debug">Debug</option>
        </select>
        <input v-model="searchQuery" placeholder="Search..." class="rounded border border-gray-200 px-2 py-1 text-sm" />
        <button class="rounded p-1 hover:bg-gray-200" @click="clear">
          <span class="i-lucide-trash-2 size-4" />
        </button>
        <button class="rounded p-1 hover:bg-gray-200" @click="isExpanded = !isExpanded">
          <span :class="isExpanded ? 'i-lucide-minimize' : 'i-lucide-maximize'" class="size-4" />
        </button>
      </div>
    </div>
    
    <div :class="isExpanded ? 'h-96' : 'h-48'" class="overflow-auto">
      <div v-for="log in filteredLogs" :key="log.id" class="flex gap-2 border-b border-gray-100 px-4 py-2 text-sm font-mono hover:bg-gray-50">
        <span :class="[typeIcons[log.type], typeColors[log.type]]" class="mt-0.5 size-4" />
        <span class="text-gray-400">{{ log.timestamp.toLocaleTimeString() }}</span>
        <span :class="typeColors[log.type]" class="font-medium">{{ log.type.toUpperCase() }}</span>
        <span class="flex-1">{{ log.message }}</span>
        <pre v-if="log.data" class="w-full overflow-x-auto rounded bg-gray-100 p-2 text-xs">{{ JSON.stringify(log.data, null, 2) }}</pre>
      </div>
      <div v-if="filteredLogs.length === 0" class="p-4 text-center text-gray-500 text-sm">
        No logs to display
      </div>
    </div>
  </div>
</template>
