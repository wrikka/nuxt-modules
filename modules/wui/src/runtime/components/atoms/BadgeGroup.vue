<script setup lang="ts">
interface Props {
  badges?: Array<{ label: string; variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  badges: () => [],
  size: 'md'
})
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <Badge
      v-for="(badge, index) in badges"
      :key="index"
      :variant="badge.variant || 'default'"
      :size="size"
    >
      {{ badge.label }}
    </Badge>
  </div>
</template>
