<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
  time: Date | string
  avatar?: { src?: string; name?: string }
  unread?: boolean
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  description: undefined,
  avatar: undefined,
  unread: false
})
</script>

<template>
  <div
    class="flex gap-3 p-3 transition-colors hover:bg-gray-50"
    :class="{ 'bg-blue-50/50': unread }"
  >
    <Avatar
      v-if="avatar"
      :src="avatar.src"
      :alt="avatar.name"
      :fallback="avatar.name?.charAt(0)"
      class="shrink-0"
    />
    <div v-else-if="icon" class="shrink-0 rounded-full bg-gray-100 p-2">
      <span :class="`i-lucide-${icon} size-4 text-gray-500`" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <h4 class="font-medium text-gray-900" :class="{ 'font-semibold': unread }">{{ title }}</h4>
        <Time :value="time" format="relative" class="shrink-0 text-xs text-gray-400" />
      </div>
      <p v-if="description" class="mt-0.5 text-sm text-gray-600 truncate">{{ description }}</p>
    </div>
    <div v-if="unread" class="mt-2 size-2 shrink-0 rounded-full bg-blue-500" />
  </div>
</template>
