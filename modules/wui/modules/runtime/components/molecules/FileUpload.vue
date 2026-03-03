<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface Props {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 1,
  disabled: false
})

const emit = defineEmits<{
  'files-selected': [files: File[]]
  'upload-progress': [fileId: string, progress: number]
  'upload-success': [fileId: string]
  'upload-error': [fileId: string, error: string]
}>()

const files = ref<FileItem[]>([])
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

const _classes = computed(() => {
  const base = 'border-2 border-dashed rounded-lg p-8 text-center transition-colors'
  const states = isDragging.value
    ? 'border-primary bg-primary/10'
    : 'border-border hover:border-muted-foreground/50'
  const disabled = _props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  return `${base} ${states} ${disabled} ${_props.class || ''}`
})

const _formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

const _onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!_props.disabled) {
    isDragging.value = true
  }
}

const _onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const _onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (_props.disabled) return
  
  const droppedFiles = Array.from(event.dataTransfer?.files || [])
  addFiles(droppedFiles)
}

const _onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  addFiles(selectedFiles)
}

const addFiles = (newFiles: File[]) => {
  // Filter by file type
  if (_props.accept) {
    const acceptedTypes = _props.accept.split(',').map(type => type.trim())
    newFiles = newFiles.filter(file => {
      return acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.endsWith(type)
        }
        return file.type.match(type.replace('*', '.*'))
      })
    })
  }
  
  // Filter by size
  newFiles = newFiles.filter(file => file.size <= _props.maxSize)
  
  // Limit number of files
  const remainingSlots = _props.maxFiles - files.value.length
  if (remainingSlots > 0) {
    newFiles = newFiles.slice(0, remainingSlots)
  }
  
  const fileItems: FileItem[] = newFiles.map(file => ({
    id: Math.random().toString(36).substr(2, 9),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: 'pending'
  }))
  
  files.value.push(...fileItems)
  emit('files-selected', newFiles)
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const _removeFile = (fileId: string) => {
  files.value = files.value.filter(f => f.id !== fileId)
}

const _openFileDialog = () => {
  if (!_props.disabled) {
    fileInput.value?.click()
  }
}
</script>

<template>
  <div class="space-y-4">
    <div
      :class="_classes"
      @dragover="_onDragOver"
      @dragleave="_onDragLeave"
      @drop="_onDrop"
      @click="_openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="_props.accept"
        :multiple="_props.multiple"
        :disabled="_props.disabled"
        class="hidden"
        @change="_onFileInput"
      />
      
      <div class="flex flex-col items-center space-y-2">
        <div class="i-lucide-upload-cloud h-12 w-12 text-muted-foreground" />
        <div class="text-lg font-medium">Drop files here</div>
        <div class="text-sm text-muted-foreground">
          or click to select files
        </div>
        <div v-if="_props.accept" class="text-xs text-muted-foreground">
          Accepted: {{ _props.accept }}
        </div>
        <div v-if="_props.maxSize" class="text-xs text-muted-foreground">
          Max size: {{ Math.round(_props.maxSize / 1024 / 1024) }}MB
        </div>
      </div>
    </div>
    
    <div v-if="files.length > 0" class="space-y-2">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center justify-between rounded-md border p-3"
      >
        <div class="flex items-center space-x-3">
          <div class="i-lucide-file h-8 w-8 text-muted-foreground" />
          <div>
            <div class="text-sm font-medium">{{ file.name }}</div>
            <div class="text-xs text-muted-foreground">{{ _formatFileSize(file.size) }}</div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <div v-if="file.status === 'uploading'" class="text-xs text-muted-foreground">
            {{ file.progress }}%
          </div>
          <div v-else-if="file.status === 'success'" class="i-lucide-check-circle h-4 w-4 text-green-500" />
          <div v-else-if="file.status === 'error'" class="i-lucide-x-circle h-4 w-4 text-red-500" />
          
          <button
            type="button"
            class="rounded p-1 text-muted-foreground hover:text-foreground"
            @click="_removeFile(file.id)"
          >
            <div class="i-lucide-x h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
