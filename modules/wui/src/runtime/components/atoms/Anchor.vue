<script setup lang="ts">
interface Props {
  to: string
  activeClass?: string
  exact?: boolean
}

withDefaults(defineProps<Props>(), {
  activeClass: 'text-blue-600 font-medium',
  exact: false
})
</script>

<template>
  <NuxtLink
    :to="to"
    :active-class="activeClass"
    :exact-active-class="exact ? activeClass : undefined"
    class="transition-colors hover:text-blue-500"
  >
    <slot />
  </NuxtLink>
</template>
