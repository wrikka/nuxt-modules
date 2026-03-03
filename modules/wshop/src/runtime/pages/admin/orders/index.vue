<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Order Management</h1>

    <AdminOrdersLoading v-if="pending" />
    <AdminOrdersError v-else-if="error" :error="error" />
    <OrdersTable v-else :orders="orders" />
  </div>
</template>

<script setup lang="ts">
import OrdersTable from '~/components/admin/orders/OrdersTable.vue';
import AdminOrdersLoading from '~/components/admin/orders/AdminOrdersLoading.vue';
import AdminOrdersError from '~/components/admin/orders/AdminOrdersError.vue';

import type { Order } from '#shared/types';

// Note: The API endpoint /api/orders needs to be updated to handle GET requests.
const { data: orders, pending, error } = await useFetch<Order[]>('/api/orders', { default: () => [] });
</script>
