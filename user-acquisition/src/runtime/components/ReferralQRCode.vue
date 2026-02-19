<script setup lang="ts">
import { ref } from 'vue';

const referralLink = ref('https://example.com/ref/ABC123');
const qrCodeSize = ref(200);
const showDownload = ref(false);

function downloadQRCode() {
  showDownload.value = true;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Referral QR Code</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Your Referral QR Code</h2>

      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1">
          <div class="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <div class="text-center">
              <div class="border-4 border-gray-800 p-4 bg-white inline-block">
                <div class="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-400 text-sm">QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
            <input
              v-model="referralLink"
              type="text"
              class="w-full border rounded px-3 py-2"
              readonly
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">QR Code Size</label>
            <select v-model="qrCodeSize" class="w-full border rounded px-3 py-2">
              <option :value="200">Small (200x200)</option>
              <option :value="300">Medium (300x300)</option>
              <option :value="400">Large (400x400)</option>
            </select>
          </div>

          <div class="space-y-2">
            <button
              class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              @click="downloadQRCode"
            >
              Download QR Code
            </button>
            <button
              class="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              @click="navigator.clipboard.writeText(referralLink)"
            >
              Copy Link
            </button>
          </div>

          <div class="p-4 bg-blue-50 rounded">
            <h3 class="font-semibold text-blue-800 mb-2">Usage Tips</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Print on business cards</li>
              <li>• Display on marketing materials</li>
              <li>• Share in presentations</li>
              <li>• Use in physical stores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
