<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium">Selected Files ({{ files.length }})</h3>
      <button @click="$emit('clear')" class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Clear All</button>
    </div>
    <div class="space-y-2 max-h-40 overflow-y-auto">
      <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between bg-gray-50 p-3 rounded border">
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <div class="flex-shrink-0">
            <Icon :name="isImageFile(file) ? 'mdi:image' : 'mdi:file-document-outline'" class="h-8 w-8 text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <button @click="$emit('remove', index)" class="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700">
          <Icon name="mdi:close" class="h-4 w-4" />
        </button>
      </div>
    </div>
    <button @click="$emit('addMore')" class="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Add More Files</button>
  </div>
</template>

<script setup lang="ts">
import { formatFileSize, isImageFile } from '../../../../module/file-upload/runtime/utils/fileUploadUtils'

const props = defineProps<{
  files: { name: string; size: number; type: string }[]
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
  addMore: []
}>()
</script>
