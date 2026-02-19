<script setup>
defineProps({
  products: { type: Array, required: true }
});
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB"
  }).format(amount);
};
</script>

<template>
  <div class="p-6 bg-white border rounded-lg shadow-sm">
    <h3 class="mb-4 text-lg font-semibold">สินค้าขายดี</h3>
    <div class="space-y-3">
      <div
        v-for="(product, index) in products"
        :key="product.name"
        class="flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 mr-3 text-sm font-medium bg-gray-100 rounded-full">
            {{ index + 1 }}
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ product.name }}</p>
            <p class="text-sm text-gray-600">{{ product.quantity }} ชิ้น</p>
          </div>
        </div>
        <div class="text-right">
          <p class="font-medium text-gray-900">{{ formatCurrency(product.sales) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
