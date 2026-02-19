<script setup lang="ts">
import { ref } from 'vue';

interface TestVariant {
  id: string;
  name: string;
  message: string;
  cta: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
}

const tests = ref([
  {
    id: '1',
    name: 'Welcome Message Test',
    variants: [
      { id: 'a', name: 'Variant A', message: 'Join now and get 100 points!', cta: 'Sign Up', clicks: 500, conversions: 50, conversionRate: 10 },
      { id: 'b', name: 'Variant B', message: 'Earn rewards with friends!', cta: 'Get Started', clicks: 480, conversions: 60, conversionRate: 12.5 },
    ],
    status: 'active',
    winner: null,
  },
  {
    id: '2',
    name: 'CTA Button Test',
    variants: [
      { id: 'a', name: 'Blue Button', message: 'Refer Friends', cta: 'Share Now', clicks: 600, conversions: 72, conversionRate: 12 },
      { id: 'b', name: 'Green Button', message: 'Refer Friends', cta: 'Start Earning', clicks: 550, conversions: 55, conversionRate: 10 },
    ],
    status: 'completed',
    winner: 'a',
  },
]);

const showCreateTest = ref(false);
const newTest = ref({
  name: '',
  variants: [
    { name: 'Variant A', message: '', cta: '' },
    { name: 'Variant B', message: '', cta: '' },
  ],
});

function createTest() {
  tests.value.push({
    id: Date.now().toString(),
    name: newTest.value.name,
    variants: newTest.value.variants.map((v, i) => ({
      id: String.fromCharCode(97 + i),
      name: v.name,
      message: v.message,
      cta: v.cta,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
    })),
    status: 'active',
    winner: null,
  });
  showCreateTest.value = false;
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Referral A/B Testing</h1>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="showCreateTest = true"
      >
        Create Test
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="test in tests"
        :key="test.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-lg">{{ test.name }}</h3>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': test.status === 'active',
                'bg-gray-100 text-gray-800': test.status === 'completed',
              }"
            >
              {{ test.status }}
            </span>
          </div>
          <div v-if="test.winner" class="text-sm text-green-600 font-semibold">
            Winner: {{ test.variants.find((v) => v.id === test.winner)?.name }}
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="variant in test.variants"
            :key="variant.id"
            class="p-4 rounded-lg border"
            :class="{
              'border-green-500 bg-green-50': test.winner === variant.id,
              'border-gray-200': test.winner !== variant.id,
            }"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-medium">{{ variant.name }}</h4>
                <p class="text-sm text-gray-600">{{ variant.message }}</p>
                <p class="text-xs text-gray-500">CTA: {{ variant.cta }}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-blue-600">{{ variant.conversionRate }}%</div>
                <div class="text-xs text-gray-500">{{ variant.conversions }}/{{ variant.clicks }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateTest" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Create A/B Test</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
            <input v-model="newTest.name" type="text" class="w-full border rounded px-3 py-2">
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold">Variant A</h3>
            <input v-model="newTest.variants[0].message" type="text" class="w-full border rounded px-3 py-2" placeholder="Message">
            <input v-model="newTest.variants[0].cta" type="text" class="w-full border rounded px-3 py-2" placeholder="CTA">
          </div>
          <div class="space-y-2">
            <h3 class="font-semibold">Variant B</h3>
            <input v-model="newTest.variants[1].message" type="text" class="w-full border rounded px-3 py-2" placeholder="Message">
            <input v-model="newTest.variants[1].cta" type="text" class="w-full border rounded px-3 py-2" placeholder="CTA">
          </div>
          <div class="flex gap-2">
            <button
              class="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              @click="createTest"
            >
              Create
            </button>
            <button
              class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              @click="showCreateTest = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
