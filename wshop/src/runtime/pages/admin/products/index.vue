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

<script setup lang="ts">
import ProductsTable from '~/components/admin/products/ProductsTable.vue';
import AdminProductsLoading from '~/components/admin/products/AdminProductsLoading.vue';
import AdminProductsError from '~/components/admin/products/AdminProductsError.vue';

import type { Product } from '#shared/types';

const { data: products, pending, error } = await useFetch<Product[]>('/api/products', { default: () => [] });
</script>
