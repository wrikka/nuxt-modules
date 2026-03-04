<script setup lang="ts">
interface Props {
  modelValue?: string
  language?: string
  theme?: 'light' | 'dark'
  height?: string
  readonly?: boolean
  lineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  language: 'javascript',
  theme: 'light',
  height: '300px',
  readonly: false,
  lineNumbers: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const lines = computed(() => props.modelValue.split('\n'))

const onInput = (e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', value)
}

const onChange = () => {
  emit('change', props.modelValue)
}

const insertTab = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd
    const value = target.value
    
    emit('update:modelValue', value.substring(0, start) + '  ' + value.substring(end))
    
    nextTick(() => {
      target.selectionStart = target.selectionEnd = start + 2
    })
  }
}
</script>

<template>
  <div
    class="rounded-lg border overflow-hidden font-mono text-sm"
    :class="theme === 'dark' ? 'border-gray-700 bg-gray-900 text-gray-100' : 'border-gray-200 bg-white text-gray-800'"
  >
    <div
      class="flex items-center gap-2 px-3 py-2 border-b text-xs"
      :class="theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'"
    >
      <span class="i-lucide-code size-4" />
      <span class="uppercase">{{ language }}</span>
      <span v-if="readonly" class="ml-auto text-gray-500">Read-only</span>
    </div>
    
    <div class="flex" :style="{ height }">
      <div
        v-if="lineNumbers"
        class="flex-shrink-0 py-3 px-3 text-right select-none"
        :class="theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-50 text-gray-400'"
      >
        <div v-for="n in lines.length" :key="n" class="leading-6">{{ n }}</div>
      </div>
      
      <textarea
        ref="textareaRef"
        :value="modelValue"
        :readonly="readonly"
        class="flex-1 resize-none border-0 p-3 leading-6 outline-none"
        :class="theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'"
        :style="{ tabSize: 2 }"
        spellcheck="false"
        @input="onInput"
        @change="onChange"
        @keydown="insertTab"
      />
    </div>
  </div>
</template>
