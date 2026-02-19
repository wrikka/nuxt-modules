<script setup lang="ts">
import { ref } from 'vue';

interface Tier {
  level: number;
  name: string;
  minRevenue: number;
  commissionRate: number;
  affiliates: number;
}

const tiers = ref<Tier[]>([
  { level: 1, name: 'Bronze', minRevenue: 0, commissionRate: 0.05, affiliates: 150 },
  { level: 2, name: 'Silver', minRevenue: 5000, commissionRate: 0.07, affiliates: 80 },
  { level: 3, name: 'Gold', minRevenue: 15000, commissionRate: 0.10, affiliates: 45 },
  { level: 4, name: 'Platinum', minRevenue: 30000, commissionRate: 0.12, affiliates: 20 },
  { level: 5, name: 'Diamond', minRevenue: 50000, commissionRate: 0.15, affiliates: 5 },
]);

const currentRevenue = ref(12000);
const currentTier = computed(() => {
  for (let i = tiers.value.length - 1; i >= 0; i--) {
    if (currentRevenue.value >= tiers.value[i].minRevenue) {
      return tiers.value[i];
    }
  }
  return tiers.value[0];
});

const nextTier = computed(() => {
  const currentIndex = tiers.value.findIndex((t) => t.level === currentTier.value.level);
  return tiers.value[currentIndex + 1] || null;
});

const progress = computed(() => {
  if (!nextTier.value) return 100;
  const currentMin = currentTier.value.minRevenue;
  const nextMin = nextTier.value.minRevenue;
  return ((currentRevenue.value - currentMin) / (nextMin - currentMin)) * 100;
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Commission Tiers</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Your Current Tier</h2>
      <div class="flex items-center gap-4 mb-4">
        <div class="text-4xl">🏆</div>
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ currentTier.name }}</div>
          <div class="text-sm text-gray-500">{{ currentTier.commissionRate * 100 }}% commission</div>
        </div>
      </div>
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span>Progress to {{ nextTier?.name || 'Max Tier' }}</span>
          <span>{{ progress.toFixed(1) }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
      <div class="text-sm text-gray-600">
        Current Revenue: ${{ currentRevenue.toLocaleString() }} / ${{ nextTier?.minRevenue.toLocaleString() || '∞' }}
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">All Tiers</h2>
      <div class="space-y-3">
        <div
          v-for="tier in tiers"
          :key="tier.level"
          class="flex items-center justify-between p-4 rounded-lg border"
          :class="{
            'border-blue-500 bg-blue-50': tier.level === currentTier.level,
            'border-gray-200': tier.level !== currentTier.level,
          }"
        >
          <div class="flex items-center gap-3">
            <div class="text-2xl">{{ ['🥉', '🥈', '🥇', '💎', '👑'][tier.level - 1] }}</div>
            <div>
              <div class="font-semibold">{{ tier.name }}</div>
              <div class="text-sm text-gray-500">${{ tier.minRevenue.toLocaleString() }}+ revenue</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-blue-600">{{ tier.commissionRate * 100 }}%</div>
            <div class="text-xs text-gray-500">{{ tier.affiliates }} affiliates</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
