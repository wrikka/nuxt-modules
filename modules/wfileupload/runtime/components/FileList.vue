<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium">Selected Files ({{ files.length }})</h3>
      <button
        @click="$emit('clearFiles')"
        class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Clear All
      </button>
    </div>

    <div class="space-y-2 max-h-40 overflow-y-auto">
      <FileItem
        v-for="(file, index) in files"
        :key="index"
        :file="file"
        :index="index"
        @remove="$emit('removeFile', index)"
      />
    </div>

    <button
      @click="$emit('triggerSelect')"
      class="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Add More Files
    </button>
  </div>
</template>

<script setup lang="ts">
import FileItem from './FileItem.vue'

const props = defineProps<{
  files: File[]
}>()

const emit = defineEmits<{
  removeFile: [index: number]
  clearFiles: []
  triggerSelect: []
}>()
</script>
