<script setup lang="ts">
import { ref } from 'vue';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  requirement: string;
}

const badges = ref<Badge[]>([
  {
    id: '1',
    name: 'First Referral',
    description: 'Refer your first friend',
    icon: '🎯',
    unlocked: true,
    progress: 100,
    requirement: '1 referral',
  },
  {
    id: '2',
    name: 'Referral Champion',
    description: 'Refer 10 friends',
    icon: '🏆',
    unlocked: true,
    progress: 100,
    requirement: '10 referrals',
  },
  {
    id: '3',
    name: 'Conversion Master',
    description: 'Achieve 50% conversion rate',
    icon: '⚡',
    unlocked: false,
    progress: 45,
    requirement: '50% conversion rate',
  },
  {
    id: '4',
    name: 'Social Butterfly',
    description: 'Share on 5 social platforms',
    icon: '🦋',
    unlocked: false,
    progress: 60,
    requirement: '5 platforms',
  },
  {
    id: '5',
    name: 'Reward Collector',
    description: 'Redeem 10 rewards',
    icon: '🎁',
    unlocked: false,
    progress: 70,
    requirement: '10 rewards',
  },
  {
    id: '6',
    name: 'Affiliate Elite',
    description: 'Reach Diamond tier',
    icon: '💎',
    unlocked: false,
    progress: 30,
    requirement: 'Diamond tier',
  },
]);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Badges</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="bg-white rounded-lg shadow p-6"
        :class="{ 'opacity-50': !badge.unlocked }"
      >
        <div class="text-center">
          <div class="text-5xl mb-3">{{ badge.icon }}</div>
          <h3 class="font-semibold text-lg mb-2">{{ badge.name }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ badge.description }}</p>
          <div class="mb-2">
            <div class="text-xs text-gray-500 mb-1">{{ badge.requirement }}</div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full"
                :class="badge.unlocked ? 'bg-green-500' : 'bg-blue-500'"
                :style="{ width: `${badge.progress}%` }"
              ></div>
            </div>
          </div>
          <div class="text-xs text-gray-500">{{ badge.progress }}% complete</div>
        </div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-purple-50 rounded">
      <h3 class="font-semibold text-purple-800 mb-2">How to Earn Badges</h3>
      <ul class="text-sm text-purple-700 space-y-1">
        <li>• Complete specific achievements to unlock badges</li>
        <li>• Badges display on your profile</li>
        <li>• Some badges unlock special rewards</li>
      </ul>
    </div>
  </div>
</template>
