<template>
  <div>
    <h2>Filters</h2>
    <!-- Add filter options for stores -->
        <input type="text" v-model="searchTerm" placeholder="Search stores..." class="p-2 border rounded" />
  </div>
</template>

<script setup lang="ts">
const searchTerm = ref('')
const emit = defineEmits(['update:filter'])

watch(searchTerm, (newValue) => {
  emit('update:filter', { search: newValue })
})
</script>
