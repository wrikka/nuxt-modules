<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <div
    :class="[
      'min-h-screen bg-background text-text-primary transition-colors duration-200',
      isDark ? 'dark' : ''
    ]"
  >
    <slot />
    <NavigationBar />
  </div>
</template>
