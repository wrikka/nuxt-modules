import type { CandlestickData, CandlestickPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate moving averages for candlestick data
 */
export function calculateCandlestickMovingAverages(
	data: CandlestickData,
	periods: number[] = [5, 10, 20],
): Array<{ period: number; values: number[] }> {
	const closes = data.data.map((candle) => candle.close);

	return periods.map((period) => ({
		period,
		values: calculateSMA(closes, period),
	}));
}

// Simple Moving Average helper
function calculateSMA(values: number[], period: number): number[] {
	const sma: number[] = [];

	for (let i = period - 1; i < values.length; i++) {
		const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
		sma.push(sum / period);
	}

	return sma;
}

/**
 * Calculate candlestick statistics
 */
export function calculateCandlestickStats(data: CandlestickData) {
	const closes = data.data.map((c) => c.close);
	const highs = data.data.map((c) => c.high);
	const lows = data.data.map((c) => c.low);
	const volumes = data.data.map((c) => c.volume || 0).filter((v) => v > 0);

	const avgVolume =
		volumes.length > 0
			? volumes.reduce((a, b) => a + b, 0) / volumes.length
			: 0;

	return {
		priceRange: {
			min: Math.min(...closes),
			max: Math.max(...closes),
			avg: closes.reduce((a, b) => a + b, 0) / closes.length,
		},
		volatility: {
			highLowRange: Math.max(...highs) - Math.min(...lows),
			averageTrueRange: calculateATR(data.data),
		},
		volume: {
			total: volumes.reduce((a, b) => a + b, 0),
			average: avgVolume,
			max: Math.max(...volumes),
			min: Math.min(...volumes),
		},
		trends: {
			direction: closes[closes.length - 1] > closes[0] ? "up" : "down",
			changePercent:
				((closes[closes.length - 1] - closes[0]) / closes[0]) * 100,
		},
	};
}

// Average True Range helper
function calculateATR(
	candles: CandlestickPoint[],
	period: number = 14,
): number {
	const trueRanges: number[] = [];

	for (let i = 1; i < candles.length; i++) {
		const current = candles[i];
		const previous = candles[i - 1];

		const tr1 = current.high - current.low;
		const tr2 = Math.abs(current.high - previous.close);
		const tr3 = Math.abs(current.low - previous.close);

		trueRanges.push(Math.max(tr1, tr2, tr3));
	}

	if (trueRanges.length < period) return 0;

	const recentTR = trueRanges.slice(-period);
	return recentTR.reduce((a, b) => a + b, 0) / period;
}


