<template>
  <div class="p-8">
    <AdminPageHeader :title="customer ? customer.name || 'Customer' : 'Customer'">
      <template #actions>
        <NuxtLink to="/admin/customers" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Back to Customers</NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="pending">Loading customer details...</div>
    <div v-else-if="error" class="text-red-500">Error loading customer: {{ error.message }}</div>

    <div v-else-if="customer" class="space-y-8">
      <AdminCard title="Customer Details">
        <CustomerDetails :customer="customer" />
      </AdminCard>
      <AdminCard title="Order History">
        <CustomerOrders :customer-id="customerId" :orders="customer?.orders || []" />
      </AdminCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomerDetails from '~/components/admin/customers/CustomerDetails.vue';
import CustomerOrders from '~/components/admin/customers/CustomerOrders.vue';
import AdminPageHeader from '~/components/admin/ui/AdminPageHeader.vue';
import AdminCard from '~/components/admin/ui/AdminCard.vue';

const route = useRoute();
const customerId = route.params.id as string;

import type { Customer } from '#shared/types';

const { data: customer, pending, error } = await useFetch<Customer>(`/api/customers/${customerId}`);
</script>
