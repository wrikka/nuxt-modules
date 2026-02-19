<script setup>
import { definePageMeta, createError } from "#imports";
import { useProductEditor } from "~/composables/useProductEditor";
import ProductOptionsManager from "~/components/admin/products/ProductOptionsManager.vue";
import ProductVariantsManager from "~/components/admin/products/ProductVariantsManager.vue";
definePageMeta({ layout: "admin" });
const { product, pending, error, refreshProduct, saveProduct, productId } = useProductEditor();
if (error.value && error.value.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: "Product not found", fatal: true });
}
const handleBasicInfoSave = async () => {
  if (!product.value) return;
  await saveProduct();
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Edit Product</h1>
      <NuxtLink to="/admin/products" class="text-gray-600 hover:underline">Back to Products</NuxtLink>
    </div>

    <div v-if="pending">
      <p>Loading...</p>
    </div>

    <div v-else-if="error || !product">
        <p class="text-red-500">Could not load product data. Please try again.</p>
    </div>

    <div v-else class="space-y-8">
        <!-- Basic Info Form -->
        <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">Basic Information</h3>
            <div class="space-y-4">
                <div>
                    <label for="product-name" class="block text-sm font-medium text-gray-700">Product Name</label>
                    <input id="product-name" v-model="product.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div>
                    <label for="product-description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="product-description" v-model="product.description" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                </div>
                 <div>
                    <label for="product-price" class="block text-sm font-medium text-gray-700">Default Price (if no variants)</label>
                    <input id="product-price" v-model="product.price" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                </div>
            </div>
            <button @click="handleBasicInfoSave" class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Save Basic Info
            </button>
        </div>

        <!-- Options Manager -->
        <ProductOptionsManager 
            :product-id="productId" 
            :options="product.options || []" 
            @update:options="refreshProduct"
        />

        <!-- Variants Manager -->
        <ProductVariantsManager 
            :product-id="productId" 
            :options="product.options || []" 
            :variants="product.variants || []"
            @update:variants="refreshProduct"
        />
    </div>
  </div>
</template>
