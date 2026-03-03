# @wpackages/chart

Nuxt module for comprehensive chart utilities and data visualization helpers with Vue components, composables, and TypeScript support.

## Features

- � **Chart Data Generation**: Utilities for generating chart data for various chart types
- 🎨 **Vue Components**: Ready-to-use Vue components with UnoCSS styling
- 🔧 **Composables**: Reactive composables for chart management
- � **Multiple Chart Types**: Support for bar, line, pie, area, scatter, bubble, radar, polar area, doughnut, heatmap, histogram, and more
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
- � **Drill-down**: Click to drill down into data
- 🚀 **Performance**: Optimized for large datasets with virtual scrolling
- 📅 **Time Series**: Date/time axis support for line charts

## Installation

```bash
npm install @wpackages/chart
```

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

## What's Included

### Chart Types

- `ChartData` - Main chart data interface
- `ChartSeries` - Series data interface
- `DataPoint` - Individual data point
- `PieChartData` - Pie chart specific data
- `HeatmapData` - Heatmap specific data

### Composables

- `useChartData` - Generate and manage chart data reactively
- `useChartConfig` - Manage chart configuration options
- `useChartTheme` - Handle chart theming
- `useChartExport` - Export chart data to various formats
- `useChartImport` - Import chart data from files
- `useChartResponsive` - Handle responsive behavior

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

## License

MIT
