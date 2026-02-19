<script setup lang="ts">
import { ref, computed } from 'vue';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  points: number;
  category: string;
  image: string;
  available: boolean;
}

const rewards = ref<RewardItem[]>([
  {
    id: '1',
    name: 'Amazon Gift Card',
    description: '$50 Amazon gift card',
    points: 5000,
    category: 'Gift Cards',
    image: '🎁',
    available: true,
  },
  {
    id: '2',
    name: 'Premium Subscription',
    description: '1 month premium subscription',
    points: 3000,
    category: 'Subscriptions',
    image: '⭐',
    available: true,
  },
  {
    id: '3',
    name: 'Product Discount',
    description: '20% off on all products',
    points: 2000,
    category: 'Discounts',
    image: '🏷️',
    available: true,
  },
  {
    id: '4',
    name: 'Exclusive Access',
    description: 'Access to premium features',
    points: 10000,
    category: 'Access',
    image: '🔐',
    available: true,
  },
]);

const selectedCategory = ref('All');
const categories = computed(() => ['All', ...new Set(rewards.value.map((r) => r.category))]);

const filteredRewards = computed(() => {
  if (selectedCategory.value === 'All') return rewards.value;
  return rewards.value.filter((r) => r.category === selectedCategory.value);
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Marketplace</h1>

    <div class="mb-6">
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="category in categories"
          :key="category"
          class="px-4 py-2 rounded-lg"
          :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="reward in filteredRewards"
        :key="reward.id"
        class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
      >
        <div class="text-4xl mb-3">{{ reward.image }}</div>
        <h3 class="font-semibold mb-2">{{ reward.name }}</h3>
        <p class="text-sm text-gray-600 mb-3">{{ reward.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ reward.category }}</span>
          <span class="font-bold text-blue-600">{{ reward.points }} pts</span>
        </div>
        <button
          class="w-full mt-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          :disabled="!reward.available"
        >
          {{ reward.available ? 'Redeem' : 'Out of Stock' }}
        </button>
      </div>
    </div>
  </div>
</template>
