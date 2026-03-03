<script setup lang="ts">
interface PaymentMethod {
  method: string;
  amount: number;
  percentage: number;
}

interface Props {
  methods: PaymentMethod[];
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
    <h3 class="mb-4 text-lg font-semibold">วิธีการชำระเงิน</h3>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        v-for="payment in methods"
        :key="payment.method"
        class="p-4 text-center bg-gray-50 rounded-lg"
      >
        <p class="font-medium text-gray-900">{{ payment.method }}</p>
        <p class="text-lg font-bold text-blue-600">{{ formatCurrency(payment.amount) }}</p>
        <p class="text-sm text-gray-600">{{ payment.percentage }}%</p>
      </div>
    </div>
  </div>
</template>
