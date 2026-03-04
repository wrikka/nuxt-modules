<template>
  <div class="relative">
    <button
      @click="showPicker = !showPicker"
      class="p-1 hover:bg-gray-100 rounded"
      title="เพิ่ม reaction"
    >
      <Icon name="mdi:emoticon-happy-outline" class="w-5 h-5 text-gray-400" />
    </button>

    <div
      v-if="showPicker"
      v-click-outside="() => showPicker = false"
      class="absolute bottom-full left-0 mb-1 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 z-50"
    >
      <button
        v-for="emoji in emojis"
        :key="emoji"
        @click="addReaction(emoji)"
        class="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-lg"
      >
        {{ emoji }}
      </button>
    </div>

    <div v-if="reactions.length > 0" class="flex flex-wrap gap-1 mt-1">
      <button
        v-for="reaction in reactions"
        :key="reaction.emoji"
        @click="toggleReaction(reaction.emoji)"
        :class="['flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors', reaction.hasReacted ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 hover:bg-gray-200']"
      >
        <span>{{ reaction.emoji }}</span>
        <span :class="reaction.hasReacted ? 'text-blue-700' : 'text-gray-600'">{{ reaction.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMessageReactions } from '../../../../wcomposables/packages/composables/src/chat/useMessageReactions'

const props = defineProps<{
  messageId: number
  currentUserId: string
  userName: string
}>()

const { getMessageReactions, addReaction: doAddReaction, toggleReaction: doToggleReaction, getAllEmojis } = useMessageReactions(props.currentUserId)

const showPicker = ref(false)
const emojis = getAllEmojis()
const reactions = computed(() => getMessageReactions(props.messageId))

import { computed } from 'vue'

const addReaction = (emoji: string) => {
  doAddReaction(props.messageId, emoji, props.userName)
  showPicker.value = false
}

const toggleReaction = (emoji: string) => {
  doToggleReaction(props.messageId, emoji, props.userName)
}
</script>
