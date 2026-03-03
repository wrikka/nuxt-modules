<script setup lang="ts">
import { ref } from 'vue';

const step = ref(1);
const totalSteps = 4;

const formData = ref({
  name: '',
  email: '',
  website: '',
  payoutMethod: 'stripe',
  payoutEmail: '',
  agreeToTerms: false,
});

function nextStep() {
  if (step.value < totalSteps) {
    step.value++;
  }
}

function prevStep() {
  if (step.value > 1) {
    step.value--;
  }
}

function submitApplication() {
  console.log('Application submitted:', formData.value);
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Become an Affiliate</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {{ step }} of {{ totalSteps }}</span>
          <span>{{ (step / totalSteps * 100).toFixed(0) }}% complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: `${step / totalSteps * 100}%` }"
          ></div>
        </div>
      </div>

      <div v-if="step === 1">
        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input v-model="formData.name" type="text" class="w-full border rounded px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input v-model="formData.email" type="email" class="w-full border rounded px-3 py-2">
          </div>
        </div>
      </div>

      <div v-if="step === 2">
        <h2 class="text-lg font-semibold mb-4">Website Information</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <input v-model="formData.website" type="url" class="w-full border rounded px-3 py-2" placeholder="https://example.com">
          </div>
          <div class="p-4 bg-blue-50 rounded">
            <h3 class="font-semibold text-blue-800 mb-2">Why do we need this?</h3>
            <p class="text-sm text-blue-700">Your website helps us understand your audience and provide better support.</p>
          </div>
        </div>
      </div>

      <div v-if="step === 3">
        <h2 class="text-lg font-semibold mb-4">Payout Preferences</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payout Method</label>
            <select v-model="formData.payoutMethod" class="w-full border rounded px-3 py-2">
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payout Email</label>
            <input v-model="formData.payoutEmail" type="email" class="w-full border rounded px-3 py-2">
          </div>
        </div>
      </div>

      <div v-if="step === 4">
        <h2 class="text-lg font-semibold mb-4">Terms & Conditions</h2>
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded max-h-48 overflow-y-auto">
            <h3 class="font-semibold mb-2">Affiliate Agreement</h3>
            <p class="text-sm text-gray-600 mb-2">By becoming an affiliate, you agree to our terms and conditions...</p>
            <p class="text-sm text-gray-600">Commission rates, payment schedules, and other important details are outlined in our full agreement.</p>
          </div>
          <label class="flex items-center gap-2">
            <input v-model="formData.agreeToTerms" type="checkbox" class="w-4 h-4">
            <span class="text-sm">I agree to the terms and conditions</span>
          </label>
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button
          v-if="step > 1"
          class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
          @click="prevStep"
        >
          Previous
        </button>
        <button
          v-if="step < totalSteps"
          class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          @click="nextStep"
        >
          Next
        </button>
        <button
          v-if="step === totalSteps"
          class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          :disabled="!formData.agreeToTerms"
          @click="submitApplication"
        >
          Submit Application
        </button>
      </div>
    </div>
  </div>
</template>
