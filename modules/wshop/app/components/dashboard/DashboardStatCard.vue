<script setup lang="ts">
interface Props {
  title: string;
  value: string;
  icon: string;
  iconBgColor?: string;
  iconTextColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  footerText?: string;
}

const props = defineProps<Props>();

const change = computed(() => {
  if (props.footerText) return props.footerText;
  if (!props.trend) return undefined;
  const value = `${Math.abs(props.trend.value).toFixed(1)}% จากช่วงเวลาเดียวกัน`;
  return value;
});

const changeType = computed(() => {
  if (!props.trend) return 'neutral';
  return props.trend.isPositive ? 'positive' : 'negative';
});
</script>

<template>
  <MoleculesStatCard
    :title="title"
    :value="value"
    :change="change"
    :change-type="changeType"
    :icon="icon"
  />
</template>
