import { ref, readonly } from "vue";
import type { ChartSeries } from '@/module/app/types/chart-basic';

export function useChartSeries(initialSeries?: ChartSeries[]) {
	const series = ref<ChartSeries[]>(initialSeries || []);

	const addSeries = (newSeries: ChartSeries) => {
		series.value.push(newSeries);
	};

	const removeSeries = (index: number) => {
		series.value.splice(index, 1);
	};

	const updateSeries = (index: number, updatedSeries: ChartSeries) => {
		series.value[index] = updatedSeries;
	};

	return {
		series: readonly(series),
		addSeries,
		removeSeries,
		updateSeries,
	};
}
