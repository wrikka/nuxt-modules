<script setup lang="ts">
import { ref } from 'vue';

const schedule = ref('monthly');
const schedules = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const nextPayout = ref(new Date('2024-03-01'));
const pendingAmount = ref(250);
const minPayout = ref(50);

const history = ref([
  { date: '2024-02-01', amount: 150, status: 'completed' },
  { date: '2024-01-01', amount: 200, status: 'completed' },
  { date: '2023-12-01', amount: 180, status: 'completed' },
]);

function updateSchedule() {
  console.log('Schedule updated:', schedule.value);
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Payout Scheduler</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Payout Settings</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payout Frequency</label>
            <select v-model="schedule" class="w-full border rounded px-3 py-2" @change="updateSchedule">
              <option v-for="s in schedules" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount</label>
            <input v-model.number="minPayout" type="number" class="w-full border rounded px-3 py-2">
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Payout Status</h2>
        <div class="space-y-3">
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-600">Pending Amount</div>
            <div class="text-2xl font-bold text-blue-600">${{ pendingAmount }}</div>
          </div>
          <div class="p-3 bg-green-50 rounded">
            <div class="text-sm text-gray-600">Next Payout</div>
            <div class="text-lg font-semibold text-green-600">{{ new Date(nextPayout).toLocaleDateString() }}</div>
          </div>
          <div class="p-3 bg-yellow-50 rounded">
            <div class="text-sm text-gray-600">Minimum Required</div>
            <div class="text-lg font-semibold text-yellow-600">${{ minPayout }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Payout History</h2>
      <div class="space-y-2">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="flex justify-between items-center p-3 bg-gray-50 rounded"
        >
          <span>{{ new Date(item.date).toLocaleDateString() }}</span>
          <div class="flex items-center gap-4">
            <span class="font-semibold">${{ item.amount }}</span>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': item.status === 'completed',
                'bg-yellow-100 text-yellow-800': item.status === 'pending',
              }"
            >
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
