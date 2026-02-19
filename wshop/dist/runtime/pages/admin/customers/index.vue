<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Customer Management</h1>

    <AdminCustomersLoading v-if="pending" />
    <AdminCustomersError v-else-if="error" :error="error" />
    <CustomersTable v-else :customers="customers" />
  </div>
</template>

<script setup>
import CustomersTable from "~/components/admin/customers/CustomersTable.vue";
import AdminCustomersLoading from "~/components/admin/customers/AdminCustomersLoading.vue";
import AdminCustomersError from "~/components/admin/customers/AdminCustomersError.vue";
const { data: customers, pending, error } = await useFetch("/api/customers", { default: () => [] });
</script>
