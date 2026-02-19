<script setup>
defineProps({
  selectedPeriod: { type: String, required: true },
  isAutoRefresh: { type: Boolean, required: true }
});
const emit = defineEmits(["update:selectedPeriod", "update:isAutoRefresh", "toggle-auto-refresh"]);
const onPeriodChange = (event) => {
  emit("update:selectedPeriod", event.target.value);
};
const onToggle = () => {
  emit("toggle-auto-refresh");
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">แดชบอร์ดยอดขาย</h1>
      <p class="text-gray-600">ข้อมูลยอดขายแบบ Real-time</p>
    </div>
    <div class="flex items-center space-x-4">
      <select
        :value="selectedPeriod"
        @change="onPeriodChange"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="today">วันนี้</option>
        <option value="week">สัปดาห์นี้</option>
        <option value="month">เดือนนี้</option>
        <option value="year">ปีนี้</option>
      </select>
      
      <button
        @click="onToggle"
        :class="[
  'px-4 py-2 rounded-lg border transition-colors',
  isAutoRefresh ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-700'
]"
      >
        <Icon name="mdi:refresh" :class="['w-4 h-4 mr-2', isAutoRefresh && 'animate-spin']" />
        {{ isAutoRefresh ? "Auto Refresh" : "Manual" }}
      </button>
    </div>
  </div>
</template>
