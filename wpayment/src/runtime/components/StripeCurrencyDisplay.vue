<script setup lang="ts">
import { useCurrency } from '#wpayment/composables/useCurrency';

interface Props {
  amount: number;
  currency: string;
  showCode?: boolean;
  showSymbol?: boolean;
  locale?: string;
  format?: 'standard' | 'compact' | 'accounting';
}

const props = withDefaults(defineProps<Props>(), {
  showCode: false,
  showSymbol: true,
  locale: 'en-US',
  format: 'standard',
});

const { formatAmount } = useCurrency();

const formatted = computed(() => {
  const value = formatAmount(props.amount, props.currency);
  return value;
});
</script>

<template>
  <span class="stripe-currency-display">
    {{ formatted }}
    <span v-if="showCode" class="text-gray-500 text-sm ml-1">
      {{ currency.toUpperCase() }}
    </span>
  </span>
</template>
