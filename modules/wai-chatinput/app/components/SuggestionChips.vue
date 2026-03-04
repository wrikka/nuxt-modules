<template>
  <div v-if="topSuggestions.length > 0" class="suggestion-chips py-2">
    <div class="text-xs text-gray-500 mb-2 flex items-center gap-1">
      <Icon name="mdi:lightbulb-outline" class="w-4 h-4" />
      คำแนะนำ
      <button @click="toggleEnabled" class="text-blue-500 hover:underline">
        {{ enabled ? 'ปิด' : 'เปิด' }}
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="suggestion in topSuggestions"
        :key="suggestion.id"
        @click="apply(suggestion)"
        :class="[
          'px-3 py-1.5 rounded-full text-sm transition-all',
          suggestion.type === 'continue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
          suggestion.type === 'question' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
          suggestion.type === 'topic' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
          'bg-orange-100 text-orange-700 hover:bg-orange-200'
        ]"
      >
        <span class="flex items-center gap-1">
          <Icon
            :name="suggestion.type === 'continue' ? 'mdi:arrow-right' :
                    suggestion.type === 'question' ? 'mdi:help-circle' :
                    suggestion.type === 'topic' ? 'mdi:tag' : 'mdi:flash'"
            class="w-3.5 h-3.5"
          />
          {{ suggestion.text }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSmartSuggestions } from '../../../../wcomposables/packages/composables/src/chat/useSmartSuggestions'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  messages: ChatMessage[]
}>()

const emit = defineEmits<{
  apply: [text: string]
}>()

const { topSuggestions, enabled, toggleEnabled, applySuggestion } = useSmartSuggestions(props.messages)

const apply = (suggestion: any) => {
  const text = applySuggestion(suggestion)
  emit('apply', text)
}
</script>
