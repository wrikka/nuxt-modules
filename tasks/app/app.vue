<script setup lang="ts">
const colorMode = useColorMode();

useHead({
  htmlAttrs: {
    class: () => colorMode.value,
  },
});
</script>

<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>
