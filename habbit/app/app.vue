<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
