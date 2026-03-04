<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
  time: Date | string
  avatar?: { src?: string; name?: string }
  unread?: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  description: undefined,
  avatar: undefined,
  unread: false,
  type: 'info'
})

const typeIcons = {
  info: 'bell',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'x-circle'
}

const typeColors = {
  info: 'bg-blue-100 text-blue-600',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-yellow-100 text-yellow-600',
  error: 'bg-red-100 text-red-600'
}
</script>

<template>
  <div
    class="flex gap-3 p-3 transition-colors hover:bg-gray-50"
    :class="{ 'bg-blue-50/50': unread }"
  >
    <div
      v-if="!avatar"
      class="shrink-0 rounded-full p-2"
      :class="typeColors[type]"
    >
      <span :class="`i-lucide-${icon || typeIcons[type]} size-4`" />
    </div>
    <Avatar
      v-else
      :src="avatar.src"
      :alt="avatar.name"
      :fallback="avatar.name?.charAt(0)"
      class="shrink-0"
    />
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
