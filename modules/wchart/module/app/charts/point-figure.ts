import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';

/**
 * Point & Figure Chart - Uses X and O columns to show price movements
 */

export interface PnFColumn {
  x: number;
  y: number;
  isX: boolean; // X = up, O = down
  count: number;
}

/**
 * Generate Point & Figure chart data
 */
export function generatePointFigureData(
  prices: number[],
  boxSize: number,
  reversalBoxes: number = 3,
  options: {
    title?: string;
    xColor?: string;
    oColor?: string;
  } = {},
): ChartData {
  const { title, xColor = '#26a69a', oColor = '#ef5350' } = options;

  const columns: PnFColumn[] = [];
  let currentX = 0;
  let currentY = Math.floor(prices[0] / boxSize) * boxSize;
  let isX = true; // true = X (up), false = O (down)
  let pendingDirection: 'up' | 'down' | null = null;
  let pendingCount = 0;

  for (const price of prices.slice(1)) {
    const boxLevel = Math.floor(price / boxSize) * boxSize;
    const boxes = Math.abs(boxLevel - currentY) / boxSize;

    if (boxes === 0) continue;

    const direction = boxLevel > currentY ? 'up' : 'down';

    if (pendingDirection === null) {
      pendingDirection = direction;
      pendingCount = boxes;
    } else if (direction === pendingDirection) {
      pendingCount += boxes;
    } else {
      // Direction changed - check if reversal is significant
      if (boxes >= reversalBoxes) {
        // Commit previous column
        columns.push({
          x: currentX,
          y: currentY,
          isX,
          count: pendingCount,
        });

        // Start new column
        currentX++;
        currentY = boxLevel;
        isX = direction === 'up';
        pendingDirection = direction;
        pendingCount = boxes;
      }
    }
  }

  // Commit final column
  if (pendingCount > 0) {
    columns.push({
      x: currentX,
      y: currentY,
      isX,
      count: pendingCount,
    });
  }

  const data: DataPoint[] = columns.map((col) => ({
    x: col.x,
    y: col.y,
    pnF: col,
    color: col.isX ? xColor : oColor,
    label: `${col.isX ? 'X' : 'O'} x${col.count} at ${col.y}`,
  }));

  return {
    title,
    series: [
      {
        name: 'Point & Figure',
        data,
        type: 'pointFigure',
      },
    ],
  };
}

/**
 * Calculate optimal box size
 */
export function calculateOptimalBoxSize(
  prices: number[],
  method: 'percent' | 'atr' | 'volatility' = 'percent',
): number {
  const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  switch (method) {
    case 'percent':
      return avg * 0.01; // 1%
    case 'atr': {
      const ranges = prices.slice(1).map((p, i) => Math.abs(p - prices[i]));
      const atr = ranges.reduce((sum, r) => sum + r, 0) / ranges.length;
      return atr * 0.5;
    }
    case 'volatility': {
      const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
      const variance = returns.reduce((sum, r) => sum + r * r, 0) / returns.length;
      const volatility = Math.sqrt(variance);
      return avg * volatility * 0.5;
    }
    default:
      return avg * 0.01;
  }
}

/**
 * Detect P&F patterns
 */
export function detectPnFPatterns(
  data: ChartData,
): Array<{
  pattern: 'double_top' | 'double_bottom' | 'triple_top' | 'triple_bottom' | 'catapult' | 'reversal';
  index: number;
  description: string;
}> {
  const patterns: Array<{ pattern: 'double_top' | 'double_bottom' | 'triple_top' | 'triple_bottom' | 'catapult' | 'reversal'; index: number; description: string }> = [];
  const series = data.series[0];
  if (!series) return patterns;

  const columns = series.data.map((d) => d.pnF as PnFColumn);

  for (let i = 2; i < columns.length; i++) {
    const current = columns[i];
    const prev = columns[i - 1];
    const prev2 = columns[i - 2];

    // Double Top/Bottom
    if (current.isX && prev.isX && current.y === prev.y) {
      patterns.push({
        pattern: 'double_top',
        index: i,
        description: `Double top at ${current.y}`,
      });
    }
    if (!current.isX && !prev.isX && current.y === prev.y) {
      patterns.push({
        pattern: 'double_bottom',
        index: i,
        description: `Double bottom at ${current.y}`,
      });
    }

    // Triple Top/Bottom
    if (i >= 3 && current.isX && prev2.isX && current.y === prev2.y && !prev.isX) {
      patterns.push({
        pattern: 'triple_top',
        index: i,
        description: `Triple top at ${current.y}`,
      });
    }
    if (i >= 3 && !current.isX && !prev2.isX && current.y === prev2.y && prev.isX) {
      patterns.push({
        pattern: 'triple_bottom',
        index: i,
        description: `Triple bottom at ${current.y}`,
      });
    }

    // Catapult (breakout after consolidation)
    if (current.isX && !prev.isX && current.count >= 5) {
      patterns.push({
        pattern: 'catapult',
        index: i,
        description: `Bullish catapult at ${current.y}`,
      });
    }

    // Reversal
    if (current.isX !== prev.isX) {
      patterns.push({
        pattern: 'reversal',
        index: i,
        description: `${prev.isX ? 'X' : 'O'} to ${current.isX ? 'X' : 'O'} reversal`,
      });
    }
  }

  return patterns;
}

/**
 * Calculate price targets from P&F pattern
 */
export function calculatePriceTargets(
  columns: PnFColumn[],
  boxSize: number,
): {
  bullish: number;
  bearish: number;
} {
  if (columns.length < 2) return { bullish: 0, bearish: 0 };

  const lastCol = columns[columns.length - 1];
  const prevCol = columns[columns.length - 2];

  // Count columns in pattern
  const patternHeight = Math.abs(lastCol.y - prevCol.y);

  return {
    bullish: lastCol.y + patternHeight + boxSize,
    bearish: lastCol.y - patternHeight - boxSize,
  };
}
