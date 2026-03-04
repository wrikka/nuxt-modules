<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: File[]
  accept?: string
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  preview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: 'image/*',
  maxSize: 5 * 1024 * 1024,
  maxFiles: 5,
  disabled: false,
  preview: true
})

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
  error: [message: string]
}>()

const dragover = ref(false)
const error = ref('')

const handleFileSelect = (files: FileList | null) => {
  if (!files || props.disabled) return
  
  error.value = ''
  const newFiles: File[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    if (file.size > props.maxSize) {
      emit('error', `${file.name} exceeds max size`)
      continue
    }
    
    if (props.modelValue.length + newFiles.length >= props.maxFiles) {
      emit('error', `Max ${props.maxFiles} files allowed`)
      break
    }
    
    newFiles.push(file)
  }
  
  if (newFiles.length > 0) {
    emit('update:modelValue', [...props.modelValue, ...newFiles])
  }
}

const removeFile = (index: number) => {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

const getPreviewUrl = (file: File) => URL.createObjectURL(file)
</script>

<template>
  <div class="space-y-3">
    <div
      class="relative rounded-lg border-2 border-dashed p-6 transition-colors"
      :class="[
        dragover ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      @dragover.prevent
      @drop.prevent="dragover = false; handleFileSelect($event.dataTransfer?.files || null)"
      @click="!disabled && $refs.input?.click()"
    >
      <input
        ref="input"
        type="file"
        :accept="accept"
        :disabled="disabled"
        multiple
        class="hidden"
        @change="handleFileSelect(($event.target as HTMLInputElement).files)"
      />
      <div class="flex flex-col items-center gap-2 text-center">
        <span class="i-lucide-image size-8 text-gray-400" />
        <p class="text-sm text-gray-600">
          Drag & drop images or <span class="text-blue-600">click to browse</span>
        </p>
        <p class="text-xs text-gray-400">
          Max {{ maxFiles }} files, {{ (maxSize / 1024 / 1024).toFixed(0) }}MB each
        </p>
      </div>
    </div>
    
    <div v-if="preview && modelValue.length > 0" class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
      <div
        v-for="(file, index) in modelValue"
        :key="index"
        class="group relative aspect-square overflow-hidden rounded-lg"
      >
        <img
          :src="getPreviewUrl(file)"
          :alt="file.name"
          class="h-full w-full object-cover"
        />
        <button
          type="button"
          class="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          @click="removeFile(index)"
        >
          <span class="i-lucide-x size-3" />
        </button>
      </div>
    </div>
  </div>
</template>
