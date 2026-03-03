<template>
  <div class="relative">
    <select v-model="currency" @change="updateCurrency" class="border rounded px-3 py-2 text-sm">
      <option value="THB">THB ฿</option>
      <option value="USD">USD $</option>
      <option value="EUR">EUR €</option>
      <option value="GBP">GBP £</option>
      <option value="JPY">JPY ¥</option>
      <option value="CNY">CNY ¥</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const { currency, setCurrency } = useCurrency();

const updateCurrency = () => {
  setCurrency(currency.value);
};
</script>
