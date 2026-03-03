<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Segment, SegmentRule } from '~/shared/types/segment';

const props = defineProps<{ 
  segment?: Segment | null;
  isLoading?: boolean;
}>();

const emit = defineEmits(['submit']);

const localSegment = ref<Partial<Segment>>({ name: '', description: '', rules: [] });

// Use onMounted to safely access props after component is mounted
onMounted(() => {
  if (props.segment) {
    localSegment.value = JSON.parse(JSON.stringify(props.segment));
  }
});

// Watch for prop changes if the component might be reused without unmounting
watch(() => props.segment, (newVal) => {
  if (newVal) {
    localSegment.value = JSON.parse(JSON.stringify(newVal));
  } else {
    localSegment.value = { name: '', description: '', rules: [{ field: 'totalSpent', operator: 'greaterThan', value: '' }] };
  }
});

const addRule = () => {
  if (!localSegment.value.rules) {
    localSegment.value.rules = [];
  }
  localSegment.value.rules.push({ field: 'totalSpent', operator: 'greaterThan', value: '' });
};

const removeRule = (index: number) => {
  localSegment.value.rules?.splice(index, 1);
};

const handleSubmit = () => {
  emit('submit', localSegment.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">Segment Name</label>
      <input id="name" v-model="localSegment.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
    </div>
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
      <textarea id="description" v-model="localSegment.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
    </div>

    <div>
      <h3 class="text-lg font-medium mb-2">Rules</h3>
      <div v-for="(rule, index) in localSegment.rules" :key="index" class="flex items-center gap-4 p-3 bg-gray-50 rounded-md mb-2">
        <select v-model="rule.field" class="rounded-md border-gray-300 shadow-sm">
          <option value="totalSpent">Total Spent</option>
          <option value="orderCount">Order Count</option>
        </select>
        <select v-model="rule.operator" class="rounded-md border-gray-300 shadow-sm">
          <option value="greaterThan">Greater than</option>
          <option value="lessThan">Less than</option>
          <option value="equals">Equal to</option>
        </select>
        <input v-model="rule.value" type="text" placeholder="Value" required class="flex-grow rounded-md border-gray-300 shadow-sm">
        <button @click.prevent="removeRule(index)" class="text-red-500 hover:text-red-700">Remove</button>
      </div>
      <button @click.prevent="addRule" class="mt-2 text-sm text-blue-600 hover:underline">+ Add Rule</button>
    </div>

    <div class="border-t pt-4">
      <button type="submit" :disabled="isLoading" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
        {{ isLoading ? 'Saving...' : 'Save Segment' }}
      </button>
    </div>
  </form>
</template>
