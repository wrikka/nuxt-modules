<script setup lang="ts">
interface Props {
  to?: { src?: string; name?: string }
  author: string
  time: Date | string
  content: string
  parentAuthor?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex gap-3 pl-12">
    <Avatar
      v-if="to"
      :src="to.src"
      :alt="to.name"
      :fallback="to.name?.charAt(0)"
      size="sm"
      class="shrink-0"
    />
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-900">{{ author }}</span>
        <Time :value="time" format="relative" class="text-xs" />
      </div>
      <p class="mt-1 text-sm text-gray-700">
        <span v-if="parentAuthor" class="text-blue-600">@{{ parentAuthor }}</span>
        {{ content }}
      </p>
    </div>
  </div>
</template>
