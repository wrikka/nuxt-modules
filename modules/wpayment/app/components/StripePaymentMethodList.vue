<script setup lang="ts">
import type { PaymentMethodDetails } from '#wpayment/types';

interface Props {
  paymentMethods: PaymentMethodDetails[];
  loading?: boolean;
  selectedId?: string;
  showAdd?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showAdd: true,
});

const emit = defineEmits<{
  select: [method: PaymentMethodDetails];
  delete: [method: PaymentMethodDetails];
  setDefault: [method: PaymentMethodDetails];
  add: [];
}>();

const getCardIcon = (brand: string) => {
  const icons: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
  };
  return icons[brand.toLowerCase()] || '💳';
};

const formatExpiry = (expMonth: number, expYear: number) => {
  return `${String(expMonth).padStart(2, '0')}/${String(expYear).slice(-2)}`;
};

const isExpired = (expMonth: number, expYear: number) => {
  const now = new Date();
  const expiry = new Date(expYear, expMonth - 1);
  return expiry < now;
};
</script>

<template>
  <div class="stripe-payment-method-list">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else>
      <div v-if="paymentMethods.length === 0" class="text-center py-8 text-gray-500">
        No payment methods added
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="method in paymentMethods"
          :key="method.id"
          :class="[
            'border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all',
            selectedId === method.id ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300',
          ]"
          @click="emit('select', method)"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ getCardIcon(method.card?.brand || '') }}</span>
            <div>
              <p class="font-medium">
                {{ method.card?.brand?.toUpperCase() || 'Card' }} •••• {{ method.card?.last4 }}
              </p>
              <p class="text-sm text-gray-500">
                Expires {{ formatExpiry(method.card?.exp_month || 0, method.card?.exp_year || 0) }}
                <span v-if="isExpired(method.card?.exp_month || 0, method.card?.exp_year || 0)" class="text-red-500 ml-2">
                  (Expired)
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              v-if="method.is_default"
              class="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
            >
              Default
            </span>
            <div class="relative group">
              <button class="p-1 hover:bg-gray-100 rounded" @click.stop>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <div class="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  v-if="!method.is_default"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                  @click.stop="emit('setDefault', method)"
                >
                  Set as default
                </button>
                <button
                  class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  @click.stop="emit('delete', method)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="showAdd"
        class="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors"
        @click="emit('add')"
      >
        + Add payment method
      </button>
    </div>
  </div>
</template>
