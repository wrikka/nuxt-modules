<script setup lang="ts">
import type { Subscription } from '#wpayment/types';

interface Props {
  subscriptions: Subscription[];
  loading?: boolean;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
});

const emit = defineEmits<{
  cancel: [subscription: Subscription];
  pause: [subscription: Subscription];
  resume: [subscription: Subscription];
  update: [subscription: Subscription];
}>();

const formatAmount = (sub: Subscription) => {
  const price = sub.items.data[0]?.price;
  if (!price) return 'N/A';
  const amount = price.unit_amount || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
  }).format(amount / 100);
};

const getInterval = (sub: Subscription) => {
  const price = sub.items.data[0]?.price;
  if (!price?.recurring) return 'one-time';
  const interval = price.recurring.interval;
  const count = price.recurring.interval_count || 1;
  return count > 1 ? `every ${count} ${interval}s` : `per ${interval}`;
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    past_due: 'text-red-600 bg-red-100',
    canceled: 'text-gray-600 bg-gray-100',
    incomplete: 'text-yellow-600 bg-yellow-100',
    incomplete_expired: 'text-gray-600 bg-gray-100',
    trialing: 'text-blue-600 bg-blue-100',
    unpaid: 'text-red-600 bg-red-100',
    paused: 'text-orange-600 bg-orange-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

const isPaused = (sub: Subscription) => {
  return sub.pause_collection !== null && sub.pause_collection !== undefined;
};
</script>

<template>
  <div class="stripe-subscription-list">
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="subscriptions.length === 0" class="text-center py-8 text-gray-500">
      No subscriptions found
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="sub in subscriptions"
        :key="sub.id"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium text-lg">
              {{ sub.items.data[0]?.price?.product?.name || 'Subscription' }}
            </h3>
            <p class="text-gray-600">
              {{ formatAmount(sub) }} {{ getInterval(sub) }}
            </p>
          </div>
          <span :class="['px-2 py-1 rounded text-xs font-medium', getStatusColor(isPaused(sub) ? 'paused' : sub.status)]">
            {{ isPaused(sub) ? 'paused' : sub.status }}
          </span>
        </div>

        <div class="mt-3 text-sm text-gray-500">
          <p v-if="sub.current_period_end">
            Next billing: {{ formatDate(sub.current_period_end) }}
          </p>
          <p v-if="sub.trial_end && sub.status === 'trialing'">
            Trial ends: {{ formatDate(sub.trial_end) }}
          </p>
        </div>

        <div v-if="showActions" class="mt-4 flex gap-2">
          <button
            v-if="sub.status === 'active' && !isPaused(sub)"
            class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            @click="emit('pause', sub)"
          >
            Pause
          </button>
          <button
            v-if="isPaused(sub)"
            class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            @click="emit('resume', sub)"
          >
            Resume
          </button>
          <button
            class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            @click="emit('update', sub)"
          >
            Update
          </button>
          <button
            v-if="sub.status !== 'canceled'"
            class="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50"
            @click="emit('cancel', sub)"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
