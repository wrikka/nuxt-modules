import type { CandlestickData, CandlestickPoint } from '@/module/app/types/chart-basic';

/**
 * Generate candlestick data from OHLC values
 */
export function generateCandlestickData(
	data: Array<{
		x: number | string | Date;
		open: number;
		high: number;
		low: number;
		close: number;
		volume?: number;
	}>,
	options: {
		title?: string;
	} = {},
): CandlestickData {
	const { title } = options;

	const candlestickData: CandlestickPoint[] = data.map((item) => ({
		x: item.x,
		open: item.open,
		high: item.high,
		low: item.low,
		close: item.close,
		volume: item.volume,
	}));

	return {
		data: candlestickData,
	};
}

/**
 * Generate candlestick data from price history
 */
export function generateCandlestickFromPrices(
	prices: number[],
	period: number = 4,
	options: {
		title?: string;
		startDate?: Date;
	} = {},
): CandlestickData {
	const { title, startDate = new Date() } = options;

	if (prices.length < period) {
		throw new Error("Not enough price data for the specified period");
	}

	const candlesticks: CandlestickPoint[] = [];

	for (let i = 0; i <= prices.length - period; i += period) {
		const periodPrices = prices.slice(i, i + period);
		const open = periodPrices[0];
		const close = periodPrices[periodPrices.length - 1];
		const high = Math.max(...periodPrices);
		const low = Math.min(...periodPrices);

		candlesticks.push({
			x: new Date(startDate.getTime() + (i / period) * 24 * 60 * 60 * 1000),
			open,
			high,
			low,
			close,
			volume: periodPrices.length,
		});
	}

	return {
		data: candlesticks,
	};
}


