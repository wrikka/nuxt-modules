import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Heikin-Ashi Candlesticks - Smoothed candlestick chart
 */

export interface HeikinAshiCandle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  haOpen: number;
  haHigh: number;
  haLow: number;
  haClose: number;
}

/**
 * Generate Heikin-Ashi chart data from regular OHLC data
 */
export function generateHeikinAshiData(
  candles: Array<{ date: Date; open: number; high: number; low: number; close: number }>,
  options: {
    title?: string;
    colorUp?: string;
    colorDown?: string;
  } = {},
): ChartData {
  const { title, colorUp = '#26a69a', colorDown = '#ef5350' } = options;

  const haCandles: HeikinAshiCandle[] = [];
  let prevHAOpen = 0;
  let prevHAClose = 0;

  for (const candle of candles) {
    // Heikin-Ashi calculations
    const haClose = (candle.open + candle.high + candle.low + candle.close) / 4;
    const haOpen = haCandles.length === 0
      ? (candle.open + candle.close) / 2
      : (prevHAOpen + prevHAClose) / 2;
    const haHigh = Math.max(candle.high, haOpen, haClose);
    const haLow = Math.min(candle.low, haOpen, haClose);

    const haCandle: HeikinAshiCandle = {
      date: candle.date,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      haOpen,
      haHigh,
      haLow,
      haClose,
    };

    haCandles.push(haCandle);
    prevHAOpen = haOpen;
    prevHAClose = haClose;
  }

  const data: DataPoint[] = haCandles.map((c) => ({
    x: c.date.toISOString(),
    y: c.haClose,
    heikinAshi: c,
    color: c.haClose >= c.haOpen ? colorUp : colorDown,
    label: `HA: O:${c.haOpen.toFixed(2)} H:${c.haHigh.toFixed(2)} L:${c.haLow.toFixed(2)} C:${c.haClose.toFixed(2)}`,
  }));

  return {
    title,
    series: [
      {
        name: 'Heikin-Ashi',
        data,
        type: 'heikinAshi',
      },
    ],
  };
}

/**
 * Detect Heikin-Ashi trends and reversals
 */
export function detectHeikinAshiTrends(
  data: ChartData,
): Array<{
  type: 'strong_up' | 'strong_down' | 'weak_up' | 'weak_down' | 'reversal' | 'doji';
  index: number;
  description: string;
}> {
  const trends: Array<{ type: 'strong_up' | 'strong_down' | 'weak_up' | 'weak_down' | 'reversal' | 'doji'; index: number; description: string }> = [];
  const series = data.series[0];
  if (!series) return trends;

  const candles = series.data.map((d) => d.heikinAshi as HeikinAshiCandle);

  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const prev = candles[i - 1];

    const bodySize = Math.abs(current.haClose - current.haOpen);
    const range = current.haHigh - current.haLow;
    const isUp = current.haClose >= current.haOpen;
    const prevIsUp = prev.haClose >= prev.haOpen;

    // Strong trends
    if (isUp && bodySize > range * 0.6 && current.haLow > prev.haLow) {
      trends.push({
        type: 'strong_up',
        index: i,
        description: 'Strong uptrend',
      });
    } else if (!isUp && bodySize > range * 0.6 && current.haHigh < prev.haHigh) {
      trends.push({
        type: 'strong_down',
        index: i,
        description: 'Strong downtrend',
      });
    }

    // Weak trends (small body)
    else if (isUp && bodySize < range * 0.3) {
      trends.push({
        type: 'weak_up',
        index: i,
        description: 'Weak uptrend - possible reversal',
      });
    } else if (!isUp && bodySize < range * 0.3) {
      trends.push({
        type: 'weak_down',
        index: i,
        description: 'Weak downtrend - possible reversal',
      });
    }

    // Reversal
    if (isUp !== prevIsUp) {
      trends.push({
        type: 'reversal',
        index: i,
        description: `${prevIsUp ? 'Bullish' : 'Bearish'} to ${isUp ? 'Bullish' : 'Bearish'} reversal`,
      });
    }

    // Doji (very small body)
    if (bodySize < range * 0.1) {
      trends.push({
        type: 'doji',
        index: i,
        description: 'Doji - indecision',
      });
    }
  }

  return trends;
}

/**
 * Calculate trend strength from Heikin-Ashi
 */
export function calculateTrendStrength(
  data: ChartData,
): {
  currentTrend: 'up' | 'down' | 'neutral';
  strength: number; // 0-1
  consistency: number; // How consistent are the candles
} {
  const series = data.series[0];
  if (!series || series.data.length < 3) {
    return { currentTrend: 'neutral', strength: 0, consistency: 0 };
  }

  const candles = series.data.map((d) => d.heikinAshi as HeikinAshiCandle);
  const recent = candles.slice(-5);

  const upCount = recent.filter((c) => c.haClose >= c.haOpen).length;
  const downCount = recent.length - upCount;

  const currentTrend = upCount > downCount ? 'up' : downCount > upCount ? 'down' : 'neutral';
  const strength = Math.abs(upCount - downCount) / recent.length;

  // Consistency - how aligned are consecutive candles
  let consistentCount = 0;
  for (let i = 1; i < recent.length; i++) {
    const currUp = recent[i].haClose >= recent[i].haOpen;
    const prevUp = recent[i - 1].haClose >= recent[i - 1].haOpen;
    if (currUp === prevUp) consistentCount++;
  }
  const consistency = consistentCount / (recent.length - 1);

  return { currentTrend, strength, consistency };
}
