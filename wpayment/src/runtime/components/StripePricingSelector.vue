<script setup lang="ts">
import type { PricingTier } from '#wpayment/types';

interface Props {
  tiers: PricingTier[];
  loading?: boolean;
  selectedTierId?: string;
  showAnnual?: boolean;
  annualDiscount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAnnual: false,
  annualDiscount: 0.2,
});

const emit = defineEmits<{
  select: [tier: PricingTier];
}>();

const isAnnual = ref(false);

const getPrice = (tier: PricingTier) => {
  const price = isAnnual.value && props.showAnnual
    ? tier.price * (1 - props.annualDiscount)
    : tier.price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: tier.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100);
};

const getIntervalLabel = (tier: PricingTier) => {
  if (!tier.interval) return '';
  if (isAnnual.value && props.showAnnual) return '/year';
  return tier.interval === 'month' ? '/mo' : tier.interval === 'year' ? '/yr' : '';
};

const selectTier = (tier: PricingTier) => {
  emit('select', tier);
};
</script>

<template>
  <div class="stripe-pricing-selector">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <div v-if="showAnnual" class="flex justify-center mb-6">
        <div class="inline-flex rounded-lg border p-1">
          <button
            :class="['px-4 py-2 rounded-md text-sm', !isAnnual ? 'bg-primary text-white' : '']"
            @click="isAnnual = false"
          >
            Monthly
          </button>
          <button
            :class="['px-4 py-2 rounded-md text-sm', isAnnual ? 'bg-primary text-white' : '']"
            @click="isAnnual = true"
          >
            Annual
            <span v-if="annualDiscount > 0" class="ml-1 text-xs opacity-80">
              ({{ Math.round(annualDiscount * 100) }}% off)
            </span>
          </button>
        </div>
      </div>

      <div class="grid gap-6" :class="tiers.length > 3 ? 'md:grid-cols-4' : 'md:grid-cols-3'">
        <div
          v-for="tier in tiers"
          :key="tier.id"
          :class="[
            'relative rounded-2xl border p-6 cursor-pointer transition-all',
            tier.highlighted ? 'border-primary ring-2 ring-primary' : 'border-gray-200',
            selectedTierId === tier.id ? 'bg-primary/5' : 'hover:border-gray-300',
          ]"
          @click="selectTier(tier)"
        >
          <div v-if="tier.badge" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              {{ tier.badge }}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-center">{{ tier.name }}</h3>
          <p v-if="tier.description" class="text-sm text-gray-500 text-center mt-1">
            {{ tier.description }}
          </p>

          <div class="mt-4 text-center">
            <span class="text-4xl font-bold">{{ getPrice(tier) }}</span>
            <span class="text-gray-500">{{ getIntervalLabel(tier) }}</span>
          </div>

          <ul class="mt-6 space-y-3">
            <li
              v-for="(feature, idx) in tier.features"
              :key="idx"
              class="flex items-start gap-2 text-sm"
            >
              <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <button
            :class="[
              'mt-6 w-full py-2 rounded-lg text-sm font-medium transition-colors',
              tier.highlighted
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'border border-primary text-primary hover:bg-primary/10',
            ]"
          >
            {{ selectedTierId === tier.id ? 'Selected' : 'Select' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
