<script setup lang="ts">
interface Props {
  avatar?: { src?: string; name?: string }
  author: string
  time: Date | string
  content: string
  actions?: Array<{ label: string; icon?: string }>
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-3">
    <Avatar
      v-if="avatar"
      :src="avatar.src"
      :alt="avatar.name"
      :fallback="avatar.name?.charAt(0)"
      class="shrink-0"
    />
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-900">{{ author }}</span>
        <Time :value="time" format="relative" class="text-xs" />
      </div>
      <p class="mt-1 text-sm text-gray-700">{{ content }}</p>
      <div v-if="actions" class="mt-2 flex gap-4">
        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <span v-if="action.icon" :class="`i-lucide-${action.icon} size-3`" />
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>
