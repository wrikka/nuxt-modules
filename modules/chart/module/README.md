# @wpackages/chart

Nuxt module for comprehensive chart utilities and data visualization helpers with Vue components, composables, and TypeScript support.

## Installation

```bash
npm install @wpackages/chart
```

## Usage

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wpackages/chart'],
  // Optional: Add @nuxt/icon for icons in components
  // modules: ['@nuxt/icon']
})
```

## Features

- 🚀 **Chart Data Generation**: Utilities for generating chart data for various chart types
- 🎨 **Vue Components**: Ready-to-use Vue components with UnoCSS styling
- 🔧 **Composables**: Reactive composables for chart management
- 📊 **Multiple Chart Types**: Support for bar, line, pie, area, scatter, bubble, radar, polar area, doughnut, heatmap, histogram, and more
- 🎯 **TypeScript Support**: Full TypeScript types and intellisense
- 🌙 **Theme Support**: Built-in light/dark theme support
- 📱 **Responsive**: Responsive chart components
- 🔍 **Data Import/Export**: JSON and CSV data import/export, PNG/SVG/PDF export
- 🎨 **UnoCSS Integration**: Utility-first styling with UnoCSS
- 🎭 **Icon Integration**: Icon support with @nuxt/icon
- ⚡ **Real-time Updates**: Real-time data updates with composables
- 🔄 **API Integration**: Fetch data from external APIs
- 🔍 **Accessibility**: ARIA labels and keyboard navigation
- 🔎 **Zoom & Pan**: Interactive zoom and pan functionality
- 📈 **Multi-axis Support**: Dual Y-axis support
- 📊 **Drill-down**: Click to drill down into data
- 🚀 **Performance**: Optimized for large datasets with virtual scrolling
- 📅 **Time Series**: Date/time axis support for line charts

## Quick Start

```vue
<template>
  <ChartContainer title="Sales Data" :loading="false">
    <BarChart :data="chartData.series[0].data" />
  </ChartContainer>
</template>

<script setup lang="ts">
const { chartData } = useChartData()
</script>
```

## API Reference

### Chart Types

- `ChartData` - Main chart data interface
- `ChartSeries` - Series data interface
- `DataPoint` - Individual data point
- `PieChartData` - Pie chart specific data
- `HeatmapData` - Heatmap specific data

### Composables

#### useChartData
Generate and manage chart data reactively.

```ts
const { chartData, updateData, randomizeData } = useChartData()
```

#### useChartConfig
Manage chart configuration options.

```ts
const { config, updateConfig } = useChartConfig({ theme: 'dark' })
```

#### useChartTheme
Handle chart theming.

```ts
const { theme, toggleTheme, setTheme } = useChartTheme('light')
```

#### useChartExport
Export chart data to various formats.

```ts
const { exportToJSON, exportToCSV, downloadJSON, downloadCSV } = useChartExport()
```

#### useChartImport
Import chart data from files.

```ts
const { importFromJSON, importFromCSV, importFromFile } = useChartImport()
```

#### useChartResponsive
Handle responsive behavior.

```ts
const { isMobile, isTablet, isDesktop } = useChartResponsive()
```

### Components

#### Chart Components
- `<AreaChart />` - Area chart component
- `<BarChart />` - Bar chart component
- `<LineChart />` - Line chart component
- `<PieChart />` - Pie chart component
- `<HeatmapChart />` - Heatmap chart component
- `<HistogramChart />` - Histogram chart component

#### Utility Components
- `<ChartContainer />` - Wrapper with loading/error states
- `<ChartLegend />` - Chart legend component
- `<ChartTooltip />` - Custom tooltip component
- `<ExportPanel />` - Data export panel
- `<ImportPanel />` - Data import panel
- `<ThemeToggle />` - Theme switcher
- `<ResponsiveChartWrapper />` - Responsive chart wrapper

### Chart Functions

#### Area Chart
- `generateAreaChartData()` - Generate area chart data

#### Bar Chart
- `generateBarChartData()` - Generate bar chart data
- `sortBarChartData()` - Sort bar chart data
- `calculateBarChartStats()` - Calculate bar chart statistics

#### Line Chart
- `generateLineChartData()` - Generate line chart data

#### Pie Chart
- `generatePieChartData()` - Generate pie chart data
- `calculatePiePercentages()` - Calculate pie chart percentages

#### Heatmap
- `generateHeatmapData()` - Generate heatmap data

#### Histogram
- `generateHistogramData()` - Generate histogram data

#### Utilities
- `getSeriesColor()` - Get color for series
- `generateRandomData()` - Generate random chart data

## Examples

### Basic Chart
```vue
<template>
  <div>
    <ChartContainer title="Monthly Sales">
      <BarChart :data="chartData.series[0].data" />
    </ChartContainer>

    <ChartLegend :series="chartData.series" />
  </div>
</template>

<script setup lang="ts">
const { chartData } = useChartData()
</script>
```

### Themed Chart with Export
```vue
<template>
  <div>
    <ThemeToggle />
    <ChartContainer>
      <AreaChart :data="chartData.series[0].data" />
    </ChartContainer>
    <ExportPanel :chartData="chartData" />
  </div>
</template>

<script setup lang="ts">
const { chartData } = useChartData()
</script>
```

### Responsive Chart
```vue
<template>
  <ResponsiveChartWrapper :chartData="chartData">
    <BarChart :data="chartData.series[0].data" />
  </ResponsiveChartWrapper>
</template>

<script setup lang="ts">
const { chartData } = useChartData()
</script>
```

## Configuration

### UnoCSS
The module uses UnoCSS for styling. Make sure UnoCSS is configured in your project.

### Icons
For icon support in components, install and configure @nuxt/icon:

```bash
npm install @nuxt/icon
```

Add to nuxt.config.ts:
```ts
export default defineNuxtConfig({
  modules: ['@nuxt/icon']
})
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
