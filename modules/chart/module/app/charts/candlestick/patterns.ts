import type { CandlestickData, CandlestickPoint } from '@/module/app/types/chart-basic';

/**
 * Calculate candlestick patterns
 */
export function calculateCandlestickPatterns(data: CandlestickData): Array<{
	index: number;
	pattern: string;
	bullish: boolean;
	strength: number;
}> {
	const patterns: Array<{
		index: number;
		pattern: string;
		bullish: boolean;
		strength: number;
	}> = [];

	data.data.forEach((candle, index) => {
		if (index === 0) return;

		const prevCandle = data.data[index - 1];
		const candlePatterns = analyzeSingleCandle(candle, prevCandle, index);

		candlePatterns.forEach((pattern) => {
			patterns.push(pattern);
		});
	});

	return patterns;
}

// Helper function to analyze single candle
function analyzeSingleCandle(
	current: CandlestickPoint,
	previous: CandlestickPoint,
	index: number,
): Array<{
	index: number;
	pattern: string;
	bullish: boolean;
	strength: number;
}> {
	const patterns: Array<{
		index: number;
		pattern: string;
		bullish: boolean;
		strength: number;
	}> = [];

	const bodySize = Math.abs(current.close - current.open);
	const upperShadow = current.high - Math.max(current.open, current.close);
	const lowerShadow = Math.min(current.open, current.close) - current.low;
	const totalRange = current.high - current.low;

	// Doji
	if (bodySize / totalRange < 0.1) {
		patterns.push({
			index,
			pattern: "Doji",
			bullish: current.close > previous.close,
			strength: 0.5,
		});
	}

	// Hammer
	if (lowerShadow > bodySize * 2 && upperShadow < bodySize * 0.5) {
		patterns.push({
			index,
			pattern: "Hammer",
			bullish: true,
			strength: 0.7,
		});
	}

	// Shooting Star
	if (upperShadow > bodySize * 2 && lowerShadow < bodySize * 0.5) {
		patterns.push({
			index,
			pattern: "Shooting Star",
			bullish: false,
			strength: 0.7,
		});
	}

	// Bullish Engulfing
	if (
		current.close > current.open &&
		previous.close < previous.open &&
		current.close > previous.open &&
		current.open < previous.close
	) {
		patterns.push({
			index,
			pattern: "Bullish Engulfing",
			bullish: true,
			strength: 0.8,
		});
	}

	// Bearish Engulfing
	if (
		current.close < current.open &&
		previous.close > previous.open &&
		current.close < previous.open &&
		current.open > previous.close
	) {
		patterns.push({
			index,
			pattern: "Bearish Engulfing",
			bullish: false,
			strength: 0.8,
		});
	}

	return patterns;
}


