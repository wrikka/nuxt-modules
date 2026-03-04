<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
  actionText?: string
  actionHref?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'inbox',
  description: 'No data available',
  actionText: undefined,
  actionHref: undefined
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="rounded-full bg-gray-100 p-4">
      <span :class="`i-lucide-${icon} size-8 text-gray-400`" />
    </div>
    <h3 class="mt-4 text-lg font-medium text-gray-900">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
    <slot />
    <Anchor
      v-if="actionText && actionHref"
      :to="actionHref"
      class="mt-4 text-blue-600 hover:text-blue-700"
    >
      {{ actionText }}
    </Anchor>
  </div>
</template>
