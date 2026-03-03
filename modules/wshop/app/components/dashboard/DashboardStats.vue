<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard 
      v-for="stat in stats" 
      :key="stat.name" 
      :stat="stat" 
    />
  </section>
</template>

<script setup lang="ts">
import type { Stat } from '~~/shared/types';

defineProps<{
  stats: Stat[];
}>();
</script>
