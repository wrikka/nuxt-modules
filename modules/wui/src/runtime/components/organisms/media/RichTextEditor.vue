<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  height?: string
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start typing...',
  height: '300px',
  disabled: false,
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const contentRef = ref<HTMLDivElement>()
const activeFormats = ref<Set<string>>(new Set())

const execCommand = (command: string, value: string | null = null) => {
  document.execCommand(command, false, value)
  updateActiveFormats()
  emit('update:modelValue', contentRef.value?.innerHTML || '')
}

const toggleFormat = (format: string) => {
  const commands: Record<string, string> = {
    bold: 'bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'strikeThrough',
    unorderedList: 'insertUnorderedList',
    orderedList: 'insertOrderedList'
  }
  execCommand(commands[format] || format)
}

const updateActiveFormats = () => {
  const formats = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList']
  activeFormats.value = new Set(formats.filter(f => document.queryCommandState(f)))
}

const onInput = () => {
  emit('update:modelValue', contentRef.value?.innerHTML || '')
}

const onBlur = () => {
  emit('change', contentRef.value?.innerHTML || '')
}

const isActive = (format: string) => {
  const mapping: Record<string, string> = {
    unorderedList: 'insertUnorderedList',
    orderedList: 'insertOrderedList',
    strikethrough: 'strikeThrough'
  }
  return activeFormats.value.has(mapping[format] || format)
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
    <div class="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('bold') }"
        @click="toggleFormat('bold')"
      >
        <span class="i-lucide-bold size-4" />
      </button>
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('italic') }"
        @click="toggleFormat('italic')"
      >
        <span class="i-lucide-italic size-4" />
      </button>
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('underline') }"
        @click="toggleFormat('underline')"
      >
        <span class="i-lucide-underline size-4" />
      </button>
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('strikethrough') }"
        @click="toggleFormat('strikethrough')"
      >
        <span class="i-lucide-strikethrough size-4" />
      </button>
      
      <span class="mx-1 h-4 w-px bg-gray-300" />
      
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('unorderedList') }"
        @click="toggleFormat('unorderedList')"
      >
        <span class="i-lucide-list size-4" />
      </button>
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        :class="{ 'bg-gray-200': isActive('orderedList') }"
        @click="toggleFormat('orderedList')"
      >
        <span class="i-lucide-list-ordered size-4" />
      </button>
      
      <span class="mx-1 h-4 w-px bg-gray-300" />
      
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        @click="execCommand('createLink', 'https://')"
      >
        <span class="i-lucide-link size-4" />
      </button>
      <button
        type="button"
        class="rounded p-1.5 text-gray-600 hover:bg-gray-200"
        @click="execCommand('insertImage', 'https://')"
      >
        <span class="i-lucide-image size-4" />
      </button>
    </div>
    
    <div
      ref="contentRef"
      :contenteditable="!disabled && !readonly"
      class="min-h-[150px] p-4 outline-none prose dark:prose-invert max-w-none"
      :style="{ height }"
      :placeholder="placeholder"
      v-html="modelValue"
      @input="onInput"
      @blur="onBlur"
      @keyup="updateActiveFormats"
      @mouseup="updateActiveFormats"
    />
  </div>
</template>

<style scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
}
</style>
