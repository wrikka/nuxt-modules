<template>
  <div class="p-4">
    <AtomsSkeleton :rows="10" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  rows: { type: Number, default: 3 },
})
</script>
