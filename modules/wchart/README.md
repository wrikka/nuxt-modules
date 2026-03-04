# @wpackages/chart

A comprehensive Nuxt module for chart utilities and data visualization components.

## Features

- 🎯 **Type-Safe**: Full TypeScript support with strict typing
- 🧩 **Composable**: Vue composables for chart data management
- 📊 **Utilities**: Powerful chart data processing utilities
- 🎨 **UnoCSS Integration**: Built-in styling with UnoCSS
- 🔧 **Nuxt Ready**: Seamless integration with Nuxt 4
- 📱 **Responsive**: Mobile-friendly chart components

## Installation

```bash
bun add @wpackages/chart
```

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wpackages/chart'],
  css: ['@wpackages/chart/dist/style.css']
})
```

## Quick Start

### Basic Usage

```vue
<template>
  <ChartContainer :data="chartData" :options="chartOptions">
    <LineChart :series="series" />
  </ChartContainer>
</template>

<script setup lang="ts">
import { useLineChart } from '@wpackages/chart'

const { chartData, series } = useLineChart({
  xValues: [1, 2, 3, 4, 5],
  yValues: [10, 20, 15, 25, 30]
})
</script>
```

### Using Composables

```typescript
import { useChartData, useChartFilter, useChartExport } from '@wpackages/chart'

const { data, updateData } = useChartData()
const { filteredData, addFilter } = useChartFilter(data)
const { exportToPNG } = useChartExport()
```

## Chart Types

### Line Charts
```typescript
import { generateLineChartData } from '@wpackages/chart'
```

### Bar Charts
```typescript
import { generateBarChartData } from '@wpackages/chart'
```

### Pie Charts
```typescript
import { generatePieChartData } from '@wpackages/chart'
```

### Scatter Plots
```typescript
import { generateScatterData } from '@wpackages/chart'
```

### Histograms
```typescript
import { generateHistogramData } from '@wpackages/chart'
```

### Box Plots
```typescript
import { generateBoxplotData } from '@wpackages/chart'
```

### Radar Charts
```typescript
import { generateRadarData } from '@wpackages/chart'
```

## Utilities

### Data Processing
```typescript
import {
  calculateMean,
  calculateMedian,
  normalizeData,
  filterData
} from '@wpackages/chart/utils'
```

### Color Schemes
```typescript
import {
  getSeriesColor,
  generateColorPalette,
  applyColorScheme
} from '@wpackages/chart/utils'
```

### Statistical Analysis
```typescript
import { useStatisticalAnalysis } from '@wpackages/chart'

const { statisticalSummary, calculateCorrelation } = useStatisticalAnalysis(data)
```

## Components

### ChartContainer
Main container component with responsive design.

```vue
<ChartContainer :data="data" :width="800" :height="400">
  <!-- Your chart components -->
</ChartContainer>
```

### Available Components
- `<LineChart>`
- `<BarChart>`
- `<PieChart>`
- `<ScatterChart>`
- `<RadarChart>`
- `<HeatmapChart>`
- `<BoxPlotChart>`

## Configuration

### Module Options

```typescript
export default defineNuxtConfig({
  modules: ['@wpackages/chart'],
  chart: {
    theme: 'light', // 'light' | 'dark'
    defaultColors: ['#FF6384', '#36A2EB', '#FFCE56'],
    responsive: true,
    animation: true
  }
})
```

### UnoCSS Integration

The module comes with UnoCSS integration for styling:

```vue
<div class="chart-container bg-white rounded-lg shadow-md p-4">
  <div class="chart-header text-xl font-bold mb-4">Sales Data</div>
  <!-- Chart content -->
</div>
```

## API Reference

### Composables

#### useChartData()
Manages chart data state and updates.

#### useChartFilter()
Provides filtering capabilities for chart data.

#### useChartExport()
Handles chart export functionality (PNG, SVG, PDF, JSON).

#### useChartZoom()
Manages chart zoom and pan interactions.

#### useChartAnnotations()
Adds annotations and markers to charts.

#### useStatisticalAnalysis()
Performs statistical analysis on chart data.

### Utilities

#### Data Generation
- `generateLineChartData()`
- `generateBarChartData()`
- `generatePieChartData()`
- `generateScatterData()`
- `generateHistogramData()`
- `generateBoxplotData()`
- `generateRadarData()`

#### Data Processing
- `calculateMean()`
- `calculateMedian()`
- `calculateStandardDeviation()`
- `normalizeData()`
- `filterData()`
- `sortData()`

#### Colors
- `getSeriesColor()`
- `generateColorPalette()`
- `applyColorScheme()`

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  ChartData,
  ChartSeries,
  DataPoint,
  ChartConfig,
  LineChartData,
  BarChartData
} from '@wpackages/chart'
```

## Development

### Building

```bash
bun run build
```

### Testing

```bash
bun run test
```

### Linting

```bash
bun run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://chart-docs.example.com)
- 🐛 [Issues](https://github.com/wpackages/chart/issues)
- 💬 [Discussions](https://github.com/wpackages/chart/discussions)