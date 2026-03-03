<script setup lang="ts">
import { ref } from 'vue';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate: Date;
  referrals: number;
  conversions: number;
  reward: number;
}

const campaigns = ref<Campaign[]>([
  {
    id: '1',
    name: 'Summer Referral Blast',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    referrals: 150,
    conversions: 75,
    reward: 100,
  },
  {
    id: '2',
    name: 'Winter Special',
    status: 'paused',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-28'),
    referrals: 200,
    conversions: 100,
    reward: 150,
  },
  {
    id: '3',
    name: 'Holiday Promo',
    status: 'completed',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2023-12-31'),
    referrals: 300,
    conversions: 150,
    reward: 200,
  },
]);

const showCreateModal = ref(false);
const newCampaign = ref({
  name: '',
  startDate: '',
  endDate: '',
  reward: 100,
});

function createCampaign() {
  campaigns.value.push({
    id: Date.now().toString(),
    name: newCampaign.value.name,
    status: 'active',
    startDate: new Date(newCampaign.value.startDate),
    endDate: new Date(newCampaign.value.endDate),
    referrals: 0,
    conversions: 0,
    reward: newCampaign.value.reward,
  });
  showCreateModal.value = false;
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Referral Campaigns</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="showCreateModal = true"
      >
        Create Campaign
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">{{ campaign.name }}</h3>
            <div class="text-sm text-gray-500">
              {{ new Date(campaign.startDate).toLocaleDateString() }} - {{ new Date(campaign.endDate).toLocaleDateString() }}
            </div>
          </div>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': campaign.status === 'active',
              'bg-yellow-100 text-yellow-800': campaign.status === 'paused',
              'bg-gray-100 text-gray-800': campaign.status === 'completed',
            }"
          >
            {{ campaign.status }}
          </span>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="text-sm text-gray-500">Referrals</div>
            <div class="text-2xl font-bold text-blue-600">{{ campaign.referrals }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Conversions</div>
            <div class="text-2xl font-bold text-green-600">{{ campaign.conversions }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Reward</div>
            <div class="text-2xl font-bold text-purple-600">{{ campaign.reward }} pts</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Create New Campaign</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
            <input v-model="newCampaign.name" type="text" class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input v-model="newCampaign.startDate" type="date" class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input v-model="newCampaign.endDate" type="date" class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Reward Points</label>
            <input v-model.number="newCampaign.reward" type="number" class="w-full border rounded px-3 py-2">
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              @click="createCampaign"
            >
              Create
            </button>
            <button
              class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
