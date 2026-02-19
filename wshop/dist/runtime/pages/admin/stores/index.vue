<template>
  <div>
    <h1>Multi-Store Management</h1>
    <p>This is where you'll manage all your stores.</p>
        <AdminStoresStoreFilters @update:filter="handleFilterUpdate" />
    <div v-if="loading">
      <p>Loading stores...</p>
    </div>
    <AdminStoresStoreList v-else :stores="filteredStores" />
  </div>
</template>

<script setup>
const { stores, loading, fetchStores } = useStores();
onMounted(fetchStores);
const filters = ref({ search: "" });
const handleFilterUpdate = (newFilters) => {
  filters.value = newFilters;
};
const filteredStores = computed(() => {
  if (!filters.value.search) {
    return stores.value;
  }
  return stores.value.filter(
    (store) => store.name.toLowerCase().includes(filters.value.search.toLowerCase())
  );
});
onMounted(() => {
  fetchStores();
});
</script>
