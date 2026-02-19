<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 p-4 border rounded-lg">
    <div>
      <label for="store-name" class="block text-sm font-medium text-gray-700">Store Name</label>
      <input type="text" id="store-name" v-model="formData.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div>
      <label for="store-location" class="block text-sm font-medium text-gray-700">Location</label>
      <input type="text" id="store-location" v-model="formData.location" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="flex justify-end">
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Store</button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  store: { type: [Object, null], required: false }
});
const emit = defineEmits(["submit"]);
const formData = ref({
  name: "",
  location: ""
});
watch(() => props.store, (newStore) => {
  if (newStore) {
    formData.value.name = newStore.name;
    formData.value.location = newStore.location;
  } else {
    formData.value.name = "";
    formData.value.location = "";
  }
}, { immediate: true });
const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>
