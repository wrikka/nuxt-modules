<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <Icon name="mdi:export" class="w-4 h-4" />
      <span class="text-sm">Export</span>
      <Icon name="mdi:chevron-down" class="w-4 h-4" :class="{ 'rotate-180': showMenu }" />
    </button>

    <div
      v-if="showMenu"
      v-click-outside="() => showMenu = false"
      class="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg py-1 min-w-48 z-50"
    >
      <button
        v-for="format in formats"
        :key="format.id"
        @click="exportConversation(format.id)"
        :disabled="isExporting"
        class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
      >
        <Icon :name="format.icon" class="w-5 h-5 text-gray-500" />
        <div class="text-left">
          <div class="text-sm font-medium">{{ format.name }}</div>
          <div class="text-xs text-gray-400">{{ format.description }}</div>
        </div>
      </button>

      <div class="border-t my-1" />

      <div class="px-4 py-2">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input v-model="includeMetadata" type="checkbox" class="rounded" />
          รวม metadata
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer mt-1">
          <input v-model="includeTimestamps" type="checkbox" class="rounded" />
          รวมเวลา
        </label>
      </div>
    </div>

    <div
      v-if="isExporting"
      class="absolute top-full right-0 mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 w-48"
    >
      <div class="flex items-center gap-2 text-sm text-blue-700">
        <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
        กำลัง export...
      </div>
      <div class="mt-2 h-1 bg-blue-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-500 transition-all duration-300"
          :style="{ width: `${exportProgress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatExport } from '../../../../wcomposables/packages/composables/src/chat/useChatExport'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  messages: ChatMessage[]
  title: string
}>()

const { isExporting, exportProgress, exportConversation: doExport } = useChatExport()

const showMenu = ref(false)
const includeMetadata = ref(true)
const includeTimestamps = ref(true)

const formats = [
  { id: 'markdown', name: 'Markdown', description: '.md - อ่านง่าย', icon: 'mdi:language-markdown' },
  { id: 'json', name: 'JSON', description: '.json - สำหรับ dev', icon: 'mdi:code-json' },
  { id: 'txt', name: 'Text', description: '.txt - ข้อความล้วน', icon: 'mdi:file-document' },
  { id: 'pdf', name: 'PDF', description: '.pdf - แชร์ได้', icon: 'mdi:file-pdf' }
]

const exportConversation = async (format: string) => {
  await doExport(props.messages, props.title, {
    format: format as any,
    includeMetadata: includeMetadata.value,
    includeTimestamps: includeTimestamps.value
  })
  showMenu.value = false
}
</script>
