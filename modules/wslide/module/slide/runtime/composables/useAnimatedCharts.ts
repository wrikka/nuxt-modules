import { ref, computed } from "vue";

type ChartType = "bar" | "line" | "pie" | "doughnut" | "radar" | "polar";

interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor?: string | string[];
		borderColor?: string | string[];
		borderWidth?: number;
	}[];
}

interface AnimationConfig {
	duration: number;
	easing: "linear" | "easeIn" | "easeOut" | "easeInOut";
	delay?: number;
	loop?: boolean;
}

interface AnimatedChart {
	id: string;
	type: ChartType;
	data: ChartData;
	animation: AnimationConfig;
	options?: Record<string, unknown>;
}

const colorPalettes = {
	default: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
	dark: ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"],
	pastel: ["#93c5fd", "#86efac", "#fcd34d", "#fca5a5", "#c4b5fd", "#fbcfe8"],
};

export function useAnimatedCharts() {
	const charts = ref<AnimatedChart[]>([]);
	const isAnimating = ref(false);
	const currentChart = ref<AnimatedChart | null>(null);

	const chartCount = computed(() => charts.value.length);
	const activeCharts = computed(() => charts.value.filter(c => c.animation.loop));

	function createChart(
		type: ChartType,
		data: ChartData,
		animationConfig?: Partial<AnimationConfig>,
	): AnimatedChart {
		const chart: AnimatedChart = {
			id: `chart-${Date.now()}`,
			type,
			data: applyColors(data),
			animation: {
				duration: 1000,
				easing: "easeInOut",
				delay: 0,
				loop: false,
				...animationConfig,
			},
		};
		
		charts.value.push(chart);
		return chart;
	}

	function applyColors(data: ChartData, palette: keyof typeof colorPalettes = "default"): ChartData {
		const colors = colorPalettes[palette];
		
		return {
			...data,
			datasets: data.datasets.map((dataset, index) => ({
				...dataset,
				backgroundColor: dataset.backgroundColor || colors[index % colors.length],
				borderColor: dataset.borderColor || colors[index % colors.length],
				borderWidth: dataset.borderWidth || 2,
			})),
		};
	}

	function animateChart(chartId: string, onComplete?: () => void) {
		const chart = charts.value.find(c => c.id === chartId);
		if (!chart) return;
		
		currentChart.value = chart;
		isAnimating.value = true;
		
		// Trigger animation via CSS/Canvas
		const event = new CustomEvent("wslide:chart-animate", { 
			detail: { chart, onComplete } 
		});
		window.dispatchEvent(event);
		
		setTimeout(() => {
			isAnimating.value = false;
			currentChart.value = null;
			onComplete?.();
		}, chart.animation.duration + (chart.animation.delay || 0));
	}

	function updateChartData(chartId: string, newData: Partial<ChartData>, animate = true) {
		const chart = charts.value.find(c => c.id === chartId);
		if (!chart) return;
		
		chart.data = { ...chart.data, ...newData };
		
		if (animate) {
			animateChart(chartId);
		}
	}

	function createBarChart(labels: string[], values: number[], label = "Data"): AnimatedChart {
		return createChart("bar", {
			labels,
			datasets: [{ label, data: values }],
		});
	}

	function createLineChart(labels: string[], values: number[], label = "Trend"): AnimatedChart {
		return createChart("line", {
			labels,
			datasets: [{ label, data: values }],
		});
	}

	function createPieChart(labels: string[], values: number[]): AnimatedChart {
		return createChart("pie", {
			labels,
			datasets: [{ label: "Distribution", data: values }],
		});
	}

	function createDoughnutChart(labels: string[], values: number[]): AnimatedChart {
		return createChart("doughnut", {
			labels,
			datasets: [{ label: "Distribution", data: values }],
		});
	}

	function createRadarChart(labels: string[], values: number[]): AnimatedChart {
		return createChart("radar", {
			labels,
			datasets: [{ label: "Metrics", data: values }],
		});
	}

	function deleteChart(chartId: string) {
		const index = charts.value.findIndex(c => c.id === chartId);
		if (index > -1) {
			charts.value.splice(index, 1);
		}
	}

	function exportChartData(chartId: string): string | null {
		const chart = charts.value.find(c => c.id === chartId);
		return chart ? JSON.stringify(chart.data, null, 2) : null;
	}

	function getChartConfig(chartId: string): Record<string, unknown> | null {
		const chart = charts.value.find(c => c.id === chartId);
		if (!chart) return null;
		
		return {
			type: chart.type,
			data: chart.data,
			options: {
				animation: {
					duration: chart.animation.duration,
					easing: chart.animation.easing,
				},
				responsive: true,
				maintainAspectRatio: false,
			},
		};
	}

	return {
		charts: readonly(charts),
		isAnimating: readonly(isAnimating),
		currentChart: readonly(currentChart),
		chartCount,
		activeCharts,
		colorPalettes,
		createChart,
		createBarChart,
		createLineChart,
		createPieChart,
		createDoughnutChart,
		createRadarChart,
		animateChart,
		updateChartData,
		deleteChart,
		exportChartData,
		getChartConfig,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
