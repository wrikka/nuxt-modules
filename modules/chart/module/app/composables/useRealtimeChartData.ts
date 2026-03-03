import { ref, readonly, onMounted, onUnmounted } from "vue";
import { generateRandomData } from '@/module/app/utils/chart-utils';
import type { ChartData } from '@/module/app/types/chart-basic';

export function useRealtimeChartData(
	options: {
		initialData?: ChartData;
		updateInterval?: number;
		enabled?: boolean;
	} = {},
) {
	const { initialData, updateInterval = 5000, enabled = true } = options;

	const chartData = ref<ChartData>(initialData || generateRandomData());
	const isRealtimeEnabled = ref(enabled);
	let intervalId: NodeJS.Timeout | null = null;

	const updateData = (newData: ChartData) => {
		chartData.value = newData;
	};

	const randomizeData = () => {
		chartData.value = generateRandomData();
	};

	const startRealtimeUpdates = () => {
		if (intervalId) return;
		intervalId = setInterval(() => {
			if (isRealtimeEnabled.value) {
				randomizeData();
			}
		}, updateInterval);
	};

	const stopRealtimeUpdates = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	};

	const toggleRealtime = () => {
		isRealtimeEnabled.value = !isRealtimeEnabled.value;
	};

	const setUpdateInterval = (newInterval: number) => {
		stopRealtimeUpdates();
		if (isRealtimeEnabled.value) {
			startRealtimeUpdates();
		}
	};

	onMounted(() => {
		if (enabled) {
			startRealtimeUpdates();
		}
	});

	onUnmounted(() => {
		stopRealtimeUpdates();
	});

	return {
		chartData: readonly(chartData),
		isRealtimeEnabled: readonly(isRealtimeEnabled),
		updateData,
		randomizeData,
		startRealtimeUpdates,
		stopRealtimeUpdates,
		toggleRealtime,
		setUpdateInterval,
	};
}
