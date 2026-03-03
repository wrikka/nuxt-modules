<script setup lang="ts">
import { ref } from 'vue';

const customSlug = ref('');
const referralLink = ref('https://example.com/ref/ABC123');
const isCustom = ref(false);
const available = ref(true);

function updateLink() {
  if (customSlug.value) {
    referralLink.value = `https://example.com/ref/${customSlug.value}`;
    isCustom.value = true;
  } else {
    referralLink.value = 'https://example.com/ref/ABC123';
    isCustom.value = false;
  }
}

function checkAvailability() {
  available.value = customSlug.value.length > 3 && /^[a-zA-Z0-9-]+$/.test(customSlug.value);
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Customize Your Referral Link</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Create Custom Link</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Custom Slug</label>
          <div class="flex gap-2">
            <span class="bg-gray-100 px-3 py-2 rounded-l border border-r-0">https://example.com/ref/</span>
            <input
              v-model="customSlug"
              type="text"
              class="flex-1 border rounded-r px-3 py-2"
              placeholder="your-custom-slug"
              @input="checkAvailability"
            >
          </div>
          <div class="mt-2 text-sm">
            <span v-if="available" class="text-green-600">✓ Available</span>
            <span v-else class="text-red-600">✗ Not available</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div class="bg-gray-50 p-3 rounded border">
            <code>{{ referralLink }}</code>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            @click="updateLink"
          >
            Save Custom Link
          </button>
          <button
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            @click="customSlug = ''; updateLink()"
          >
            Reset to Default
          </button>
        </div>

        <div class="mt-4 p-4 bg-blue-50 rounded">
          <h3 class="font-semibold text-blue-800 mb-2">Tips for Custom Links</h3>
          <ul class="text-sm text-blue-700 space-y-1">
            <li>• Use easy-to-remember names</li>
            <li>• Keep it short and simple</li>
            <li>• Avoid special characters</li>
            <li>• Make it relevant to your brand</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
