<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Customer Management</h1>

    <AdminCustomersLoading v-if="pending" />
    <AdminCustomersError v-else-if="error" :error="error" />
    <CustomersTable v-else :customers="customers" />
  </div>
</template>

<script setup lang="ts">
import CustomersTable from '~/components/admin/customers/CustomersTable.vue';
import AdminCustomersLoading from '~/components/admin/customers/AdminCustomersLoading.vue';
import AdminCustomersError from '~/components/admin/customers/AdminCustomersError.vue';

import type { Customer } from '#shared/types';

// Note: The API endpoint /api/customers needs to be created.
const { data: customers, pending, error } = await useFetch<Customer[]>('/api/customers', { default: () => [] });
</script>
