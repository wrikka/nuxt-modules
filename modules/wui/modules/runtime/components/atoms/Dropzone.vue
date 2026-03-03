<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSize?: number
  maxFiles?: number
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  multiple: false,
  disabled: false,
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 1
})

const emit = defineEmits<{
  'files-dropped': [files: File[]]
  error: [error: string]
}>()

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
  
  const files = Array.from(event.dataTransfer?.files || [])
  handleFiles(files)
}

const _onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  handleFiles(files)
}

const handleFiles = (files: File[]) => {
  // Filter by file type
  if (_props.accept) {
    const acceptedTypes = _props.accept.split(',').map(type => type.trim())
    files = files.filter(file => {
      return acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.endsWith(type)
        }
        return file.type.match(type.replace('*', '.*'))
      })
    })
  }
  
  // Filter by size
  files = files.filter(file => file.size <= _props.maxSize)
  
  // Limit number of files
  if (!_props.multiple || _props.maxFiles > 0) {
    files = files.slice(0, _props.maxFiles)
  }
  
  if (files.length === 0) {
    emit('error', 'No valid files found')
    return
  }
  
  emit('files-dropped', files)
}

const _openFileDialog = () => {
  if (!_props.disabled) {
    fileInput.value?.click()
  }
}
</script>

<template>
  <div
    :class="_classes"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="openFileDialog"
  >
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="hidden"
      @change="onFileInput"
    />
    
    <div class="flex flex-col items-center space-y-2">
      <div class="i-lucide-upload-cloud h-12 w-12 text-muted-foreground" />
      <div class="text-lg font-medium">Drop files here</div>
      <div class="text-sm text-muted-foreground">
        or click to select files
      </div>
      <div v-if="accept" class="text-xs text-muted-foreground">
        Accepted: {{ accept }}
      </div>
      <div v-if="maxSize" class="text-xs text-muted-foreground">
        Max size: {{ Math.round(maxSize / 1024 / 1024) }}MB
      </div>
    </div>
  </div>
</template>
