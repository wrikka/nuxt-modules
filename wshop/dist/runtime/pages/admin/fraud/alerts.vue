<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Fraud Alerts</h1>

    <div v-if="pending" class="text-center py-8">Loading...</div>

    <div v-else-if="error" class="text-red-500">Failed to load alerts</div>

    <div v-else class="space-y-4">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="bg-white p-4 rounded-lg shadow border-l-4"
        :class="{
  'border-red-500': alert.riskLevel === 'high',
  'border-yellow-500': alert.riskLevel === 'medium',
  'border-green-500': alert.riskLevel === 'low'
}"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold mb-1">Order #{{ alert.orderId }}</h3>
            <p class="text-sm text-gray-600 mb-2">Customer: {{ alert.customerEmail }}</p>
            <div class="space-y-1">
              <p
                v-for="reason in alert.reasons"
                :key="reason"
                class="text-sm"
                :class="{
  'text-red-600': alert.riskLevel === 'high',
  'text-yellow-600': alert.riskLevel === 'medium',
  'text-green-600': alert.riskLevel === 'low'
}"
              >
                • {{ reason }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold mb-1">{{ alert.riskScore }}%</div>
            <div class="text-xs uppercase font-semibold"
              :class="{
  'text-red-600': alert.riskLevel === 'high',
  'text-yellow-600': alert.riskLevel === 'medium',
  'text-green-600': alert.riskLevel === 'low'
}"
            >
              {{ alert.riskLevel }} Risk
            </div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            @click="reviewOrder(alert.orderId)"
            class="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Review Order
          </button>
          <button
            v-if="alert.riskLevel === 'high'"
            @click="blockOrder(alert.orderId)"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Block Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: alerts, pending, error } = await useFetch("/api/fraud/alerts");
const reviewOrder = (orderId) => {
  navigateTo(`/admin/orders/${orderId}`);
};
const blockOrder = async (orderId) => {
  try {
    await $fetch(`/api/orders/${orderId}/block`, { method: "POST" });
    alert("Order blocked successfully");
  } catch (error2) {
    console.error("Failed to block order:", error2);
  }
};
</script>
