<script setup lang="ts">
import { ref } from 'vue';

interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
}

const categories = ref<Category[]>([
  { id: '1', name: 'Gift Cards', icon: '🎁', itemCount: 25 },
  { id: '2', name: 'Subscriptions', icon: '⭐', itemCount: 15 },
  { id: '3', name: 'Discounts', icon: '🏷️', itemCount: 30 },
  { id: '4', name: 'Products', icon: '📦', itemCount: 20 },
  { id: '5', name: 'Experiences', icon: '🎪', itemCount: 10 },
  { id: '6', name: 'Digital Content', icon: '💻', itemCount: 18 },
]);

const selectedCategory = ref('All');
const allCategories = computed(() => ['All', ...categories.value.map((c) => c.name)]);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Marketplace Categories</h1>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <button
        v-for="category in allCategories"
        :key="category"
        class="p-4 rounded-lg text-center transition-colors"
        :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-white shadow hover:shadow-lg'"
        @click="selectedCategory = category"
      >
        <div class="text-3xl mb-2">
          {{ category === 'All' ? '🏪' : categories.find((c) => c.name === category)?.icon }}
        </div>
        <div class="text-sm font-medium">{{ category }}</div>
        <div v-if="category !== 'All'" class="text-xs opacity-75">
          {{ categories.find((c) => c.name === category)?.itemCount }} items
        </div>
      </button>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Category: {{ selectedCategory }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 6"
          :key="i"
          class="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
        >
          <div class="text-4xl mb-2">🎁</div>
          <h3 class="font-semibold mb-1">Reward Item {{ i }}</h3>
          <p class="text-sm text-gray-600 mb-2">Description for this reward item</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ selectedCategory }}</span>
            <span class="font-bold text-blue-600">{{ (i * 1000) }} pts</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-green-50 rounded">
      <h3 class="font-semibold text-green-800 mb-2">Category Management</h3>
      <p class="text-sm text-green-700">
        Organize rewards into categories for better user experience. Users can easily find what they're looking for and discover new rewards.
      </p>
    </div>
  </div>
</template>
