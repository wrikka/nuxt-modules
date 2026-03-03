# API Reference

## Chart Types

- `ChartData` - Main chart data interface
- `ChartSeries` - Series data interface
- `DataPoint` - Individual data point
- `PieChartData` - Pie chart specific data
- `HeatmapData` - Heatmap specific data

## Composables

### useChartData

Generate and manage chart data reactively.

```ts
const { chartData, updateData, randomizeData } = useChartData()
```

### useChartConfig

Manage chart configuration options.

```ts
const { config, updateConfig } = useChartConfig({ theme: 'dark' })
```

### useChartTheme

Handle chart theming.

```ts
const { theme, toggleTheme, setTheme } = useChartTheme('light')
```

### useChartExport

Export chart data to various formats.

```ts
const { exportToJSON, exportToCSV, downloadJSON, downloadCSV } = useChartExport()
```

### useChartImport

Import chart data from files.

```ts
const { importFromJSON, importFromCSV, importFromFile } = useChartImport()
```

### useChartResponsive

Handle responsive behavior.

```ts
const { isMobile, isTablet, isDesktop } = useChartResponsive()
```

## Components

### Chart Components

- `<AreaChart />` - Area chart component
- `<BarChart />` - Bar chart component
- `<LineChart />` - Line chart component
- `<PieChart />` - Pie chart component
- `<HeatmapChart />` - Heatmap chart component
- `<HistogramChart />` - Histogram chart component

### Utility Components

- `<ChartContainer />` - Wrapper with loading/error states
- `<ChartLegend />` - Chart legend component
- `<ChartTooltip />` - Custom tooltip component
- `<ExportPanel />` - Data export panel
- `<ImportPanel />` - Data import panel
- `<ThemeToggle />` - Theme switcher
- `<ResponsiveChartWrapper />` - Responsive chart wrapper

## Chart Functions

### Area Chart

- `generateAreaChartData()` - Generate area chart data

### Bar Chart

- `generateBarChartData()` - Generate bar chart data
- `sortBarChartData()` - Sort bar chart data
- `calculateBarChartStats()` - Calculate bar chart statistics

### Line Chart

- `generateLineChartData()` - Generate line chart data

### Pie Chart

- `generatePieChartData()` - Generate pie chart data
- `calculatePiePercentages()` - Calculate pie chart percentages

### Heatmap

- `generateHeatmapData()` - Generate heatmap data

### Histogram

- `generateHistogramData()` - Generate histogram data

### Utilities

- `getSeriesColor()` - Get color for series
- `generateRandomData()` - Generate random chart data
