<script setup>
import AdminDashboardLoading from "~/components/admin/AdminDashboardLoading.vue";
import AdminDashboardError from "~/components/admin/AdminDashboardError.vue";
import AdminStatCard from "~/components/admin/AdminStatCard.vue";
const { data: summary, pending, error } = await useFetch("/api/analytics/summary");
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

    <AdminDashboardLoading v-if="pending" />
    <AdminDashboardError v-else-if="error" :error="error" />

    <!-- Stats Cards -->
    <div v-else-if="summary" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AdminStatCard title="Total Revenue" :value="`$${summary.totalRevenue.toFixed(2)}`" />
      <AdminStatCard title="Total Orders" :value="summary.totalOrders" />
      <AdminStatCard title="Total Customers" :value="summary.totalCustomers" />
      <AdminStatCard title="Average Order Value" :value="`$${summary.averageOrderValue.toFixed(2)}`" />
    </div>

    <!-- TODO: Add charts for recent sales -->

  </div>
</template>
