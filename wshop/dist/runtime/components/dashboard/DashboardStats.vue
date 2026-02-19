<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
      v-for="stat in stats" 
      :key="stat.name" 
      :stat="stat" 
    />
  </section>
</template>

<script setup>
defineProps({
  stats: { type: Array, required: true }
});
</script>
