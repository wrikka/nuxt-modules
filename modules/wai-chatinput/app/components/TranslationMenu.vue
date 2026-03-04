<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="p-2 hover:bg-gray-100 rounded-lg"
      title="แปลภาษา"
    >
      <Icon name="mdi:translate" class="w-5 h-5" />
    </button>

    <div
      v-if="showMenu"
      v-click-outside="() => showMenu = false"
      class="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg py-2 w-48 z-50"
    >
      <div class="px-3 py-2 border-b">
        <label class="flex items-center gap-2 text-sm">
          <input v-model="autoTranslate" type="checkbox" class="rounded" />
          แปลอัตโนมัติ
        </label>
      </div>

      <div class="py-1">
        <button
          v-for="lang in supportedLanguages"
          :key="lang.code"
          @click="setLanguage(lang.code)"
          :class="['w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50', preferredTargetLanguage === lang.code ? 'bg-blue-50 text-blue-700' : '']"
        >
          <span>{{ lang.nativeName }}</span>
          <span class="text-xs text-gray-400">{{ lang.name }}</span>
          <Icon v-if="preferredTargetLanguage === lang.code" name="mdi:check" class="w-4 h-4 text-blue-500" />
        </button>
      </div>

      <div v-if="translatedText" class="border-t mt-1 pt-2 px-3">
        <div class="text-xs text-gray-500 mb-1">ผลการแปล:</div>
        <div class="text-sm">{{ translatedText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMessageTranslation } from '../../../../wcomposables/packages/composables/src/chat/useMessageTranslation'

const props = defineProps<{
  text: string
}>()

const { supportedLanguages, preferredTargetLanguage, autoTranslate, translate, setPreferredLanguage, toggleAutoTranslate } = useMessageTranslation()

const showMenu = ref(false)
const translatedText = ref('')
const isTranslating = ref(false)

const setLanguage = async (code: string) => {
  setPreferredLanguage(code)
  showMenu.value = false

  if (props.text) {
    isTranslating.value = true
    translatedText.value = await translate(props.text, 'auto', code)
    isTranslating.value = false
  }
}
</script>
