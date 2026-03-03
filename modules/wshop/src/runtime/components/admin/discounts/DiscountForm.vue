<template>
  <form @submit.prevent="saveDiscount" class="space-y-8">
    <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label for="code" class="block text-sm font-medium text-gray-700">Discount Code</label>
        <input type="text" id="code" v-model="discount.code" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <input type="text" id="description" v-model="discount.description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
          <select id="type" v-model="discount.type" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label for="value" class="block text-sm font-medium text-gray-700">Value</label>
          <input type="number" id="value" v-model="discount.value" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="usageLimit" class="block text-sm font-medium text-gray-700">Usage Limit (0 for unlimited)</label>
          <input type="number" id="usageLimit" v-model.number="discount.usageLimit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
        </div>
        <div>
          <label for="isActive" class="block text-sm font-medium text-gray-700">Status</label>
          <select id="isActive" v-model="discount.isActive" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <NuxtLink to="/admin/discounts" class="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded">Cancel</NuxtLink>
      <button type="submit" :disabled="isSaving" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300">
        {{ isSaving ? 'Saving...' : 'Save Discount' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Discount } from '~~/shared/types';

defineProps<{
  discount: Discount;
  isSaving: boolean;
}>();

const emit = defineEmits(['save']);

const saveDiscount = () => {
  emit('save');
};
</script>
