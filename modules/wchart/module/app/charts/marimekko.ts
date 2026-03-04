import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate Marimekko chart data (Mekko chart with variable width bars)
 */
export function generateMarimekkoData(
  categories: string[],
  segments: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    totalWidth?: number;
    gap?: number;
  } = {},
): ChartData {
  const { title, totalWidth = 100, gap = 0.5 } = options;

  // Calculate column widths based on total values
  const columnTotals = categories.map((_, i) =>
    segments.reduce((sum, seg) => sum + (seg.values[i] || 0), 0),
  );
  const grandTotal = columnTotals.reduce((sum, t) => sum + t, 0);

  let currentX = 0;
  const columns = categories.map((cat, i) => {
    const total = columnTotals[i] || 0;
    const width = grandTotal > 0 ? (total / grandTotal) * totalWidth : 0;
    const x = currentX;
    currentX += width + gap;

    return {
      category: cat,
      x,
      width,
      total,
      segments: segments.map((seg, segIndex) => ({
        name: seg.name,
        value: seg.values[i] || 0,
        height: total > 0 ? (seg.values[i] || 0) / total : 0,
        color: seg.color || getSeriesColor(segIndex),
      })),
    };
  });

  // Flatten into series
  const series: ChartSeries[] = segments.map((seg, segIndex) => {
    const data: DataPoint[] = columns.map((col) => {
      const segment = col.segments[segIndex];
      return {
        x: col.category,
        y: segment.value,
        label: `${col.category}: ${seg.name}`,
        width: col.width,
        xPos: col.x,
        color: segment.color,
      };
    });

    return {
      name: seg.name,
      data,
      type: 'marimekko',
      color: seg.color || getSeriesColor(segIndex),
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Generate Mekko chart (horizontal Marimekko)
 */
export function generateMekkoData(
  categories: string[],
  segments: Array<{
    name: string;
    values: number[];
    color?: string;
  }>,
  options: {
    title?: string;
    totalHeight?: number;
    gap?: number;
  } = {},
): ChartData {
  const { title, totalHeight = 100, gap = 0.5 } = options;

  // Calculate row heights based on total values
  const rowTotals = categories.map((_, i) =>
    segments.reduce((sum, seg) => sum + (seg.values[i] || 0), 0),
  );
  const grandTotal = rowTotals.reduce((sum, t) => sum + t, 0);

  let currentY = 0;
  const rows = categories.map((cat, i) => {
    const total = rowTotals[i] || 0;
    const height = grandTotal > 0 ? (total / grandTotal) * totalHeight : 0;
    const y = currentY;
    currentY += height + gap;

    return {
      category: cat,
      y,
      height,
      total,
      segments: segments.map((seg, segIndex) => ({
        name: seg.name,
        value: seg.values[i] || 0,
        width: total > 0 ? (seg.values[i] || 0) / total : 0,
        color: seg.color || getSeriesColor(segIndex),
      })),
    };
  });

  // Flatten into series
  const series: ChartSeries[] = segments.map((seg, segIndex) => {
    const data: DataPoint[] = rows.map((row) => {
      const segment = row.segments[segIndex];
      return {
        x: row.category,
        y: segment.value,
        label: `${row.category}: ${seg.name}`,
        height: row.height,
        yPos: row.y,
        color: segment.color,
      };
    });

    return {
      name: seg.name,
      data,
      type: 'mekko',
      color: seg.color || getSeriesColor(segIndex),
    };
  });

  return {
    title,
    series,
  };
}

/**
 * Calculate Marimekko segment percentages
 */
export function calculateMarimekkoPercentages(
  data: ChartData,
): Array<{
  segment: string;
  category: string;
  absoluteValue: number;
  columnPercentage: number;
  totalPercentage: number;
}> {
  const grandTotal = data.series.reduce(
    (sum, series) => sum + series.data.reduce((s, d) => s + ((d.y as number) || 0), 0),
    0,
  );

  const results: Array<{
    segment: string;
    category: string;
    absoluteValue: number;
    columnPercentage: number;
    totalPercentage: number;
  }> = [];

  // Group by category
  const categories = [...new Set(data.series.flatMap((s) => s.data.map((d) => d.x as string)))],
  categories.forEach((cat) => {
    const columnTotal = data.series.reduce((sum, series) => {
      const value = series.data.find((d) => d.x === cat)?.y as number;
      return sum + (value || 0);
    }, 0);

    data.series.forEach((series) => {
      const dataPoint = series.data.find((d) => d.x === cat);
      if (dataPoint) {
        const value = (dataPoint.y as number) || 0;
        results.push({
          segment: series.name,
          category: cat,
          absoluteValue: value,
          columnPercentage: columnTotal > 0 ? (value / columnTotal) * 100 : 0,
          totalPercentage: grandTotal > 0 ? (value / grandTotal) * 100 : 0,
        });
      }
    });
  });

  return results;
}

/**
 * Sort Marimekko columns by total value
 */
export function sortMarimekkoColumns(
  data: ChartData,
  ascending = false,
): ChartData {
  // Calculate totals per category
  const categoryTotals = new Map<string, number>();
  data.series.forEach((series) => {
    series.data.forEach((d) => {
      const cat = d.x as string;
      const current = categoryTotals.get(cat) || 0;
      categoryTotals.set(cat, current + ((d.y as number) || 0));
    });
  });

  // Sort categories
  const sortedCategories = [...categoryTotals.entries()].sort((a, b) =>
    ascending ? a[1] - b[1] : b[1] - a[1],
  );

  const categoryOrder = new Map(sortedCategories.map((entry, i) => [entry[0], i]));

  // Reorder data in each series
  const sortedSeries = data.series.map((series) => {
    const sortedData = [...series.data].sort((a, b) => {
      const orderA = categoryOrder.get(a.x as string) ?? 0;
      const orderB = categoryOrder.get(b.x as string) ?? 0;
      return orderA - orderB;
    });
    return { ...series, data: sortedData };
  });

  return { ...data, series: sortedSeries };
}
