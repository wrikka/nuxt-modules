<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer group"
      @click="_onTriggerSelect"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop="_handleDrop"
      :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        @change="_handleFileSelect"
      />
      <div class="text-gray-600 mb-4">
        <Icon name="mdi:cloud-upload" class="w-12 h-12 mx-auto mb-2" />
        <p class="text-lg font-medium">ลากไฟล์มาที่นี่ หรือคลิกเพื่อเลือก</p>
        <p class="text-sm">รองรับไฟล์หลายไฟล์พร้อมกัน</p>
      </div>
      <button
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        เลือกไฟล์
      </button>
    </div>

    <FileListDraggable v-if="files.length > 0" :files="files" @remove-file="$emit('removeFile', $event)" @reorder-files="$emit('reorderFiles', $event)" />

    <!-- File Confirm Modal -->
    <FileConfirmModal
      v-if="showConfirmModal"
      :files="pendingFiles"
      :config="config"
      :show="showConfirmModal"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type FileList from './FileList.vue'
import FileConfirmModal from './FileConfirmModal.vue'
import FileListDraggable from './FileListDraggable.vue'
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
  config: {
    maxFileSize: number
    allowedTypes: readonly string[]
    multiple: boolean
    maxFiles: number
  }
}>()

const emit = defineEmits<{
  addFiles: [files: FileList | File[]]
  removeFile: [index: number]
  clearFiles: []
  triggerSelect: []
  reorderFiles: [files: any[]]
}>()

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const pendingFiles = ref<File[]>([])
const showConfirmModal = ref(false)


const _handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    pendingFiles.value = Array.from(target.files)
    showConfirmModal.value = true
  }
  // Reset input
  target.value = ''
}

const _handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    pendingFiles.value = Array.from(event.dataTransfer.files)
    showConfirmModal.value = true
  }
}

const _triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleConfirm = (files: File[]) => {
  emit('addFiles', files)
  showConfirmModal.value = false
  pendingFiles.value = []
}

const handleCancel = () => {
  showConfirmModal.value = false
  pendingFiles.value = []
}

const _onTriggerSelect = () => {
  _triggerFileSelect()
}
</script>
-->

<style scoped>
.upload-area {
  transition: all 0.2s ease;
}
</style>
