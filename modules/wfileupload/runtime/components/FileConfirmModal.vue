<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="cancel"></div>

    <!-- Modal Content -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Confirm Selected Files</h3>
        <button
          @click="cancel"
          class="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-4">
        <div class="space-y-3">
          <div v-for="(file, index) in files" :key="index" class="flex items-center p-3 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0 mr-3">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
        <button
          @click="cancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
        >
          Confirm ({{ files.length }} files)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatFileSize } from '../utils/fileUploadUtils'

const props = defineProps<{
  files: File[]
  show: boolean
}>()

const emit = defineEmits<{
  confirm: [files: File[]]
  cancel: []
}>()

const confirm = () => {
  emit('confirm', props.files)
}

const cancel = () => {
  emit('cancel')
}
</script>
