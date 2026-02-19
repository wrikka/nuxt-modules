<script setup>
import { useFetch, definePageMeta } from "#imports";
definePageMeta({
  // TODO: Add middleware to protect this route and ensure user is logged in
  // middleware: ['auth'] 
});
const { data: products, pending, error } = await useFetch("/api/account/downloads");
const handleDownload = async (productId, fileId) => {
  try {
    const response = await $fetch(`/api/products/${productId}/download/${fileId}`);
    window.open(response.downloadUrl, "_blank");
  } catch (err) {
    console.error("Download failed:", err);
    alert("Failed to initiate download. Please try again.");
  }
};
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">My Downloads</h1>

    <div v-if="pending">
      <p>Loading your downloadable products...</p>
    </div>
    <div v-else-if="error">
      <p class="text-red-500">Could not load your downloads. Please try again later.</p>
    </div>
    <div v-else-if="!products || products.length === 0">
      <div class="text-center py-12 bg-white rounded-lg shadow-md">
        <p class="text-xl text-gray-600">You haven't purchased any digital products yet.</p>
        <NuxtLink to="/" class="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Explore Products
        </NuxtLink>
      </div>
    </div>
    <div v-else class="space-y-6">
      <div v-for="product in products" :key="product.id" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">{{ product.name }}</h2>
        <ul class="space-y-2">
          <li v-for="file in product.digitalFiles" :key="file.id" class="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span>{{ file.fileName }}</span>
            <button @click="handleDownload(product.id, file.id)" class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm">
              Download
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
