<script setup>
const props = defineProps({
  productId: { type: String, required: true },
  options: { type: Array, required: true }
});
const emit = defineEmits(["update:options"]);
const newOption = ref({
  name: "",
  displayType: "button",
  values: JSON.stringify([{ label: "Small", value: "S" }, { label: "Medium", value: "M" }], null, 2)
});
const addOption = async () => {
  if (!newOption.value.name || !newOption.value.values) return;
  let parsedValues;
  try {
    parsedValues = JSON.parse(newOption.value.values);
  } catch (e) {
    alert("Invalid JSON format for option values.");
    return;
  }
  try {
    await $fetch(`/api/products/${props.productId}/options`, {
      method: "POST",
      body: {
        name: newOption.value.name,
        displayType: newOption.value.displayType,
        values: parsedValues
      }
    });
    newOption.value = {
      name: "",
      displayType: "button",
      values: JSON.stringify([{ label: "Small", value: "S" }, { label: "Medium", value: "M" }], null, 2)
    };
    emit("update:options");
  } catch (error) {
    console.error("Failed to add option:", error);
    alert("Failed to add option.");
  }
};
const deleteOption = async (optionId) => {
  if (!confirm("Are you sure? This will affect all related variants.")) return;
  try {
    await $fetch(`/api/products/${props.productId}/options`, {
      method: "DELETE",
      body: { optionId }
    });
    emit("update:options");
  } catch (error) {
    console.error("Failed to delete option:", error);
    alert("Failed to delete option.");
  }
};
const formatOptionValues = (values) => {
  if (!Array.isArray(values)) return "";
  return values.map((v) => v.label).join(", ");
};
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md mt-8">
    <h3 class="text-xl font-bold mb-4">Product Options</h3>

    <div v-if="options.length > 0" class="space-y-4 mb-6">
      <div v-for="option in options" :key="option.id" class="p-3 bg-gray-50 rounded border">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">{{ option.name }} <span class="text-xs text-gray-500 font-normal">({{ option.displayType }})</span></p>
            <p class="text-sm text-gray-600">{{ formatOptionValues(option.values) }}</p>
          </div>
          <div>
            <button @click="deleteOption(option.id)" class="text-red-500 hover:text-red-700 text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-500 mb-4">No options yet. Add one to create variants.</p>

    <form @submit.prevent="addOption" class="border-t pt-4">
      <h4 class="font-semibold mb-2">Add a new option</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="option-name" class="block text-sm font-medium text-gray-700">Option Name</label>
          <input id="option-name" v-model="newOption.name" type="text" placeholder="e.g., Size" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label for="option-display-type" class="block text-sm font-medium text-gray-700">Display Type</label>
          <select id="option-display-type" v-model="newOption.displayType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="button">Button</option>
            <option value="dropdown">Dropdown</option>
            <option value="swatch">Color Swatch</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label for="option-values" class="block text-sm font-medium text-gray-700">Option Values (JSON format)</label>
        <textarea id="option-values" v-model="newOption.values" rows="5" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono text-sm"></textarea>
        <p class="text-xs text-gray-500 mt-1">Use format: [{"label": "Red", "value": "#ff0000"}]</p>
      </div>
      <button type="submit" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Option
      </button>
    </form>
  </div>
</template>
