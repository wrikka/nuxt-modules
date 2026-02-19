<script setup lang="ts">
import { ref } from 'vue';

interface Message {
  id: string;
  from: 'user' | 'support';
  text: string;
  timestamp: Date;
}

const messages = ref<Message[]>([
  {
    id: '1',
    from: 'user',
    text: 'I have a question about my commission payout',
    timestamp: new Date('2024-02-17T10:00:00'),
  },
  {
    id: '2',
    from: 'support',
    text: 'Hello! I\'d be happy to help you with your commission payout. What would you like to know?',
    timestamp: new Date('2024-02-17T10:05:00'),
  },
  {
    id: '3',
    from: 'user',
    text: 'When will my next payout be processed?',
    timestamp: new Date('2024-02-17T10:10:00'),
  },
]);

const newMessage = ref('');

function sendMessage() {
  if (!newMessage.value.trim()) return;
  messages.value.push({
    id: Date.now().toString(),
    from: 'user',
    text: newMessage.value,
    timestamp: new Date(),
  });
  newMessage.value = '';
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Affiliate Support Chat</h1>

    <div class="bg-white rounded-lg shadow">
      <div class="h-96 overflow-y-auto p-4 space-y-3">
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.from === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-xs p-3 rounded-lg"
            :class="message.from === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          >
            <div class="text-sm">{{ message.text }}</div>
            <div class="text-xs opacity-75 mt-1">{{ new Date(message.timestamp).toLocaleTimeString() }}</div>
          </div>
        </div>
      </div>

      <div class="border-t p-4">
        <div class="flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            class="flex-1 border rounded px-3 py-2"
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
          >
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 p-4 bg-blue-50 rounded">
      <h3 class="font-semibold text-blue-800 mb-2">Support Hours</h3>
      <p class="text-sm text-blue-700">Monday - Friday: 9:00 AM - 6:00 PM (UTC)</p>
    </div>
  </div>
</template>
