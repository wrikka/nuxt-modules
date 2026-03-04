import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Pareto Chart - Bar chart with cumulative percentage line
 */

/**
 * Generate Pareto chart data
 */
export function generateParetoData(
  categories: string[],
  values: number[],
  options: {
    title?: string;
    threshold?: number; // 80% line threshold
    color?: string;
  } = {},
): ChartData {
  const { title, threshold = 80, color = '#4e79a7' } = options;

  // Sort by value descending
  const sorted = categories
    .map((cat, i) => ({ cat, val: values[i] ?? 0 }))
    .sort((a, b) => b.val - a.val);

  const total = sorted.reduce((sum, item) => sum + item.val, 0);

  // Calculate cumulative percentages
  let cumulative = 0;
  const paretoData = sorted.map((item) => {
    cumulative += item.val;
    return {
      category: item.cat,
      value: item.val,
      cumulative,
      percentage: total > 0 ? (item.val / total) * 100 : 0,
      cumulativePercentage: total > 0 ? (cumulative / total) * 100 : 0,
    };
  });

  // Bar series
  const barSeries: ChartSeries = {
    name: 'Value',
    data: paretoData.map((d, i) => ({
      x: i,
      y: d.value,
      label: d.category,
      color,
    })),
    type: 'bar',
    color,
  };

  // Cumulative line series
  const lineSeries: ChartSeries = {
    name: 'Cumulative %',
    data: paretoData.map((d, i) => ({
      x: i,
      y: d.cumulativePercentage,
      label: `${d.cumulativePercentage.toFixed(1)}%`,
      color: '#e15759',
    })),
    type: 'line',
    color: '#e15759',
    layout: {
      yAxis: 'right',
    },
  };

  // 80% threshold line
  const thresholdSeries: ChartSeries = {
    name: `${threshold}% Threshold`,
    data: paretoData.map((_, i) => ({
      x: i,
      y: threshold,
      color: '#59a14f',
    })),
    type: 'line',
    color: '#59a14f',
    layout: {
      dashed: true,
      yAxis: 'right',
    },
  };

  return {
    title: title || 'Pareto Analysis',
    series: [barSeries, lineSeries, thresholdSeries],
  };
}

/**
 * Identify vital few (80/20 rule)
 */
export function identifyVitalFew(
  data: ChartData,
  threshold: number = 80,
): {
  vitalFew: string[];
  trivialMany: string[];
  cutoffIndex: number;
} {
  const lineSeries = data.series.find((s) => s.name === 'Cumulative %');
  if (!lineSeries) {
    return { vitalFew: [], trivialMany: [], cutoffIndex: 0 };
  }

  const cutoffIndex = lineSeries.data.findIndex(
    (d) => (d.y as number) >= threshold,
  );

  if (cutoffIndex === -1) {
    return {
      vitalFew: lineSeries.data.map((d) => (d.label || '').replace(/%/g, '')),
      trivialMany: [],
      cutoffIndex: lineSeries.data.length,
    };
  }

  const vitalFew = lineSeries.data
    .slice(0, cutoffIndex + 1)
    .map((d) => (d.label || '').replace(/%/g, ''));

  const trivialMany = lineSeries.data
    .slice(cutoffIndex + 1)
    .map((d) => (d.label || '').replace(/%/g, ''));

  return { vitalFew, trivialMany, cutoffIndex };
}

/**
 * Calculate Pareto metrics
 */
export function calculateParetoMetrics(
  categories: string[],
  values: number[],
): {
  giniCoefficient: number;
  concentration: number;
  topN: Array<{ category: string; value: number; percentage: number }>;
} {
  const sorted = [...values].sort((a, b) => b - a);
  const total = sorted.reduce((sum, v) => sum + v, 0);

  // Gini coefficient
  const n = sorted.length;
  const cumulative = sorted.reduce((acc: number[], v, i) => {
    const prev = acc[i - 1] ?? 0;
    acc.push(prev + v);
    return acc;
  }, []);

  const gini = (2 * cumulative.reduce((sum, _, i) => {
    const val = sorted[i] ?? 0;
    return sum + (i + 1) * val;
  }, 0)) / (n * total) - (n + 1) / n;

  // Concentration (Herfindahl index)
  const shares = sorted.map((v) => v / total);
  const concentration = shares.reduce((sum, s) => sum + s * s, 0);

  // Top N
  const top5 = sorted.slice(0, 5);
  const topN = top5.map((v, i) => ({
    category: categories[values.indexOf(v)] || '',
    value: v,
    percentage: total > 0 ? (v / total) * 100 : 0,
  }));

  return {
    giniCoefficient: Math.abs(gini),
    concentration,
    topN,
  };
}
