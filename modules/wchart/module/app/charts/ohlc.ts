import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * OHLC (Open-High-Low-Close) chart data and utilities
 */

export interface OHLCCandle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

/**
 * Generate OHLC chart data
 */
export function generateOHLCData(
  candles: OHLCCandle[],
  options: {
    title?: string;
    colorUp?: string;
    colorDown?: string;
  } = {},
): ChartData {
  const { title, colorUp = '#26a69a', colorDown = '#ef5350' } = options;

  const data: DataPoint[] = candles.map((candle) => ({
    x: candle.date.toISOString(),
    y: candle.close,
    ohlc: {
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    },
    volume: candle.volume,
    color: candle.close >= candle.open ? colorUp : colorDown,
    label: `O: ${candle.open} H: ${candle.high} L: ${candle.low} C: ${candle.close}`,
  }));

  return {
    title,
    series: [
      {
        name: 'OHLC',
        data,
        type: 'candlestick',
      },
    ],
  };
}

/**
 * Calculate moving average for OHLC data
 */
export function calculateMovingAverage(
  candles: OHLCCandle[],
  period: number,
  type: 'simple' | 'exponential' = 'simple',
): Array<{ date: Date; value: number }> {
  if (candles.length < period) return [];

  const closes = candles.map((c) => c.close);

  if (type === 'simple') {
    return candles.slice(period - 1).map((candle, i) => {
      const sum = closes.slice(i, i + period).reduce((a, b) => a + b, 0);
      return { date: candle.date, value: sum / period };
    });
  } else {
    // Exponential Moving Average
    const multiplier = 2 / (period + 1);
    const ema: Array<{ date: Date; value: number }> = [];
    let prevEma = closes.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period - 1; i < closes.length; i++) {
      const date = candles[i].date;
      if (i === period - 1) {
        ema.push({ date, value: prevEma });
      } else {
        prevEma = (closes[i] - prevEma) * multiplier + prevEma;
        ema.push({ date, value: prevEma });
      }
    }
    return ema;
  }
}

/**
 * Detect candlestick patterns
 */
export function detectCandlestickPatterns(
  candles: OHLCCandle[],
): Array<{
  index: number;
  pattern: string;
  confidence: number;
}> {
  const patterns: Array<{ index: number; pattern: string; confidence: number }> = [];

  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const prev = candles[i - 1];

    // Doji
    const bodySize = Math.abs(current.close - current.open);
    const range = current.high - current.low;
    if (bodySize < range * 0.1) {
      patterns.push({ index: i, pattern: 'Doji', confidence: 0.8 });
    }

    // Hammer
    const lowerShadow = Math.min(current.open, current.close) - current.low;
    const upperShadow = current.high - Math.max(current.open, current.close);
    if (lowerShadow > bodySize * 2 && upperShadow < bodySize) {
      patterns.push({ index: i, pattern: 'Hammer', confidence: 0.7 });
    }

    // Shooting Star
    if (upperShadow > bodySize * 2 && lowerShadow < bodySize) {
      patterns.push({ index: i, pattern: 'Shooting Star', confidence: 0.7 });
    }

    // Engulfing
    const prevBody = Math.abs(prev.close - prev.open);
    if (bodySize > prevBody * 1.5) {
      if (current.close > current.open && prev.close < prev.open &&
          current.open < prev.close && current.close > prev.open) {
        patterns.push({ index: i, pattern: 'Bullish Engulfing', confidence: 0.85 });
      } else if (current.close < current.open && prev.close > prev.open &&
                 current.open > prev.close && current.close < prev.open) {
        patterns.push({ index: i, pattern: 'Bearish Engulfing', confidence: 0.85 });
      }
    }
  }

  return patterns;
}

/**
 * Calculate Bollinger Bands
 */
export function calculateBollingerBands(
  candles: OHLCCandle[],
  period: number = 20,
  stdDev: number = 2,
): Array<{
  date: Date;
  middle: number;
  upper: number;
  lower: number;
}> {
  const closes = candles.map((c) => c.close);

  return candles.slice(period - 1).map((candle, i) => {
    const slice = closes.slice(i, i + period);
    const sma = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
    const std = Math.sqrt(variance);

    return {
      date: candle.date,
      middle: sma,
      upper: sma + stdDev * std,
      lower: sma - stdDev * std,
    };
  });
}
