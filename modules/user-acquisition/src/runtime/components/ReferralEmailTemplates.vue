<script setup lang="ts">
import { ref } from 'vue';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  preview: string;
  openRate: number;
  clickRate: number;
}

const templates = ref<EmailTemplate[]>([
  {
    id: '1',
    name: 'Welcome Referral',
    subject: 'Welcome! Start earning rewards',
    preview: 'Hi [Name], thanks for joining! Here\'s your referral link...',
    openRate: 45.2,
    clickRate: 12.5,
  },
  {
    id: '2',
    name: 'Reward Reminder',
    subject: 'You have rewards waiting!',
    preview: 'Don\'t miss out on your rewards. Redeem them now...',
    openRate: 52.1,
    clickRate: 18.3,
  },
  {
    id: '3',
    name: 'Milestone Celebration',
    subject: 'Congratulations on reaching 100 referrals!',
    preview: 'Amazing work! You\'ve unlocked a special bonus...',
    openRate: 38.7,
    clickRate: 15.2,
  },
]);

const selectedTemplate = ref<EmailTemplate | null>(null);
const showPreview = ref(false);

function previewTemplate(template: EmailTemplate) {
  selectedTemplate.value = template;
  showPreview.value = true;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Referral Email Templates</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Available Templates</h2>
        <div class="space-y-3">
          <div
            v-for="template in templates"
            :key="template.id"
            class="p-4 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors"
            @click="previewTemplate(template)"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold">{{ template.name }}</h3>
              <span class="text-xs text-gray-500">{{ template.openRate }}% open</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ template.subject }}</p>
            <p class="text-xs text-gray-500">{{ template.preview }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Performance Metrics</h2>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded">
            <div class="text-sm text-gray-600">Average Open Rate</div>
            <div class="text-2xl font-bold text-blue-600">45.3%</div>
          </div>
          <div class="p-4 bg-green-50 rounded">
            <div class="text-sm text-gray-600">Average Click Rate</div>
            <div class="text-2xl font-bold text-green-600">15.3%</div>
          </div>
          <div class="p-4 bg-purple-50 rounded">
            <div class="text-sm text-gray-600">Total Sent</div>
            <div class="text-2xl font-bold text-purple-600">1,250</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPreview && selectedTemplate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedTemplate.name }}</h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="showPreview = false"
          >
            ✕
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input :value="selectedTemplate.subject" type="text" class="w-full border rounded px-3 py-2" readonly>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Body</label>
            <textarea
              :value="selectedTemplate.preview"
              rows="10"
              class="w-full border rounded px-3 py-2"
              readonly
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Edit Template
            </button>
            <button class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Send Test
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
