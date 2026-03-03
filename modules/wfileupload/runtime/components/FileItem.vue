<template>
  <div class="flex items-center justify-between bg-gray-50 p-3 rounded border">
    <div class="flex items-center space-x-3 flex-1 min-w-0">
      <div class="flex-shrink-0">
        <img v-if="isImageFile(file)" :src="createObjectURL(file)" class="h-8 w-8 object-cover rounded" alt="preview" />
        <svg v-else class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
        <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
      </div>
    </div>
    <button
      @click="$emit('remove')"
      class="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { isImageFile, formatFileSize } from '../utils/fileUploadUtils'

const props = defineProps<{
  file: File
  index: number
}>()

const emit = defineEmits<{
  remove: []
}>()

const createObjectURL = (file: File) => URL.createObjectURL(file)
</script>
