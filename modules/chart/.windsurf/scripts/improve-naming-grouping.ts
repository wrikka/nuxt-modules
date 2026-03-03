import { mkdir, rename } from 'fs/promises';
import { join, dirname } from 'path';

const baseDir = join(process.cwd(), 'module/src/runtime');

const moves = [
  // Basic charts from utils to charts subdirs
  { from: 'utils/area-chart.ts', to: 'charts/area/index.ts' },
  { from: 'utils/bar-chart.ts', to: 'charts/bar/index.ts' },
  { from: 'utils/line-chart.ts', to: 'charts/line/index.ts' },
  { from: 'utils/pie-chart.ts', to: 'charts/pie/index.ts' },
  { from: 'utils/polar-area-chart.ts', to: 'charts/polar-area/index.ts' },
  { from: 'utils/scatter-chart.ts', to: 'charts/scatter/index.ts' },
  { from: 'utils/treemap.ts', to: 'charts/treemap/index.ts' },

  // Area chart files
  { from: 'charts/area-chart-analysis.ts', to: 'charts/area/analysis.ts' },
  { from: 'charts/area-chart-generation.ts', to: 'charts/area/generation.ts' },

  // Bar chart files
  { from: 'utils/bar-chart-generation.ts', to: 'charts/bar/generation.ts' },
  { from: 'utils/bar-chart-manipulation.ts', to: 'charts/bar/manipulation.ts' },

  // Line chart files
  { from: 'utils/line-chart-analysis.ts', to: 'charts/line/analysis.ts' },
  { from: 'utils/line-chart-generation.ts', to: 'charts/line/generation.ts' },

  // Pie chart files
  { from: 'utils/pie-chart-generation.ts', to: 'charts/pie/generation.ts' },

  // Scatter chart files
  { from: 'utils/scatter-chart-analysis.ts', to: 'charts/scatter/analysis.ts' },
  { from: 'utils/scatter-chart-data.ts', to: 'charts/scatter/data.ts' },

  // Treemap chart files
  { from: 'utils/treemap-data.ts', to: 'charts/treemap/data.ts' },
  { from: 'utils/treemap-layout.ts', to: 'charts/treemap/layout.ts' },
  { from: 'utils/treemap-utils.ts', to: 'charts/treemap/utils.ts' },

  // Boxplot
  { from: 'charts/boxplot-calculations.ts', to: 'charts/boxplot/calculations.ts' },
  { from: 'charts/boxplot-chart.ts', to: 'charts/boxplot/index.ts' },
  { from: 'charts/boxplot-data.ts', to: 'charts/boxplot/data.ts' },
  { from: 'charts/boxplot-utils.ts', to: 'charts/boxplot/utils.ts' },

  // Bubble
  { from: 'charts/bubble-chart.ts', to: 'charts/bubble/index.ts' },

  // Calendar Heatmap
  { from: 'charts/calendar-heatmap.ts', to: 'charts/calendar-heatmap/index.ts' },

  // Candlestick
  { from: 'charts/candlestick-analysis.ts', to: 'charts/candlestick/analysis.ts' },
  { from: 'charts/candlestick-chart.ts', to: 'charts/candlestick/index.ts' },
  { from: 'charts/candlestick-data.ts', to: 'charts/candlestick/data.ts' },
  { from: 'charts/candlestick-patterns.ts', to: 'charts/candlestick/patterns.ts' },
  { from: 'charts/candlestick-utils.ts', to: 'charts/candlestick/utils.ts' },

  // Funnel
  { from: 'charts/funnel-analysis.ts', to: 'charts/funnel/analysis.ts' },
  { from: 'charts/funnel-chart.ts', to: 'charts/funnel/index.ts' },
  { from: 'charts/funnel-data.ts', to: 'charts/funnel/data.ts' },
  { from: 'charts/funnel-utils.ts', to: 'charts/funnel/utils.ts' },

  // Gauge
  { from: 'charts/gauge-calculations.ts', to: 'charts/gauge/calculations.ts' },
  { from: 'charts/gauge-chart.ts', to: 'charts/gauge/index.ts' },
  { from: 'charts/gauge-data.ts', to: 'charts/gauge/data.ts' },
  { from: 'charts/gauge-utils.ts', to: 'charts/gauge/utils.ts' },

  // Heatmap
  { from: 'charts/heatmap-analysis.ts', to: 'charts/heatmap/analysis.ts' },
  { from: 'charts/heatmap-data.ts', to: 'charts/heatmap/data.ts' },
  { from: 'charts/heatmap-utils.ts', to: 'charts/heatmap/utils.ts' },
  { from: 'charts/heatmap.ts', to: 'charts/heatmap/index.ts' },

  // Histogram
  { from: 'charts/histogram-calculations.ts', to: 'charts/histogram/calculations.ts' },
  { from: 'charts/histogram-data.ts', to: 'charts/histogram/data.ts' },
  { from: 'charts/histogram-utils.ts', to: 'charts/histogram/utils.ts' },
  { from: 'charts/histogram.ts', to: 'charts/histogram/index.ts' },

  // Radar
  { from: 'charts/radar-analysis.ts', to: 'charts/radar/analysis.ts' },
  { from: 'charts/radar-chart.ts', to: 'charts/radar/index.ts' },
  { from: 'charts/radar-data.ts', to: 'charts/radar/data.ts' },

  // Sparkline
  { from: 'charts/sparkline.ts', to: 'charts/sparkline/index.ts' },

  // Sunburst
  { from: 'charts/sunburst-chart.ts', to: 'charts/sunburst/index.ts' },

  // Waterfall
  { from: 'charts/waterfall-calculations.ts', to: 'charts/waterfall/calculations.ts' },
  { from: 'charts/waterfall-chart.ts', to: 'charts/waterfall/index.ts' },
  { from: 'charts/waterfall-data.ts', to: 'charts/waterfall/data.ts' },
  { from: 'charts/waterfall-utils.ts', to: 'charts/waterfall/utils.ts' },

  // Word Cloud
  { from: 'charts/word-cloud.ts', to: 'charts/word-cloud/index.ts' },

  // Sankey
  { from: 'charts/sankey.ts', to: 'charts/sankey/index.ts' },

  // Dumbbell
  { from: 'charts/dumbbell.ts', to: 'charts/dumbbell/index.ts' },

  // Bullet
  { from: 'charts/bullet.ts', to: 'charts/bullet/index.ts' },

  // Timeline
  { from: 'charts/timeline.ts', to: 'charts/timeline/index.ts' },

  // Gantt
  { from: 'charts/gantt.ts', to: 'charts/gantt/index.ts' },

  // Pyramid
  { from: 'charts/pyramid.ts', to: 'charts/pyramid/index.ts' },

  // Lollipop
  { from: 'charts/lollipop.ts', to: 'charts/lollipop/index.ts' },

  // Scatter (additional)
  { from: 'charts/scatter-analysis.ts', to: 'charts/scatter/analysis.ts' },
  { from: 'charts/scatter-chart.ts', to: 'charts/scatter/index.ts' },
  { from: 'charts/scatter-clustering.ts', to: 'charts/scatter/clustering.ts' },
  { from: 'charts/scatter-generation.ts', to: 'charts/scatter/generation.ts' },
  { from: 'charts/scatter-geometry.ts', to: 'charts/scatter/geometry.ts' },
  { from: 'charts/scatter-matrix.ts', to: 'charts/scatter/matrix.ts' },
  { from: 'charts/scatter-stats.ts', to: 'charts/scatter/stats.ts' },
];

async function moveFile(from: string, to: string) {
  const fromPath = join(baseDir, from);
  const toPath = join(baseDir, to);
  const toDir = dirname(toPath);

  await mkdir(toDir, { recursive: true });
  await rename(fromPath, toPath);
  console.log(`Moved ${from} to ${to}`);
}

async function main() {
  for (const move of moves) {
    try {
      await moveFile(move.from, move.to);
    } catch (error) {
      console.error(`Error moving ${move.from} to ${move.to}:`, error);
    }
  }
}

main();
