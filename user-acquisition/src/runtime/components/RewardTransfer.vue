<script setup lang="ts">
import { ref } from 'vue';

interface Transfer {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

const transfers = ref<Transfer[]>([
  {
    id: '1',
    from: 'John Doe',
    to: 'Jane Smith',
    amount: 500,
    timestamp: new Date('2024-02-17'),
    status: 'completed',
  },
  {
    id: '2',
    from: 'Bob Johnson',
    to: 'Alice Brown',
    amount: 1000,
    timestamp: new Date('2024-02-16'),
    status: 'pending',
  },
]);

const userBalance = ref(2500);
const recipientEmail = ref('');
const transferAmount = ref(0);
const showTransferModal = ref(false);

function initiateTransfer() {
  transfers.value.unshift({
    id: Date.now().toString(),
    from: 'You',
    to: recipientEmail.value,
    amount: transferAmount.value,
    timestamp: new Date(),
    status: 'pending',
  });
  userBalance.value -= transferAmount.value;
  showTransferModal.value = false;
  recipientEmail.value = '';
  transferAmount.value = 0;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Reward Transfer</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Your Balance</h2>
      <div class="text-4xl font-bold text-blue-600 mb-4">{{ userBalance }} points</div>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="showTransferModal = true"
      >
        Transfer Points
      </button>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Transfer History</h2>
      <div class="space-y-3">
        <div
          v-for="transfer in transfers"
          :key="transfer.id"
          class="p-4 rounded-lg border border-gray-200"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-semibold">{{ transfer.from }} → {{ transfer.to }}</div>
              <div class="text-sm text-gray-500">{{ new Date(transfer.timestamp).toLocaleString() }}</div>
            </div>
            <div class="text-right">
              <div class="font-bold text-blue-600">{{ transfer.amount }} pts</div>
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': transfer.status === 'pending',
                  'bg-green-100 text-green-800': transfer.status === 'completed',
                  'bg-red-100 text-red-800': transfer.status === 'failed',
                }"
              >
                {{ transfer.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTransferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Transfer Points</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
            <input v-model="recipientEmail" type="email" class="w-full border rounded px-3 py-2" placeholder="recipient@example.com">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input v-model.number="transferAmount" type="number" min="1" :max="userBalance" class="w-full border rounded px-3 py-2">
            <div class="text-sm text-gray-500 mt-1">Available: {{ userBalance }} points</div>
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              :disabled="!recipientEmail || transferAmount <= 0 || transferAmount > userBalance"
              @click="initiateTransfer"
            >
              Transfer
            </button>
            <button
              class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              @click="showTransferModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
