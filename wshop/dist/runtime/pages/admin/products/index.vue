<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Product Management</h1>

    <div class="flex justify-end mb-4">
      <NuxtLink to="/admin/products/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Product
      </NuxtLink>
    </div>

    <AdminProductsLoading v-if="pending" />
    <AdminProductsError v-else-if="error" :error="error" />
    <ProductsTable v-else :products="products" />
  </div>
</template>

<script setup>
import ProductsTable from "~/components/admin/products/ProductsTable.vue";
import AdminProductsLoading from "~/components/admin/products/AdminProductsLoading.vue";
import AdminProductsError from "~/components/admin/products/AdminProductsError.vue";
const { data: products, pending, error } = await useFetch("/api/products", { default: () => [] });
</script>
