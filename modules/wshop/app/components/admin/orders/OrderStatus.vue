<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Status</h2>
    <div class="space-y-2">
      <div>
        <label class="text-sm font-medium text-gray-600">Order Status</label>
        <select v-model="orderStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option v-for="s in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div>
        <label class="text-sm font-medium text-gray-600">Payment Status</label>
        <select v-model="paymentStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
          <option v-for="s in ['pending', 'paid', 'failed']" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <button @click="updateStatus" class="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Update Status</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  orderStatus: string;
  paymentStatus: string;
}>();

const emit = defineEmits(['update-status']);

const orderStatus = ref(props.orderStatus);
const paymentStatus = ref(props.paymentStatus);

const updateStatus = () => {
  emit('update-status', { orderStatus: orderStatus.value, paymentStatus: paymentStatus.value });
};
</script>
