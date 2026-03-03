<script setup lang="ts">
import type { Refund } from '#wpayment/types';

interface Props {
  refunds: Refund[];
  loading?: boolean;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
});

const emit = defineEmits<{
  cancel: [refund: Refund];
}>();

const formatAmount = (refund: Refund) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: refund.currency,
  }).format(refund.amount / 100);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    succeeded: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    failed: 'text-red-600 bg-red-100',
    canceled: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};
</script>

<template>
  <div class="stripe-refund-list">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="refunds.length === 0" class="text-center py-8 text-gray-500">
      No refunds found
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="refund in refunds"
        :key="refund.id"
        class="border rounded-lg p-4"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium">{{ formatAmount(refund) }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(refund.created) }}</p>
            <p v-if="refund.reason" class="text-sm text-gray-500 mt-1">
              Reason: {{ refund.reason }}
            </p>
          </div>
          <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(refund.status)]">
            {{ refund.status }}
          </span>
        </div>

        <div v-if="showActions && refund.status === 'pending'" class="mt-3">
          <button
            class="text-sm text-red-600 hover:underline"
            @click="emit('cancel', refund)"
          >
            Cancel Refund
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
