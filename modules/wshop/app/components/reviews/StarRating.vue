<template>
  <div class="flex items-center">
    <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-5 h-5" :class="i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ rating: number }>();
</script>
