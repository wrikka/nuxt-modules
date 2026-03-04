<script setup lang="ts">
interface Props {
  avatars: Array<{ src?: string; name?: string; fallback?: string }>
  max?: number
  size?: 'sm' | 'md' | 'lg'
  stacked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 3,
  size: 'md',
  stacked: true
})

const sizes = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base'
}

const visibleAvatars = props.avatars.slice(0, props.max)
const remaining = Math.max(0, props.avatars.length - props.max)
</script>

<template>
  <div class="flex" :class="{ '-space-x-2': stacked }">
    <Avatar
      v-for="(avatar, index) in visibleAvatars"
      :key="index"
      :src="avatar.src"
      :alt="avatar.name"
      :fallback="avatar.fallback || avatar.name?.charAt(0) || '?'"
      :class="[
        sizes[size],
        stacked && 'ring-2 ring-white'
      ]"
    />
    <div
      v-if="remaining > 0"
      class="flex items-center justify-center rounded-full bg-gray-200 font-medium text-gray-600"
      :class="[sizes[size], stacked && 'ring-2 ring-white']"
    >
      +{{ remaining }}
    </div>
  </div>
</template>
