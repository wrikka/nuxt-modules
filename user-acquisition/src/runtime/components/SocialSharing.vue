<script setup lang="ts">
import { ref } from 'vue';

const referralLink = ref('https://example.com/ref/ABC123');
const shareMessage = ref('Join me and get exclusive rewards!');
const customMessage = ref('');

const platforms = [
  {
    name: 'Twitter',
    icon: '🐦',
    color: 'bg-blue-400',
    shareUrl: 'https://twitter.com/intent/tweet',
  },
  {
    name: 'Facebook',
    icon: '📘',
    color: 'bg-blue-600',
    shareUrl: 'https://www.facebook.com/sharer/sharer.php',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    color: 'bg-green-500',
    shareUrl: 'https://wa.me/',
  },
  {
    name: 'Email',
    icon: '📧',
    color: 'bg-gray-600',
    shareUrl: 'mailto:',
  },
];

function shareToPlatform(platform: string) {
  const url = `${platform}?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent(shareMessage.value)}`;
  window.open(url, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(referralLink.value);
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Share Your Referral Link</h1>

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
          @click="copyLink"
        >
          Copy
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Customize Message</h2>
      <textarea
        v-model="customMessage"
        rows="3"
        class="w-full border rounded px-3 py-2"
        placeholder="Add your personal message..."
      ></textarea>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Share to Social Media</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          v-for="platform in platforms"
          :key="platform.name"
          class="p-4 rounded-lg text-center transition-transform hover:scale-105"
          :class="platform.color"
          @click="shareToPlatform(platform.shareUrl)"
        >
          <div class="text-3xl mb-2">{{ platform.icon }}</div>
          <div class="text-white font-medium">{{ platform.name }}</div>
        </button>
      </div>
    </div>

    <div class="mt-6 p-4 bg-blue-50 rounded">
      <h3 class="font-semibold text-blue-800 mb-2">Sharing Tips</h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>• Personalize your message for better engagement</li>
        <li>• Share during peak hours for maximum reach</li>
        <li>• Use relevant hashtags on Twitter</li>
        <li>• Include a call-to-action</li>
      </ul>
    </div>
  </div>
</template>
