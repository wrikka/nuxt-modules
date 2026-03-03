<script setup lang="ts">
import { computed } from "vue";
import { useChartResponsive } from "../composables/useChartResponsive";
import type { ChartData } from "../types/chart";

interface Props {
	chartData: ChartData;
	mobileComponent?: string;
	tabletComponent?: string;
	desktopComponent?: string;
}

const props = withDefaults(defineProps<Props>(), {
	mobileComponent: "BarChart",
	tabletComponent: "LineChart",
	desktopComponent: "AreaChart",
});

const { isMobile, isTablet, isDesktop } = useChartResponsive();

const currentComponent = computed(() => {
	if (isMobile.value) return props.mobileComponent;
	if (isTablet.value) return props.tabletComponent;
	return props.desktopComponent;
});
</script>

<template>
  <div class="relative">
    <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs z-10 flex items-center gap-1">
      <Icon v-if="isMobile" name="lucide:smartphone" />
      <Icon v-else-if="isTablet" name="lucide:tablet" />
      <Icon v-else name="lucide:monitor" />
      <span v-if="isMobile">Mobile View</span>
      <span v-else-if="isTablet">Tablet View</span>
      <span v-else>Desktop View</span>
    </div>

    <component :is="currentComponent" :data="chartData" />
  </div>
</template>
