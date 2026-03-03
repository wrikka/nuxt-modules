import type { ChartData } from '@/module/app/types/chart-basic';

/**
 * Calculate conversion rates between funnel stages
 */
export function calculateFunnelConversionRates(data: ChartData): Array<{
	from: string;
	to: string;
	rate: number;
	dropoff: number;
}> {
	const series = data.series[0];
	if (!series || series.data.length < 2) return [];

	const rates: Array<{
		from: string;
		to: string;
		rate: number;
		dropoff: number;
	}> = [];

	for (let i = 0; i < series.data.length - 1; i++) {
		const current = series.data[i];
		const next = series.data[i + 1];
		const currentValue = typeof current.y === "number" ? current.y : 0;
		const nextValue = typeof next.y === "number" ? next.y : 0;

		const rate = currentValue > 0 ? nextValue / currentValue : 0;
		const dropoff = currentValue - nextValue;

		rates.push({
			from: current.x as string,
			to: next.x as string,
			rate,
			dropoff,
		});
	}

	return rates;
}

/**
 * Calculate funnel efficiency metrics
 */
export function calculateFunnelEfficiency(data: ChartData) {
	const series = data.series[0];
	if (!series) return null;

	const values = series.data.map((p) => (typeof p.y === "number" ? p.y : 0));
	const initial = values[0];
	const final = values[values.length - 1];

	const conversionRates = calculateFunnelConversionRates(data);
	const averageConversionRate =
		conversionRates.reduce((sum, r) => sum + r.rate, 0) /
		conversionRates.length;
	const totalDropoff = initial - final;
	const overallConversionRate = initial > 0 ? final / initial : 0;

	return {
		initialValue: initial,
		finalValue: final,
		totalDropoff,
		overallConversionRate,
		averageConversionRate,
		stageCount: values.length,
		conversionRates,
		efficiency: overallConversionRate * 100, // as percentage
	};
}

/**
 * Calculate funnel stage contributions
 */
export function calculateFunnelContributions(data: ChartData): Array<{
	stage: string;
	value: number;
	percentage: number;
	contribution: number;
}> {
	const series = data.series[0];
	if (!series) return [];

	const total = series.data.reduce((sum, point) => {
		return sum + (typeof point.y === "number" ? point.y : 0);
	}, 0);

	if (total === 0) return [];

	return series.data.map((point) => {
		const value = typeof point.y === "number" ? point.y : 0;
		const percentage = (value / total) * 100;
		const contribution = value; // Absolute contribution

		return {
			stage: point.x as string,
			value,
			percentage,
			contribution,
		};
	});
}


