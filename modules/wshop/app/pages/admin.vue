<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// This file acts as a wrapper for all /admin routes
// and applies the 'admin' layout to them.
definePageMeta({
  layout: 'admin',
});
</script>
