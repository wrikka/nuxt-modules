<script setup lang="ts">
import { ref } from 'vue';

interface Redemption {
  id: string;
  reward: string;
  type: 'points' | 'credits' | 'cash' | 'discount';
  amount: number;
  redeemedAt: Date;
  status: 'completed' | 'pending' | 'failed';
}

const history = ref<Redemption[]>([
  {
    id: '1',
    reward: 'Amazon Gift Card',
    type: 'cash',
    amount: 5000,
    redeemedAt: new Date('2024-02-17'),
    status: 'completed',
  },
  {
    id: '2',
    reward: 'Premium Subscription',
    type: 'credits',
    amount: 3000,
    redeemedAt: new Date('2024-02-15'),
    status: 'completed',
  },
  {
    id: '3',
    reward: 'Product Discount',
    type: 'discount',
    amount: 2000,
    redeemedAt: new Date('2024-02-10'),
    status: 'completed',
  },
  {
    id: '4',
    reward: 'Exclusive Access',
    type: 'points',
    amount: 10000,
    redeemedAt: new Date('2024-02-05'),
    status: 'pending',
  },
]);

const totalRedeemed = computed(() => history.value.filter((h) => h.status === 'completed').reduce((sum, h) => sum + h.amount, 0));
const totalPending = computed(() => history.value.filter((h) => h.status === 'pending').reduce((sum, h) => sum + h.amount, 0));
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Redemption History</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Redeemed</div>
        <div class="text-2xl font-bold text-green-600">{{ totalRedeemed }} pts</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Pending</div>
        <div class="text-2xl font-bold text-yellow-600">{{ totalPending }} pts</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Redemption History</h2>
      <div class="space-y-3">
        <div
          v-for="item in history"
          :key="item.id"
          class="p-4 rounded-lg border border-gray-200"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold">{{ item.reward }}</h3>
              <div class="text-sm text-gray-500">{{ new Date(item.redeemedAt).toLocaleString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold text-blue-600">{{ item.amount }} {{ item.type }}</div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-800': item.status === 'completed',
                  'bg-yellow-100 text-yellow-800': item.status === 'pending',
                  'bg-red-100 text-red-800': item.status === 'failed',
                }"
              >
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
