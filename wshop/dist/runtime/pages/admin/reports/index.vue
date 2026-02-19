<script setup>
import { definePageMeta } from "#imports";
import { useReports } from "~/composables/reports/useReports";
definePageMeta({ layout: "admin" });
const {
  summary,
  topProducts,
  customerStats,
  summaryPending,
  topProductsPending,
  customerStatsPending
} = useReports();
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Reports Dashboard</h1>

    <!-- Stat Cards Section -->
    <div v-if="summaryPending || customerStatsPending">
        <p>Loading stats...</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Sales Summary -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">Total Sales</h3>
        <p class="text-3xl font-bold mt-2">{{ formatCurrency(summary?.totalSales || 0) }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">Total Orders</h3>
        <p class="text-3xl font-bold mt-2">{{ summary?.totalOrders || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">Avg. Order Value</h3>
        <p class="text-3xl font-bold mt-2">{{ formatCurrency(summary?.averageOrderValue || 0) }}</p>
      </div>
      <!-- Customer Stats -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">Total Customers</h3>
        <p class="text-3xl font-bold mt-2">{{ customerStats?.totalCustomers || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">New Customers</h3>
        <p class="text-3xl font-bold mt-2">{{ customerStats?.newCustomers || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-medium text-gray-500">Returning Customers</h3>
        <p class="text-3xl font-bold mt-2">{{ customerStats?.returningCustomers || 0 }}</p>
      </div>
    </div>

    <!-- Top Products Section -->
    <div class="bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold p-6 border-b">Top Selling Products</h2>
        <div v-if="topProductsPending">
            <p class="p-6">Loading top products...</p>
        </div>
        <div v-else-if="!topProducts || topProducts.length === 0">
            <p class="p-6 text-gray-500">No sales data available to determine top products.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sold</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in topProducts" :key="product.productId">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.productName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{{ product.totalSold }}</td>
            </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>
