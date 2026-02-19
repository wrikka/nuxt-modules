<script setup lang="ts">
import { ref, watch } from 'vue'
import type { WhiteboardEngine, WhiteboardMode } from '~/types/whiteboard'
import type { WhiteboardState, WhiteboardDoc } from '../../shared/types/whiteboard'
import TopBarEngineBadge from './topbar/TopBarEngineBadge.vue'
import TopBarModeSwitch from './topbar/TopBarModeSwitch.vue'
import TopBarShareMenu from './topbar/TopBarShareMenu.vue'
import TopBarSettingsMenu from './topbar/TopBarSettingsMenu.vue'
import TopBarTemplatesMenu from './topbar/TopBarTemplatesMenu.vue'
import { templates } from '../data/templates'

const props = defineProps<{
  engine: WhiteboardEngine
  mode: WhiteboardMode
  title: string
  doc: WhiteboardDoc
  settings: WhiteboardState['ui']['settings']
  chatbotOpen: boolean
  canUndo: boolean
  canRedo: boolean
}>()

const emit = defineEmits<{
  (e: 'mode', mode: WhiteboardMode): unknown
  (e: 'rename', title: string): unknown
  (e: 'settings', patch: Partial<WhiteboardState['ui']['settings']>): unknown
  (e: 'toggle-chatbot'): unknown
  (e: 'undo'): unknown
  (e: 'redo'): unknown
  (e: 'template', doc: WhiteboardDoc): unknown
  (e: 'load', doc: WhiteboardDoc): unknown
  (e: 'toggle-presentation'): unknown
  (e: 'export', title: string): unknown
}>()

const isEditingName = ref(false)
const draftName = ref(props.title)

watch(
  () => props.title,
  (value) => {
    if (isEditingName.value) return
    draftName.value = value
  },
)

const beginEditName = () => {
  draftName.value = props.title
  isEditingName.value = true
}

const commitName = () => {
  emit('rename', draftName.value.trim() || 'Untitled')
  isEditingName.value = false
}

const cancelEditName = () => {
  isEditingName.value = false
  draftName.value = props.title
}

const onSelectTemplate = (templateId: string) => {
  const template = templates.find((t) => t.id === templateId)
  if (template) {
    emit('template', template.doc)
  }
}
</script>

<template>
  <div class="h-14 w-full flex items-center gap-3 px-3 bg-white/90 backdrop-blur border-b border-gray-200">
    <TopBarEngineBadge :engine="engine" />

    <TopBarModeSwitch :mode="mode" @mode="emit('mode', $event)" />

    <div class="w-px h-6 bg-gray-200" />

    <div class="flex items-center gap-1">
      <button
        class="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
        type="button"
        title="Undo"
        :disabled="!props.canUndo"
        @click="emit('undo')"
      >
        <Icon name="mdi:undo" class="w-5 h-5" />
      </button>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
        type="button"
        title="Redo"
        :disabled="!props.canRedo"
        @click="emit('redo')"
      >
        <Icon name="mdi:redo" class="w-5 h-5" />
      </button>
    </div>

    <div class="h-9 flex items-center">
      <button
        v-if="!isEditingName"
        class="h-9 max-w-[280px] px-2 rounded-lg text-sm text-gray-900 hover:bg-gray-100 truncate"
        type="button"
        title="Double click to rename"
        @dblclick="beginEditName"
      >
        {{ title }}
      </button>

      <input
        v-else
        v-model="draftName"
        class="h-9 w-[280px] px-3 rounded-lg border border-gray-300 bg-white text-sm"
        type="text"
        placeholder="Whiteboard name"
        @blur="commitName"
        @keydown.enter.prevent="commitName"
        @keydown.esc.prevent="cancelEditName"
      >
    </div>

    <div class="flex-1" />

    <TopBarTemplatesMenu :doc="doc" @select="onSelectTemplate" @load="emit('load', $event)" />

    <button
      class="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
      type="button"
      title="Present"
      @click="emit('toggle-presentation')"
    >
      <Icon name="mdi:presentation" class="w-5 h-5" />
    </button>

    <TopBarShareMenu :doc="doc" :title="title" @export="emit('export', title)" />

    <TopBarSettingsMenu
      :settings="settings"
      :chatbot-open="chatbotOpen"
      @settings="emit('settings', $event)"
      @toggle-chatbot="emit('toggle-chatbot')"
    />
  </div>
</template>
