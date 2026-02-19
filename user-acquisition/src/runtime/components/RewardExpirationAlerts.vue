<script setup lang="ts">
import { ref } from 'vue';

interface ExpiringReward {
  id: string;
  name: string;
  amount: number;
  expiresAt: Date;
  daysLeft: number;
}

const expiringRewards = ref<ExpiringReward[]>([
  {
    id: '1',
    name: 'Amazon Gift Card',
    amount: 5000,
    expiresAt: new Date('2024-02-24'),
    daysLeft: 7,
  },
  {
    id: '2',
    name: 'Premium Subscription',
    amount: 3000,
    expiresAt: new Date('2024-02-20'),
    daysLeft: 3,
  },
  {
    id: '3',
    name: 'Product Discount',
    amount: 2000,
    expiresAt: new Date('2024-02-18'),
    daysLeft: 1,
  },
]);

const alertSettings = ref({
  email: true,
  push: true,
  sms: false,
  advanceDays: 7,
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Expiration Alerts</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Expiring Rewards</h2>

      <div class="space-y-3">
        <div
          v-for="reward in expiringRewards"
          :key="reward.id"
          class="p-4 rounded-lg border"
          :class="{
            'border-red-300 bg-red-50': reward.daysLeft <= 3,
            'border-yellow-300 bg-yellow-50': reward.daysLeft <= 7 && reward.daysLeft > 3,
            'border-blue-300 bg-blue-50': reward.daysLeft > 7,
          }"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ reward.name }}</h3>
              <p class="text-sm text-gray-600">{{ reward.amount }} points</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium" :class="{
                'text-red-600': reward.daysLeft <= 3,
                'text-yellow-600': reward.daysLeft <= 7 && reward.daysLeft > 3,
                'text-blue-600': reward.daysLeft > 7,
              }">
                {{ reward.daysLeft }} days left
              </div>
              <div class="text-xs text-gray-500">
                Expires: {{ new Date(reward.expiresAt).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Alert Settings</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span>Email Notifications</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="alertSettings.email" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <span>Push Notifications</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="alertSettings.push" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <span>SMS Notifications</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="alertSettings.sms" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Alert me days before expiration</label>
          <input v-model.number="alertSettings.advanceDays" type="number" min="1" max="30" class="w-full border rounded px-3 py-2">
        </div>
      </div>
    </div>
  </div>
</template>
