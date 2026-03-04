import { ref, computed } from "vue";

export interface AnalyticsMetric {
	name: string;
	value: number;
	change: number;
	unit?: string;
}

export interface TimeSeriesData {
	date: string;
	value: number;
}

export interface PresentationReport {
	id: string;
	title: string;
	presentedAt: Date;
	duration: number;
	metrics: AnalyticsMetric[];
	engagementOverTime: TimeSeriesData[];
	audienceSize: number;
	questionsAsked: number;
	pollsConducted: number;
}

export function useAnalyticsDashboard() {
	const reports = ref<PresentationReport[]>([]);
	const selectedReport = ref<PresentationReport | null>(null);
	const dateRange = ref<{ start: Date; end: Date } | null>(null);
	const isLoading = ref(false);

	const totalPresentations = computed(() => reports.value.length);
	
	const avgDuration = computed(() => {
		if (reports.value.length === 0) return 0;
		const total = reports.value.reduce((sum, r) => sum + r.duration, 0);
		return Math.round(total / reports.value.length / 60000); // minutes
	});
	
	const totalAudience = computed(() => 
		reports.value.reduce((sum, r) => sum + r.audienceSize, 0)
	);
	
	const avgEngagement = computed(() => {
		if (reports.value.length === 0) return 0;
		const total = reports.value.reduce((sum, r) => {
			const engagementMetric = r.metrics.find(m => m.name === "engagement");
			return sum + (engagementMetric?.value || 0);
		}, 0);
		return Math.round(total / reports.value.length);
	});

	const filteredReports = computed(() => {
		if (!dateRange.value) return reports.value;
		
		return reports.value.filter(r => {
			const date = new Date(r.presentedAt);
			return date >= dateRange.value!.start && date <= dateRange.value!.end;
		});
	});

	const topPerforming = computed(() => {
		return [...reports.value]
			.sort((a, b) => {
				const aEngagement = a.metrics.find(m => m.name === "engagement")?.value || 0;
				const bEngagement = b.metrics.find(m => m.name === "engagement")?.value || 0;
				return bEngagement - aEngagement;
			})
			.slice(0, 5);
	});

	async function loadReports() {
		isLoading.value = true;
		try {
			const response = await fetch("/api/wslide/analytics/reports");
			const data = await response.json();
			reports.value = data.map((r: PresentationReport) => ({
				...r,
				presentedAt: new Date(r.presentedAt),
			}));
		} finally {
			isLoading.value = false;
		}
	}

	function setDateRange(start: Date, end: Date) {
		dateRange.value = { start, end };
	}

	function clearDateRange() {
		dateRange.value = null;
	}

	function getEngagementTrend(): { direction: "up" | "down" | "stable"; percentage: number } {
		if (reports.value.length < 2) return { direction: "stable", percentage: 0 };
		
		const recent = reports.value.slice(-5);
		const engagementScores = recent.map(r => 
			r.metrics.find(m => m.name === "engagement")?.value || 0
		);
		
		const first = engagementScores[0];
		const last = engagementScores[engagementScores.length - 1];
		
		if (first === 0) return { direction: "stable", percentage: 0 };
		
		const change = ((last - first) / first) * 100;
		
		return {
			direction: change > 5 ? "up" : change < -5 ? "down" : "stable",
			percentage: Math.abs(Math.round(change)),
		};
	}

	function exportReport(reportId: string): string | null {
		const report = reports.value.find(r => r.id === reportId);
		return report ? JSON.stringify(report, null, 2) : null;
	}

	function exportAllReports(): string {
		return JSON.stringify(reports.value, null, 2);
	}

	function getComparisonData(metricName: string): { labels: string[]; values: number[] } {
		const labels: string[] = [];
		const values: number[] = [];
		
		for (const report of reports.value) {
			const metric = report.metrics.find(m => m.name === metricName);
			if (metric) {
				labels.push(report.title);
				values.push(metric.value);
			}
		}
		
		return { labels, values };
	}

	return {
		reports: readonly(reports),
		selectedReport: readonly(selectedReport),
		dateRange: readonly(dateRange),
		isLoading: readonly(isLoading),
		totalPresentations,
		avgDuration,
		totalAudience,
		avgEngagement,
		filteredReports,
		topPerforming,
		loadReports,
		setDateRange,
		clearDateRange,
		getEngagementTrend,
		exportReport,
		exportAllReports,
		getComparisonData,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
