<script setup lang="ts">
import { ref } from 'vue';

const selectedCurrency = ref('USD');
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
];

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  THB: 35.5,
};

const amounts = ref([
  { label: 'Commission', value: 100 },
  { label: 'Reward', value: 50 },
  { label: 'Payout', value: 200 },
]);

function formatAmount(value: number, currency: string): string {
  const rate = exchangeRates[currency as keyof typeof exchangeRates] || 1;
  const converted = value * rate;
  const symbol = currencies.find((c) => c.code === currency)?.symbol || '$';
  return `${symbol}${converted.toFixed(2)}`;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Multi-Currency Support</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Select Currency</h2>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          v-for="currency in currencies"
          :key="currency.code"
          class="p-4 rounded-lg border-2 text-center transition-colors"
          :class="selectedCurrency === currency.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
          @click="selectedCurrency = currency.code"
        >
          <div class="text-2xl mb-1">{{ currency.symbol }}</div>
          <div class="text-sm font-medium">{{ currency.code }}</div>
          <div class="text-xs text-gray-500">{{ currency.name }}</div>
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Amounts in {{ selectedCurrency }}</h2>

      <div class="space-y-3">
        <div
          v-for="amount in amounts"
          :key="amount.label"
          class="flex justify-between items-center p-3 bg-gray-50 rounded"
        >
          <span class="font-medium">{{ amount.label }}</span>
          <span class="text-xl font-bold text-blue-600">{{ formatAmount(amount.value, selectedCurrency) }}</span>
        </div>
      </div>

      <div class="mt-4 p-4 bg-yellow-50 rounded">
        <h3 class="font-semibold text-yellow-800 mb-2">Exchange Rate Information</h3>
        <p class="text-sm text-yellow-700">
          Exchange rates are updated daily. All commissions and rewards will be calculated in your selected currency.
        </p>
      </div>
    </div>
  </div>
</template>
