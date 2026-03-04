import { ref, readonly } from "vue";
import { DEFAULT_CHART_DIMENSIONS } from "../utils/chart-constants";
import type { ChartConfig } from '@/module/app/types/chart-basic';

export function useChartConfig(initialConfig?: Partial<ChartConfig>) {
	const config = ref<ChartConfig>({
		...DEFAULT_CHART_DIMENSIONS,
		responsive: true,
		theme: "light",
		...initialConfig,
	});

	const updateConfig = (newConfig: Partial<ChartConfig>) => {
		config.value = { ...config.value, ...newConfig };
	};

	return {
		config: readonly(config),
		updateConfig,
	};
}
