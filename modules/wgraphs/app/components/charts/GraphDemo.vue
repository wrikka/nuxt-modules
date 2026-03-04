<script setup lang="ts">
const sampleData = [
  { label: 'A', value: 30 },
  { label: 'B', value: 50 },
  { label: 'C', value: 40 },
  { label: 'D', value: 70 },
  { label: 'E', value: 20 }
]
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">WGraphs Demo</h1>
    <div class="grid grid-cols-2 gap-8">
      <WGraphBar :data="sampleData" :width="400" :height="300" />
      <WGraphLine :data="sampleData.map(d => ({ x: d.label, y: d.value }))" :width="400" :height="300" />
    </div>
  </div>
</template>
