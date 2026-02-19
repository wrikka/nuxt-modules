<template>
  <div>
    <h1>Edit Store</h1>
    <p>Editing store with ID: {{ $route.params.id }}</p>
        <div v-if="loading">
      <p>Loading store details...</p>
    </div>
    <AdminStoresStoreForm v-else :store="store || void 0" @submit="handleSave" />
  </div>
</template>

<script setup>
const route = useRoute();
const { store, loading, fetchStore } = useStores();
const storeId = Number(route.params.id);
onMounted(() => {
  if (storeId) {
    fetchStore(storeId);
  }
});
const handleSave = (formData) => {
  console.log("Saving store:", storeId, formData);
  alert("Store saved!");
};
</script>
