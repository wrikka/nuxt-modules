<template>
  <div class="relative">
    <div class="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <Icon name="mdi:magnify" class="w-5 h-5 text-gray-500" />
      <input
        v-model="searchQuery"
        @input="performSearch"
        type="text"
        placeholder="ค้นหาข้อความ..."
        class="flex-1 bg-transparent outline-none"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="p-1 hover:bg-gray-200 rounded"
      >
        <Icon name="mdi:close" class="w-4 h-4 text-gray-500" />
      </button>
    </div>

    <div
      v-if="isSearching && searchResults.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
    >
      <div
        v-for="result in searchResults"
        :key="`${result.conversationId}-${result.message.id}`"
        @click="$emit('select', result)"
        class="p-3 border-b hover:bg-gray-50 cursor-pointer"
      >
        <div class="text-xs text-gray-500 mb-1">
          {{ result.conversationTitle }}
        </div>
        <div class="text-sm" v-html="result.highlightText" />
        <div class="text-xs text-gray-400 mt-1">
          {{ formatDate(result.message.timestamp) }}
        </div>
      </div>
    </div>

    <div
      v-else-if="isSearching && searchQuery && !searchResults.length"
      class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500 z-50"
    >
      ไม่พบผลลัพธ์
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SearchResult } from '../../../wcomposables/packages/composables/src/chat/useChatSearch'

const props = defineProps<{
  searchResults: SearchResult[]
  isSearching: boolean
}>()

const emit = defineEmits<{
  select: [result: SearchResult]
  search: [query: string]
}>()

const searchQuery = ref('')

const performSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('th-TH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
