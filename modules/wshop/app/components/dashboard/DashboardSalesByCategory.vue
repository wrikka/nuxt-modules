<script setup lang="ts">
interface CategorySale {
  category: string;
  sales: number;
  percentage: number;
}

interface Props {
  sales: CategorySale[];
}

defineProps<Props>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount);
};
</script>

<template>
  <div class="p-6 bg-white border rounded-lg shadow-sm">
    <h3 class="mb-4 text-lg font-semibold">ยอดขายตามหมวดหมู่</h3>
    <div class="space-y-3">
      <div
        v-for="category in sales"
        :key="category.category"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-900">{{ category.category }}</span>
          <span class="text-sm text-gray-600">{{ formatCurrency(category.sales) }}</span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full">
          <div 
            class="h-2 bg-blue-600 rounded-full"
            :style="{ width: `${category.percentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
