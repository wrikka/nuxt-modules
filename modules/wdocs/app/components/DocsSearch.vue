<script setup lang="ts">
import MiniSearch from 'minisearch'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedIndex = ref(0)

let miniSearch: MiniSearch | null = null

const { data: searchIndex } = await useAsyncData('search-index', async () => {
  const content = await queryCollection('content').all()
  return content.map(doc => ({
    id: doc.path,
    title: doc.title || '',
    content: doc.body ? stripHtml(doc.body) : '',
    path: doc.path
  }))
})

onMounted(() => {
  if (searchIndex.value) {
    miniSearch = new MiniSearch({
      fields: ['title', 'content'],
      storeFields: ['title', 'path'],
      searchOptions: {
        boost: { title: 2 },
        fuzzy: 0.2
      }
    })
    miniSearch.addAll(searchIndex.value)
  }
})

watch(searchQuery, (query) => {
  if (!miniSearch || !query) {
    searchResults.value = []
    return
  }
  searchResults.value = miniSearch.search(query).slice(0, 10)
  selectedIndex.value = 0
})

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').slice(0, 200)
}

function selectResult(result: any) {
  navigateTo(result.path)
  close()
}

function close() {
  emit('update:modelValue', false)
  searchQuery.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % searchResults.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + searchResults.value.length) % searchResults.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const result = searchResults.value[selectedIndex.value]
    if (result) selectResult(result)
  } else if (e.key === 'Escape') {
    close()
  }
}

onKeyStroke('k', (e) => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
    e.preventDefault()
    emit('update:modelValue', true)
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100]" @click="close">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div class="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl" @click.stop>
        <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <Icon name="lucide:search" class="w-5 h-5 text-gray-400" />
            <input
              ref="input"
              v-model="searchQuery"
              type="text"
              placeholder="Search documentation..."
              class="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
              @keydown="onKeydown"
            >
            <span class="docs-kbd">ESC</span>
          </div>

          <div v-if="searchResults.length > 0" class="max-h-96 overflow-y-auto">
            <div
              v-for="(result, index) in searchResults"
              :key="result.id"
              class="px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': index === selectedIndex }"
              @click="selectResult(result)"
            >
              <div class="font-medium text-gray-900 dark:text-gray-100">{{ result.title }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ result.path }}</div>
            </div>
          </div>

          <div v-else-if="searchQuery" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No results found for "{{ searchQuery }}"
          </div>

          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1"><span class="docs-kbd">↑</span> <span class="docs-kbd">↓</span> to navigate</span>
              <span class="flex items-center gap-1"><span class="docs-kbd">↵</span> to select</span>
            </div>
            <span>{{ searchResults.length }} results</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
