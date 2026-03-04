import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Renko Chart - Japanese chart type using bricks of fixed size
 */

export interface RenkoBrick {
  price: number;
  volume: number;
  isUp: boolean;
  x: number;
  y: number;
}

/**
 * Generate Renko chart data
 */
export function generateRenkoData(
  prices: Array<{ date: Date; price: number; volume?: number }>,
  brickSize: number,
  options: {
    title?: string;
    colorUp?: string;
    colorDown?: string;
    useATR?: boolean;
    atrPeriod?: number;
  } = {},
): ChartData {
  const { title, colorUp = '#26a69a', colorDown = '#ef5350', useATR, atrPeriod = 14 } = options;

  // Calculate brick size if using ATR
  let actualBrickSize = brickSize;
  if (useATR) {
    actualBrickSize = calculateATR(prices.map((p) => p.price), atrPeriod);
  }

  const bricks: RenkoBrick[] = [];
  let currentPrice = prices[0]?.price || 0;
  let currentX = 0;
  let currentY = 0;
  let lastWasUp = true;

  for (const pricePoint of prices.slice(1)) {
    const price = pricePoint.price;
    const change = price - currentPrice;

    if (Math.abs(change) >= actualBrickSize) {
      const numBricks = Math.floor(Math.abs(change) / actualBrickSize);
      const isUp = change > 0;

      for (let i = 0; i < numBricks; i++) {
        // New column if direction changes
        if (isUp !== lastWasUp && i === 0) {
          currentX++;
        }

        bricks.push({
          price: currentPrice + (isUp ? 1 : -1) * (i + 1) * actualBrickSize,
          volume: pricePoint.volume || 0,
          isUp,
          x: currentX,
          y: currentY + (isUp ? i : -i),
        });

        lastWasUp = isUp;
      }

      currentY += isUp ? numBricks : -numBricks;
      currentPrice += (isUp ? 1 : -1) * numBricks * actualBrickSize;
    }
  }

  const data: DataPoint[] = bricks.map((brick) => ({
    x: brick.x,
    y: brick.price,
    renko: brick,
    color: brick.isUp ? colorUp : colorDown,
    label: `${brick.isUp ? 'Up' : 'Down'}: ${brick.price}`,
  }));

  return {
    title,
    series: [
      {
        name: 'Renko',
        data,
        type: 'renko',
      },
    ],
  };
}

/**
 * Calculate Average True Range for dynamic brick sizing
 */
function calculateATR(prices: number[], period: number): number {
  if (prices.length < period + 1) return prices[0] * 0.02; // Default 2%

  const trValues = prices.slice(1).map((price, i) => Math.abs(price - prices[i]));
  const atr = trValues.slice(0, period).reduce((sum, tr) => sum + tr, 0) / period;

  return Math.max(atr, prices[prices.length - 1] * 0.01); // Minimum 1%
}

/**
 * Calculate optimal brick size
 */
export function calculateOptimalBrickSize(
  prices: number[],
  method: 'percent' | 'atr' | 'fixed' = 'atr',
): number {
  switch (method) {
    case 'percent':
      const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      return avg * 0.02; // 2%
    case 'atr':
      return calculateATR(prices, 14);
    case 'fixed':
    default:
      // Find significant price movements
      const changes = prices.slice(1).map((p, i) => Math.abs(p - prices[i]));
      changes.sort((a, b) => a - b);
      return changes[Math.floor(changes.length * 0.7)] || prices[0] * 0.01;
  }
}

/**
 * Detect Renko patterns
 */
export function detectRenkoPatterns(
  data: ChartData,
): Array<{
  pattern: 'column' | 'reversal' | 'trend';
  index: number;
  description: string;
}> {
  const patterns: Array<{ pattern: 'column' | 'reversal' | 'trend'; index: number; description: string }> = [];
  const series = data.series[0];
  if (!series) return patterns;

  const bricks = series.data.map((d) => d.renko as RenkoBrick);

  for (let i = 1; i < bricks.length; i++) {
    const current = bricks[i];
    const prev = bricks[i - 1];

    if (current.x !== prev.x) {
      patterns.push({
        pattern: 'column',
        index: i,
        description: `New column at x=${current.x}`,
      });
    }

    if (current.isUp !== prev.isUp) {
      patterns.push({
        pattern: 'reversal',
        index: i,
        description: `${prev.isUp ? 'Up' : 'Down'} to ${current.isUp ? 'Up' : 'Down'} reversal`,
      });
    }

    if (current.isUp === prev.isUp && current.x === prev.x) {
      patterns.push({
        pattern: 'trend',
        index: i,
        description: `${current.isUp ? 'Up' : 'Down'} trend continues`,
      });
    }
  }

  return patterns;
}
