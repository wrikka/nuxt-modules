<template>
  <div>
    <h1>Edit Store</h1>
    <p>Editing store with ID: {{ $route.params.id }}</p>
        <div v-if="loading">
      <p>Loading store details...</p>
    </div>
    <AdminStoresStoreForm v-else :store="store || undefined" @submit="handleSave" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { store, loading, fetchStore } = useStores();
const storeId = Number(route.params.id);

onMounted(() => {
  if (storeId) {
    fetchStore(storeId);
  }
});

const handleSave = (formData: Record<string, unknown>) => {
  console.log('Saving store:', storeId, formData);
  // Here you would typically call an API to save the data
  alert('Store saved!');
};
</script>
