<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Product Customization Options</h1>
    <div class="flex justify-end mb-4">
      <button @click="showBuilder = true" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Create Option Set</button>
    </div>
    <AdminProductsCustomizationOptionSetList />
    <AdminProductsCustomizationOptionSetBuilder v-if="showBuilder" @submit="handleSave" @cancel="showBuilder = false" class="mt-6" />
  </div>
</template>

<script setup>
const showBuilder = ref(false);
const handleSave = (optionSetData) => {
  console.log("Saving option set:", optionSetData);
  showBuilder.value = false;
  alert("Option set saved!");
};
definePageMeta({
  layout: "admin"
});
</script>
