<script setup lang="ts">
import type { ProductOption, ProductVariant } from '~/shared/types/product';
import { useProductVariants } from '~/composables/useProductVariants';

const props = defineProps<{ 
  productId: string;
  options: ProductOption[];
  variants: ProductVariant[];
}>();

const emit = defineEmits(['update:variants']);

// Use the composable to get the generated variants
const { options, variants } = toRefs(props);
const { displayVariants } = useProductVariants(options, variants);

// Create a local, mutable copy for editing
const localVariants = ref(JSON.parse(JSON.stringify(displayVariants.value)));

// Keep the local copy in sync with the computed property from the composable
watch(displayVariants, (newValue) => {
  localVariants.value = JSON.parse(JSON.stringify(newValue));
}, { deep: true });

const handleSave = () => {
  // Emit the locally edited variants to the parent component
  emit('update:variants', localVariants.value);
  // In a real app, you might show a success notification here
  alert('Variants updated and emitted to parent!');
};

</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md mt-8">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">Variants</h3>
        <button @click="handleSave" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Variants</button>
    </div>

    <div v-if="displayVariants.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="option in options" :key="option.id" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ option.name }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="variant in localVariants" :key="variant.id">
            <td v-for="option in options" :key="option.id" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ variant.options[option.name] }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="text" v-model="variant.price" class="w-24 rounded-md border-gray-300 shadow-sm">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="number" v-model="variant.stock" class="w-20 rounded-md border-gray-300 shadow-sm">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <input type="text" v-model="variant.sku" class="w-32 rounded-md border-gray-300 shadow-sm">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500">Add product options to create variants.</p>
  </div>
</template>
