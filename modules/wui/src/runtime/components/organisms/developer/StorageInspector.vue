<script setup lang="ts">
interface StorageItem {
  key: string
  value: string
  size: number
  type: 'local' | 'session' | 'cookie'
}

const props = defineProps<{
  showCookies?: boolean
}>()

const isVisible = ref(false)
const activeTab = ref<'local' | 'session' | 'cookie'>('local')
const searchQuery = ref('')
const newItem = ref({ key: '', value: '' })

const items = computed<StorageItem[]>(() => {
  const result: StorageItem[] = []
  
  if (activeTab.value === 'local') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key) || ''
        result.push({ key, value, size: new Blob([value]).size, type: 'local' })
      }
    }
  } else if (activeTab.value === 'session') {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key) {
        const value = sessionStorage.getItem(key) || ''
        result.push({ key, value, size: new Blob([value]).size, type: 'session' })
      }
    }
  } else if (props.showCookies && activeTab.value === 'cookie') {
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=')
      if (key) {
        result.push({ key, value: decodeURIComponent(value || ''), size: cookie.length, type: 'cookie' })
      }
    })
  }
  
  return result.filter(item => 
    item.key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.value.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalSize = computed(() => items.value.reduce((a, b) => a + b.size, 0))

const addItem = () => {
  if (!newItem.value.key) return
  
  if (activeTab.value === 'local') {
    localStorage.setItem(newItem.value.key, newItem.value.value)
  } else if (activeTab.value === 'session') {
    sessionStorage.setItem(newItem.value.key, newItem.value.value)
  }
  
  newItem.value = { key: '', value: '' }
}

const removeItem = (key: string) => {
  if (activeTab.value === 'local') {
    localStorage.removeItem(key)
  } else if (activeTab.value === 'session') {
    sessionStorage.removeItem(key)
  }
}

const clearAll = () => {
  if (activeTab.value === 'local') {
    localStorage.clear()
  } else if (activeTab.value === 'session') {
    sessionStorage.clear()
  }
}

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 's' && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      isVisible.value = !isVisible.value
    }
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-4 z-[9999] rounded-lg border border-gray-200 bg-white shadow-2xl md:inset-10"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 class="font-semibold">Storage Inspector</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="isVisible = false">
          <span class="i-lucide-x size-5" />
        </button>
      </div>
      
      <div class="flex gap-2 border-b border-gray-200 px-4 py-2">
        <button
          v-for="tab in ['local', 'session', 'cookie']"
          :key="tab"
          class="rounded-lg px-4 py-2 text-sm font-medium capitalize"
          :class="activeTab === tab ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'"
          @click="activeTab = tab as any"
        >
          {{ tab }} Storage
        </button>
      </div>
      
      <div class="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
        <input
          v-model="searchQuery"
          placeholder="Search..."
          class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <span class="text-sm text-gray-500">{{ items.length }} items • {{ (totalSize / 1024).toFixed(2) }} KB</span>
        <button class="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200" @click="clearAll">
          Clear All
        </button>
      </div>
      
      <div class="flex-1 overflow-auto p-4">
        <table class="w-full text-sm">
          <thead class="sticky top-0 bg-white">
            <tr class="border-b border-gray-200">
              <th class="px-2 py-2 text-left font-medium">Key</th>
              <th class="px-2 py-2 text-left font-medium">Value</th>
              <th class="px-2 py-2 text-right font-medium">Size</th>
              <th class="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.key" class="border-b border-gray-100">
              <td class="px-2 py-2 font-mono text-xs">{{ item.key }}</td>
              <td class="px-2 py-2 max-w-xs truncate" :title="item.value">{{ item.value }}</td>
              <td class="px-2 py-2 text-right text-xs text-gray-500">{{ item.size }} B</td>
              <td class="px-2 py-2 text-right">
                <button class="text-red-500 hover:text-red-700" @click="removeItem(item.key)">
                  <span class="i-lucide-trash-2 size-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="mt-4 flex gap-2">
          <input v-model="newItem.key" placeholder="New key..." class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <input v-model="newItem.value" placeholder="Value..." class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700" @click="addItem">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
