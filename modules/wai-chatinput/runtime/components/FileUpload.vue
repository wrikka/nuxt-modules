<template>
  <div class="file-upload">
    <div class="upload-area border-2 border-dashed rounded-lg p-6 text-center transition-colors" :class="{ 'border-blue-400 bg-blue-50': isDragOver }" @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false" @drop.prevent="_handleDrop">
      <input
        ref="fileInput"
        type="file"
        :multiple="config.multiple"
        :accept="config.allowedTypes.join(',')"
        @change="_handleFileSelect"
        class="hidden"
      />

      <div v-if="files.length === 0" class="space-y-4">
        <div class="text-gray-500">
          <Icon name="mdi:cloud-upload-outline" class="mx-auto h-12 w-12 mb-4 text-gray-500" />
          <button
            @click="_triggerFileSelect"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Select File
          </button>
        </div>
      </div>

      <SelectedFiles v-else :files="files" @remove="_removeFile" @clear="clearFiles" @addMore="_triggerFileSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { validateFile, formatFileSize, isImageFile } from '../../../../module/file-upload/runtime/utils/fileUploadUtils'
import SelectedFiles from './SelectedFiles.vue'

const config = useRuntimeConfig().public.fileUpload as {
  maxFileSize: number
  allowedTypes: string[]
  multiple: boolean
  maxFiles: number
}

const fileInput = ref<HTMLInputElement>()
const files = ref<File[]>([])
const isDragOver = ref(false)
const emit = defineEmits<{
  filesChanged: [files: File[]]
}>()

const addFiles = (fileList: FileList) => {
  const newFiles = Array.from(fileList)
  if (config.multiple && files.value.length + newFiles.length > config.maxFiles) {
    alert(`Select up to ${config.maxFiles} files`)
    return
  }
  const validFiles = newFiles.filter(file => {
    const result = validateFile(file, config)
    if (!result.valid) {
      alert(result.error!)
      return false
    }
    return true
  })
  if (config.multiple) {
    files.value.push(...validFiles)
  } else {
    files.value = validFiles.slice(0, 1)
  }
  emit('filesChanged', files.value)
}

const _handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(target.files)
  }
  target.value = ''
}

const _handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files)
  }
}

const _triggerFileSelect = () => {
  fileInput.value?.click()
}

const _removeFile = (index: number) => {
  files.value.splice(index, 1)
  emit('filesChanged', files.value)
}

const clearFiles = () => {
  files.value = []
  emit('filesChanged', files.value)
}

defineExpose({
  clearFiles,
  getFiles: () => files.value
})
</script>

<style scoped>
.upload-area {
  transition: all 0.2s ease;
}
</style>
