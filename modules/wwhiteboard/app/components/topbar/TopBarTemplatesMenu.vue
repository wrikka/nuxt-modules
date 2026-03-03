<script setup lang="ts">
import { ref } from 'vue'
import { templates as builtInTemplates } from '../../data/templates'
import type { WhiteboardDoc } from '~/../shared/types/whiteboard'
import { useCustomTemplates } from '~/composables/facade/useCustomTemplates'

const props = defineProps<{ doc: WhiteboardDoc }>()
const emit = defineEmits<{ (e: 'select', templateId: string): unknown; (e: 'load', doc: WhiteboardDoc): unknown }>()

const open = ref(false)
const { customTemplates, saveTemplate } = useCustomTemplates()

const onSelect = (templateId: string) => {
  emit('select', templateId)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="h-9 px-3 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-gray-100"
      type="button"
      @click="open = !open"
      @blur="open = false" 
    >
      Templates
    </button>

    <div v-if="open" class="absolute left-0 top-11 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-1">
      <button
        class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 font-medium text-blue-600"
        type="button"
        @mousedown.prevent="saveTemplate(props.doc)"
      >
        <Icon name="mdi:plus-circle-outline" class="w-4 h-4 mr-1" />
        Save current as template
      </button>

      <div class="my-1 h-px bg-gray-200" />

      <div v-if="customTemplates.length > 0">
        <div class="px-3 py-1 text-xs text-gray-400 font-semibold uppercase">Custom</div>
        <button
          v-for="template in customTemplates"
          :key="template.id"
          class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
          type="button"
          @mousedown.prevent="emit('load', template.doc); open = false"
        >
          {{ template.name }}
        </button>
        <div class="my-1 h-px bg-gray-200" />
      </div>

      <div class="px-3 py-1 text-xs text-gray-400 font-semibold uppercase">Built-in</div>
      <button
        v-for="template in builtInTemplates"
        :key="template.id"
        class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
        type="button"
        @mousedown.prevent="onSelect(template.id)"
      >
        {{ template.name }}
      </button>
    </div>
  </div>
</template>
