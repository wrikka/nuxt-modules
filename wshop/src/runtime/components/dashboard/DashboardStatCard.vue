<script setup lang="ts">
interface Props {
  title: string;
  value: string;
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footerText?: string;
}

const props = defineProps<Props>();

const trendText = computed(() => {
  if (!props.trend) return '';
  return `${Math.abs(props.trend.value).toFixed(1)}% จากช่วงเวลาเดียวกัน`;
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
