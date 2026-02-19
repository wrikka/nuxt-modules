<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReferrals } from '../composables/useReferrals';

const { generateReferralCode, getReferralCode, getReferralLink, getReferralReward } = useReferrals();

const referralCode = ref('');
const referralLink = ref('');
const stats = ref({
  totalReferrals: 0,
  activeReferrals: 0,
  completedReferrals: 0,
  totalClicks: 0,
  totalConversions: 0,
  totalRevenue: 0,
  conversionRate: 0,
});

onMounted(async () => {
  const userId = 'user-123';
  const code = generateReferralCode(userId);
  referralCode.value = code;
  referralLink.value = getReferralLink(userId);
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Referral Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Referrals</div>
        <div class="text-3xl font-bold text-blue-600">{{ stats.totalReferrals }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Active Referrals</div>
        <div class="text-3xl font-bold text-green-600">{{ stats.activeReferrals }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Conversion Rate</div>
        <div class="text-3xl font-bold text-purple-600">{{ stats.conversionRate }}%</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Your Referral Link</h2>
      <div class="flex gap-2">
        <input
          v-model="referralLink"
          type="text"
          class="flex-1 border rounded px-3 py-2"
          readonly
        >
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click="navigator.clipboard.writeText(referralLink)"
        >
          Copy
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Referral Stats</h2>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span>Total Clicks</span>
          <span class="font-semibold">{{ stats.totalClicks }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total Conversions</span>
          <span class="font-semibold">{{ stats.totalConversions }}</span>
        </div>
        <div class="flex justify-between">
          <span>Total Revenue</span>
          <span class="font-semibold">${{ stats.totalRevenue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
