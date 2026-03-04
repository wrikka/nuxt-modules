import type { CandlestickData } from '@/module/app/types/chart-basic';

/**
 * Identify support and resistance levels
 */
export function identifySupportResistance(
	data: CandlestickData,
	tolerance: number = 0.02,
): { support: number[]; resistance: number[] } {
	const prices = data.data.flatMap((candle) => [
		candle.high,
		candle.low,
		candle.close,
	]);
	const sortedPrices = [...new Set(prices)].sort((a, b) => a - b);

	const support: number[] = [];
	const resistance: number[] = [];

	// Simple method: find price levels that appear frequently
	const clusters = clusterPrices(sortedPrices, tolerance);

	clusters.forEach((cluster) => {
		const level = cluster.reduce((a, b) => a + b, 0) / cluster.length;
		const count = cluster.length;

		if (count >= 3) {
			// At least 3 touches
			// Determine if it's support or resistance based on context
			const highs = data.data.map((c) => c.high);
			const lows = data.data.map((c) => c.low);

			const highTouches = highs.filter(
				(h) => Math.abs(h - level) / level <= tolerance,
			).length;
			const lowTouches = lows.filter(
				(l) => Math.abs(l - level) / level <= tolerance,
			).length;

			if (lowTouches > highTouches) {
				support.push(level);
			} else if (highTouches > lowTouches) {
				resistance.push(level);
			}
		}
	});

	return { support, resistance };
}

// Helper to cluster prices within tolerance
function clusterPrices(prices: number[], tolerance: number): number[][] {
	const clusters: number[][] = [];

	prices.forEach((price) => {
		let added = false;

		for (const cluster of clusters) {
			const clusterAvg = cluster.reduce((a, b) => a + b, 0) / cluster.length;
			if (Math.abs(price - clusterAvg) / clusterAvg <= tolerance) {
				cluster.push(price);
				added = true;
				break;
			}
		}

		if (!added) {
			clusters.push([price]);
		}
	});

	return clusters;
}

/**
 * Calculate candlestick volume profile
 */
export function calculateVolumeProfile(
	data: CandlestickData,
	bins: number = 20,
): Array<{ price: number; volume: number }> {
	const volumes = data.data.map((c) => c.volume || 0);
	const prices = data.data.map((c) => (c.high + c.low + c.close) / 3); // Typical price

	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);
	const binSize = (maxPrice - minPrice) / bins;

	const volumeProfile: Array<{ price: number; volume: number }> = [];

	for (let i = 0; i < bins; i++) {
		const binStart = minPrice + i * binSize;
		const binEnd = minPrice + (i + 1) * binSize;
		const binCenter = (binStart + binEnd) / 2;

		let binVolume = 0;
		data.data.forEach((candle, index) => {
			const price = prices[index];
			const volume = volumes[index];

			if (price >= binStart && price < binEnd) {
				binVolume += volume;
			}
		});

		volumeProfile.push({
			price: binCenter,
			volume: binVolume,
		});
	}

	return volumeProfile;
}


