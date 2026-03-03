import { ref, readonly } from "vue";
import { DEFAULT_COLORS } from "../utils/chart-constants";
import { getSeriesColor } from '@/module/app/utils/chart-utils';

export function useChartColors(initialColors?: string[]) {
	const colors = ref<string[]>(initialColors || [...DEFAULT_COLORS]);

	const addColor = (color: string) => {
		colors.value.push(color);
	};

	const getColor = (index: number) => {
		return colors.value[index] || getSeriesColor(index);
	};

	return {
		colors: readonly(colors),
		addColor,
		getColor,
	};
}
