<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, required: true },
  iconBgColor: { type: String, required: true },
  iconTextColor: { type: String, required: true },
  trend: { type: Object, required: false },
  footerText: { type: String, required: false }
});
const trendText = computed(() => {
  if (!props.trend) return "";
  return `${Math.abs(props.trend.value).toFixed(1)}% \u0E08\u0E32\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19`;
});
</script>

<template>
  <div class="p-6 bg-white border rounded-lg shadow-sm">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
      <div class="p-3 rounded-lg" :class="[iconBgColor]">
        <Icon :name="icon" class="w-6 h-6" :class="[iconTextColor]" />
      </div>
    </div>
    <div v-if="trend || footerText" class="flex items-center mt-4">
      <template v-if="trend">
        <Icon 
          :name="trend.isPositive ? 'mdi:trending-up' : 'mdi:trending-down'" 
          class="w-4 h-4 mr-1" 
          :class="[trend.isPositive ? 'text-green-600' : 'text-red-600']"
        />
        <span 
          class="text-sm font-medium"
          :class="[trend.isPositive ? 'text-green-600' : 'text-red-600']"
        >
          {{ trendText }}
        </span>
      </template>
      <template v-else-if="footerText">
        <span class="text-sm text-gray-600">{{ footerText }}</span>
      </template>
    </div>
  </div>
</template>
