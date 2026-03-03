<script setup lang="ts">
// Redirect to profile tab
definePageMeta({
  layout: 'default'
})

onMounted(() => {
  navigateTo('/tabs/profile')
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p>Redirecting to profile...</p>
  </div>
</template>
