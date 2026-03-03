<template>
  <div class="flex flex-col">
    <!-- Reply indicator -->
    <div v-if="replyTo" class="mb-2 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="mdi:reply" class="w-4 h-4 text-blue-500" />
          <span class="text-sm text-blue-700">ตอบกลับ:</span>
          <span class="text-sm text-gray-700 truncate">{{ replyTo?.content || 'ข้อความ' }}</span>
        </div>
        <button
          @click="$emit('cancel-reply')"
          class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="ยกเลิกการตอบกลับ"
        >
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 relative">
    <button
      @click="$emit('attach')"
      class="p-2 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
      title="แนบไฟล์"
    >
      <Icon name="mdi:paperclip" class="w-4 h-4" />
    </button>
    <button
      @click="$emit('toggleVoice')"
      :class="['p-2 transition-colors flex-shrink-0', isListening ? 'text-red-600 animate-pulse' : 'text-gray-600 hover:text-gray-800']"
      title="พูดเพื่อพิมพ์"
    >
      <Icon name="mdi:microphone" class="w-4 h-4" />
    </button>
    <button
      @click="togglePromptTemplatesLocal"
      class="p-2 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
      title="เทมเพลตคำสั่ง"
    >
      <Icon name="mdi:file-document-edit-outline" class="w-4 h-4" />
    </button>

    <!-- Templates Dropdown -->
    <TemplateSelector
      :items="templates"
      :categories="categories"
      :selectedCategory="selectedCategory"
      :show="showTemplates"
      @select="handleSelectTemplate"
      @update:selectedCategory="selectedCategory = $event"
    />

    <!-- Prompt Templates Dropdown -->
    <TemplateSelector
      :items="filteredPromptTemplates"
      :categories="promptCategories"
      :selectedCategory="selectedPromptCategory"
      :show="showPromptTemplates"
      :width="'w-96'"
      @select="selectPromptTemplate"
      @update:selectedCategory="selectedPromptCategory = $event"
    />

    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value); $emit('input', $event)"
      placeholder="พิมพ์ข้อความ..."
      class="flex-1 px-3 py-2 border rounded-md resize-none"
      rows="3"
      @keydown.enter.exact.prevent="$emit('send')"
      @keydown="$emit('keydown', $event)"
    ></textarea>
    <CallControls v-if="chatInput.isInCall" :chatInput="chatInput" />
    <button @click="$emit('send')" :disabled="!canSend" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
      ส่ง
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import TemplateSelector from './TemplateSelector.vue'
import CallControls from './CallControls.vue'
import { useMessageTemplates } from '../../../shared/composables/useMessageTemplates'
import { usePromptTemplates } from '../../../shared/composables/usePromptTemplates'
import { useChatInput } from '../../../shared/composables/useChatInput'

const props = defineProps<{
  modelValue: string
  canSend: boolean
  isListening: boolean
  replyTo?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  attach: []
  toggleVoice: []
  input: [event: Event]
  keydown: [event: KeyboardEvent]
  'cancel-reply': []
}>()

const textareaRef = ref<HTMLTextAreaElement>()

const {
  showTemplates,
  selectedCategory,
  templates,
  categories,
  toggleTemplates,
  selectTemplate: _selectTemplate
} = useMessageTemplates()

const {
  templates: promptTemplates,
  categories: promptCategories,
  filteredTemplates: filteredPromptTemplates,
  showPromptTemplates,
  selectedPromptCategory,
  togglePromptTemplates,
  selectTemplate: _selectPromptTemplate
} = usePromptTemplates()

const chatInput = useChatInput()

const togglePromptTemplatesLocal = () => {
  togglePromptTemplates()
  // Close message templates if open
  if (showTemplates.value) {
    showTemplates.value = false
  }
}

const selectPromptTemplate = (template: any) => {
  const selected = _selectPromptTemplate(template)
  emit('update:modelValue', selected.template)
  // Focus textarea after selection
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const handleSelectTemplate = (template: any) => {
  const selected = _selectTemplate(template)
  emit('update:modelValue', selected.content)
  // Focus textarea after selection
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

defineExpose({
  textarea: textareaRef
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
