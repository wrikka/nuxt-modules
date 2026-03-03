<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-gray-700">ไฟล์ที่เลือก ({{ files.length }})</h3>
      <div v-if="selectedFiles.size > 0" class="flex items-center space-x-2">
        <span class="text-xs text-gray-500">เลือก {{ selectedFiles.size }} ไฟล์</span>
        <button
          @click="bulkDelete"
          class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          ลบที่เลือก
        </button>
        <button
          @click="clearSelection"
          class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          ยกเลิก
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <div
        v-for="(file, index) in files"
        :key="file.id"
        draggable="true"
        class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
        :class="{ 'ring-2 ring-blue-500': selectedFiles.has(file.id) }"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        <!-- Checkbox for bulk selection -->
        <div class="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            :checked="selectedFiles.has(file.id)"
            @change="toggleFileSelection(file.id)"
            class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <Icon name="mdi:drag" class="w-4 h-4 text-gray-400 cursor-move" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.file.size) }}</p>
          </div>
        </div>

        <!-- File Preview for Images -->
        <div v-if="file.file.type.startsWith('image/')" class="flex-shrink-0 ml-3">
          <img
            :src="file.preview"
            :alt="file.file.name"
            class="w-10 h-10 rounded object-cover border border-gray-200"
          />
        </div>

        <!-- Individual Remove Button -->
        <button
          @click="emit('removeFile', index)"
          class="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
          title="ลบไฟล์"
        >
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatFileSize } from '../utils/fileUploadUtils'

interface UploadFile {
  file: File
  id: string
  preview?: string
  uploadProgress: number
  error?: string
  uploaded?: boolean
  url?: string
}

const props = defineProps<{
  files: readonly UploadFile[]
}>()

const emit = defineEmits<{
  removeFile: [index: number]
  reorderFiles: [files: any[]]
}>()

const draggedIndex = ref<number | null>(null)
const selectedFiles = ref<Set<string>>(new Set())

const toggleFileSelection = (fileId: string) => {
  if (selectedFiles.value.has(fileId)) {
    selectedFiles.value.delete(fileId)
  } else {
    selectedFiles.value.add(fileId)
  }
}

const bulkDelete = () => {
  // Get indices of selected files
  const indicesToRemove: number[] = []
  props.files.forEach((file, index) => {
    if (selectedFiles.value.has(file.id)) {
      indicesToRemove.push(index)
    }
  })

  // Remove from highest index to lowest to maintain correct indices
  indicesToRemove.sort((a, b) => b - a).forEach(index => {
    emit('removeFile', index)
  })

  selectedFiles.value.clear()
}

const clearSelection = () => {
  selectedFiles.value.clear()
}

const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index
  event.dataTransfer!.effectAllowed = 'move'
  event.dataTransfer!.setData('text/html', (event.target as HTMLElement).outerHTML)
}

const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault()
  const dragIndex = draggedIndex.value

  if (dragIndex !== null && dragIndex !== dropIndex && dragIndex >= 0 && dragIndex < props.files.length) {
    // Create a copy of files array
    const newFiles = [...props.files]
    // Remove dragged item
    const draggedItem = newFiles.splice(dragIndex, 1)[0]!
    // Insert at new position, adjusting for the removal
    const adjustedDropIndex = dropIndex > dragIndex ? dropIndex - 1 : dropIndex
    newFiles.splice(adjustedDropIndex, 0, draggedItem)

    // Emit reorder event - we'll need to handle this in parent
    emit('reorderFiles', newFiles)
  }

  draggedIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
}

defineExpose({
  selectedFiles
})
</script>
