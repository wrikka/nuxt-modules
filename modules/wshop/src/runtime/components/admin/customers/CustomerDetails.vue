<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold">{{ customer.name }}</h1>
    <p class="text-gray-600">{{ customer.email }}</p>
    <p class="text-gray-600">{{ customer.phone || 'No phone number' }}</p>
    <p class="text-sm text-gray-500 mt-2">Customer since {{ formatDate(customer.createdAt) }}</p>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/shared/utils';
import type { Customer } from '~~/shared/types';

defineProps<{
  customer: Customer;
}>();
</script>
