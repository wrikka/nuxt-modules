<template>
  <button
    @click="toggleBookmark"
    :class="['p-2 rounded-lg transition-colors', isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-gray-100 text-gray-400']"
    :title="isBookmarked ? 'ลบบุ๊กมาร์ก' : 'บุ๊กมาร์กข้อความนี้'"
  >
    <Icon :name="isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline'" class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessageBookmarks } from '../../../../wcomposables/packages/composables/src/chat/useMessageBookmarks'
import type { ChatMessage } from '../../../../wcomposables/packages/composables/src/types/chat'

const props = defineProps<{
  message: ChatMessage
  conversationId: string
}>()

const emit = defineEmits<{
  bookmark: []
  unbookmark: []
}>()

const { isBookmarked: checkBookmarked, addBookmark, removeBookmark } = useMessageBookmarks()

const isBookmarked = computed(() => checkBookmarked(props.message.id, props.conversationId))

const toggleBookmark = () => {
  if (isBookmarked.value) {
    const bookmark = useMessageBookmarks().getBookmarkByMessage(props.message.id, props.conversationId)
    if (bookmark) {
      removeBookmark(bookmark.id)
      emit('unbookmark')
    }
  } else {
    addBookmark(props.message, props.conversationId)
    emit('bookmark')
  }
}
</script>
