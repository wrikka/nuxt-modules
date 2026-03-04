<template>
  <div class="relative">
    <button
      @click="showVersions = !showVersions"
      class="p-1 hover:bg-gray-100 rounded"
      title="ดูประวัติแก้ไข"
    >
      <Icon name="mdi:history" class="w-4 h-4 text-gray-400" />
    </button>

    <div
      v-if="showVersions"
      v-click-outside="() => showVersions = false"
      class="absolute bottom-full right-0 mb-1 bg-white border rounded-lg shadow-lg p-3 w-80 z-50"
    >
      <h4 class="font-medium mb-3 flex items-center gap-2">
        <Icon name="mdi:file-document-edit" class="w-4 h-4" />
        ประวัติแก้ไข ({{ versions.length }} เวอร์ชัน)
      </h4>

      <div class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="(version, index) in versions"
          :key="index"
          class="p-2 rounded-lg"
          :class="index === versions.length - 1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium" :class="index === versions.length - 1 ? 'text-blue-700' : 'text-gray-600'">
              {{ index === 0 ? 'ต้นฉบับ' : index === versions.length - 1 ? 'ล่าสุด' : `เวอร์ชัน ${index + 1}` }}
            </span>
            <span class="text-xs text-gray-400">{{ formatTime(version.editedAt) }}</span>
          </div>
          <div class="text-sm line-clamp-2">{{ version.content }}</div>
          <div class="text-xs text-gray-400 mt-1">โดย {{ version.editedBy }}</div>
        </div>
      </div>

      <div v-if="versions.length > 1" class="mt-3 pt-3 border-t">
        <button
          @click="showDiff = true"
          class="text-sm text-blue-500 hover:underline"
        >
          เปรียบเทียบเวอร์ชัน
        </button>
      </div>
    </div>

    <div
      v-if="showDiff"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showDiff = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">เปรียบเทียบเวอร์ชัน</h3>
          <button @click="showDiff = false" class="p-1 hover:bg-gray-100 rounded">
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-sm font-medium mb-2">ต้นฉบับ</div>
            <div class="text-sm whitespace-pre-wrap">{{ versions[0]?.content }}</div>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <div class="text-sm font-medium mb-2 text-blue-700">ล่าสุด</div>
            <div class="text-sm whitespace-pre-wrap">{{ versions[versions.length - 1]?.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageHistory } from '../../../../wcomposables/packages/composables/src/chat/useMessageHistory'

const props = defineProps<{
  messageId: number
}>()

const { getMessageVersions } = useMessageHistory()
const showVersions = ref(false)
const showDiff = ref(false)

const versions = computed(() => getMessageVersions(props.messageId))

import { computed } from 'vue'

const formatTime = (date: Date) => {
  return new Date(date).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit' })
}
</script>
