import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Kagi Chart - Japanese chart type that ignores time and focuses on price reversals
 */

export interface KagiLine {
  startPrice: number;
  endPrice: number;
  isYang: boolean; // true = up, false = down (yin)
  thickness: number; // line thickness
  x: number; // horizontal position
  y1: number;
  y2: number;
}

/**
 * Generate Kagi chart data
 */
export function generateKagiData(
  prices: Array<{ date: Date; price: number }>,
  reversalAmount: number, // price change to reverse direction
  options: {
    title?: string;
    yangColor?: string;
    yinColor?: string;
    thicknessUp?: number;
    thicknessDown?: number;
  } = {},
): ChartData {
  const { title, yangColor = '#26a69a', yinColor = '#ef5350', thicknessUp = 2, thicknessDown = 1 } = options;

  const lines: KagiLine[] = [];
  let currentPrice = prices[0]?.price || 0;
  let isYang = true;
  let thickness = thicknessUp;
  let x = 0;

  for (const pricePoint of prices.slice(1)) {
    const price = pricePoint.price;
    const change = price - currentPrice;

    if (Math.abs(change) >= reversalAmount) {
      // Direction change or continuation
      const newIsYang = change > 0;

      // Shoulder reversal (thickness change)
      if (newIsYang !== isYang) {
        // Check if previous high/low was exceeded
        const shouldChangeThickness = checkShoulderReversal(lines, price, newIsYang);
        if (shouldChangeThickness) {
          thickness = newIsYang ? thicknessUp : thicknessDown;
        }
      }

      lines.push({
        startPrice: currentPrice,
        endPrice: price,
        isYang: newIsYang,
        thickness,
        x,
        y1: currentPrice,
        y2: price,
      });

      x++;
      isYang = newIsYang;
      currentPrice = price;
    }
  }

  const data: DataPoint[] = lines.map((line, i) => ({
    x: i,
    y: line.endPrice,
    kagi: line,
    color: line.isYang ? yangColor : yinColor,
    label: `${line.isYang ? 'Yang' : 'Yin'}: ${line.startPrice} → ${line.endPrice}`,
  }));

  return {
    title,
    series: [
      {
        name: 'Kagi',
        data,
        type: 'kagi',
      },
    ],
  };
}

function checkShoulderReversal(lines: KagiLine[], price: number, goingUp: boolean): boolean {
  if (lines.length < 2) return false;

  const lastLine = lines[lines.length - 1];
  const prevLine = lines[lines.length - 2];

  if (goingUp) {
    // Going up - check if exceeded previous shoulder (yang peak)
    return price > Math.max(lastLine.startPrice, prevLine.startPrice);
  } else {
    // Going down - check if exceeded previous shoulder (yin valley)
    return price < Math.min(lastLine.startPrice, prevLine.startPrice);
  }
}

/**
 * Calculate optimal reversal amount based on volatility
 */
export function calculateOptimalReversal(
  prices: number[],
  method: 'atr' | 'percent' = 'atr',
): number {
  if (method === 'percent') {
    // Use 4% of average price
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    return avg * 0.04;
  } else {
    // Average True Range approximation
    const ranges = prices.slice(1).map((p, i) => Math.abs(p - prices[i]));
    const atr = ranges.reduce((sum, r) => sum + r, 0) / ranges.length;
    return atr * 1.5;
  }
}

/**
 * Analyze Kagi chart patterns
 */
export function analyzeKagiPatterns(
  data: ChartData,
): Array<{
  pattern: 'shoulder' | 'waist' | 'trend';
  index: number;
  description: string;
}> {
  const patterns: Array<{ pattern: 'shoulder' | 'waist' | 'trend'; index: number; description: string }> = [];
  const series = data.series[0];
  if (!series) return patterns;

  const lines = series.data.map((d) => d.kagi as KagiLine);

  for (let i = 2; i < lines.length; i++) {
    const current = lines[i];
    const prev = lines[i - 1];
    const prev2 = lines[i - 2];

    // Shoulder - peak where direction changes from up to down
    if (prev.isYang && !current.isYang && prev.endPrice > prev2.endPrice) {
      patterns.push({
        pattern: 'shoulder',
        index: i - 1,
        description: `Shoulder at ${prev.endPrice}`,
      });
    }

    // Waist - valley where direction changes from down to up
    if (!prev.isYang && current.isYang && prev.endPrice < prev2.endPrice) {
      patterns.push({
        pattern: 'waist',
        index: i - 1,
        description: `Waist at ${prev.endPrice}`,
      });
    }

    // Trend continuation
    if (current.isYang === prev.isYang && current.thickness === prev.thickness) {
      patterns.push({
        pattern: 'trend',
        index: i,
        description: `${current.isYang ? 'Up' : 'Down'} trend continues`,
      });
    }
  }

  return patterns;
}
