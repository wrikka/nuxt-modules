<script setup lang="ts">
import { ref } from 'vue';

interface SeasonalBonus {
  id: string;
  name: string;
  season: 'christmas' | 'new_year' | 'summer' | 'fall';
  multiplier: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}

const bonuses = ref<SeasonalBonus[]>([
  {
    id: '1',
    name: 'Christmas Special',
    season: 'christmas',
    multiplier: 2,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    active: false,
  },
  {
    id: '2',
    name: 'New Year Blast',
    season: 'new_year',
    multiplier: 1.5,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-07'),
    active: false,
  },
  {
    id: '3',
    name: 'Summer Referral Party',
    season: 'summer',
    multiplier: 1.8,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    active: false,
  },
]);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Seasonal Bonuses</h1>

    <div class="space-y-4">
      <div
        v-for="bonus in bonuses"
        :key="bonus.id"
        class="bg-white rounded-lg shadow p-6"
        :class="{ 'border-2 border-green-500': bonus.active }"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">{{ bonus.name }}</h3>
            <div class="text-sm text-gray-500">
              {{ new Date(bonus.startDate).toLocaleDateString() }} - {{ new Date(bonus.endDate).toLocaleDateString() }}
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': bonus.active,
              'bg-gray-100 text-gray-800': !bonus.active,
            }"
          >
            {{ bonus.active ? 'Active' : 'Inactive' }}
          </span>
        </div>

        <div class="p-4 bg-purple-50 rounded mb-4">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎁</span>
            <div>
              <div class="font-semibold text-purple-800">{{ bonus.multiplier }}x Bonus</div>
              <div class="text-sm text-purple-700">Earn {{ bonus.multiplier }}x rewards during this period</div>
            </div>
          </div>
        </div>

        <button
          class="w-full py-2 rounded"
          :class="{
            'bg-gray-200 text-gray-700 hover:bg-gray-300': !bonus.active,
            'bg-green-500 text-white hover:bg-green-600': bonus.active,
          }"
        >
          {{ bonus.active ? 'Active Now' : 'Coming Soon' }}
        </button>
      </div>
    </div>

    <div class="mt-6 p-4 bg-yellow-50 rounded">
      <h3 class="font-semibold text-yellow-800 mb-2">How Seasonal Bonuses Work</h3>
      <p class="text-sm text-yellow-700">
        During special seasonal periods, earn bonus multipliers on all referrals and rewards. Check back regularly for new bonus opportunities!
      </p>
    </div>
  </div>
</template>
