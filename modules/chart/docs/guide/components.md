# Components

The @wpackages/chart module provides Vue components for creating interactive charts and data visualizations.

## Chart Components

### AreaChart

Area chart component for displaying continuous data.

```vue
<template>
  <AreaChart :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
const chartData = [
  { x: 'Jan', y: 100 },
  { x: 'Feb', y: 150 },
  { x: 'Mar', y: 120 }
]
const chartOptions = {
  fill: true,
  stroke: '#3b82f6'
}
</script>
```

### BarChart

Bar chart component for comparing categories.

```vue
<template>
  <BarChart :data="chartData" :horizontal="false" />
</template>

<script setup lang="ts">
const chartData = [
  { x: 'A', y: 10 },
  { x: 'B', y: 20 },
  { x: 'C', y: 15 }
]
</script>
```

### LineChart

Line chart component for showing trends over time.

```vue
<template>
  <LineChart :data="chartData" :smooth="true" />
</template>

<script setup lang="ts">
const chartData = [
  { x: '2023-01', y: 100 },
  { x: '2023-02', y: 150 },
  { x: '2023-03', y: 120 }
]
</script>
```

### PieChart

Pie chart component for showing proportions.

```vue
<template>
  <PieChart :data="pieData" :showLabels="true" />
</template>

<script setup lang="ts">
const pieData = [
  { label: 'Category A', value: 30, color: '#ef4444' },
  { label: 'Category B', value: 50, color: '#3b82f6' },
  { label: 'Category C', value: 20, color: '#10b981' }
]
</script>
```

### HeatmapChart

Heatmap chart for displaying matrix data.

```vue
<template>
  <HeatmapChart :data="heatmapData" :colorScale="colorScale" />
</template>

<script setup lang="ts">
const heatmapData = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
const colorScale = ['#f3f4f6', '#3b82f6', '#1e40af']
</script>
```

### HistogramChart

Histogram chart for frequency distribution.

```vue
<template>
  <HistogramChart :data="histogramData" :bins="10" />
</template>

<script setup lang="ts">
const histogramData = [1, 2, 2, 3, 3, 3, 4, 4, 5]
</script>
```

## Utility Components

### ChartContainer

Wrapper component with loading/error states and title.

```vue
<template>
  <ChartContainer
    title="Sales Overview"
    :loading="isLoading"
    :error="errorMessage"
    class="w-full h-64"
  >
    <BarChart :data="chartData" />
  </ChartContainer>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const errorMessage = ref('')
const chartData = [
  { x: 'Q1', y: 1000 },
  { x: 'Q2', y: 1200 },
  { x: 'Q3', y: 900 },
  { x: 'Q4', y: 1500 }
]
</script>
```

### ChartLegend

Display chart legend with series information.

```vue
<template>
  <div>
    <ChartLegend :series="chartSeries" :position="'bottom'" />
    <BarChart :data="chartData" />
  </div>
</template>

<script setup lang="ts">
const chartSeries = [
  { name: 'Sales', color: '#3b82f6' },
  { name: 'Revenue', color: '#ef4444' }
]
</script>
```

### ChartTooltip

Custom tooltip component for chart interactions.

```vue
<template>
  <ChartTooltip
    :visible="tooltip.visible"
    :position="tooltip.position"
    :data="tooltip.data"
  >
    <div class="p-2">
      <h4 class="font-bold">{{ tooltip.data.title }}</h4>
      <p>Value: {{ tooltip.data.value }}</p>
    </div>
  </ChartTooltip>
</template>

<script setup lang="ts">
const tooltip = reactive({
  visible: false,
  position: { x: 0, y: 0 },
  data: { title: '', value: 0 }
})
</script>
```

### ExportPanel

Panel for exporting chart data.

```vue
<template>
  <ExportPanel
    :chartData="chartData"
    :formats="['json', 'csv', 'png']"
    :showDownload="true"
  />
</template>

<script setup lang="ts">
const chartData = {
  series: [{
    name: 'Data',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 }
    ]
  }]
}
</script>
```

### ImportPanel

Panel for importing chart data.

```vue
<template>
  <ImportPanel
    :acceptedFormats="['json', 'csv']"
    @dataImported="handleDataImport"
  />
</template>

<script setup lang="ts">
const handleDataImport = (data) => {
  console.log('Imported data:', data)
  // Process imported data
}
</script>
```

### ThemeToggle

Theme switcher component.

```vue
<template>
  <div class="flex items-center gap-4">
    <span>Theme:</span>
    <ThemeToggle />
  </div>
</template>
```

### ResponsiveChartWrapper

Responsive wrapper for charts.

```vue
<template>
  <ResponsiveChartWrapper
    :chartData="chartData"
    :breakpoints="{ mobile: 768, tablet: 1024 }"
  >
    <BarChart :data="chartData.series[0].data" />
  </ResponsiveChartWrapper>
</template>

<script setup lang="ts">
const chartData = {
  series: [{
    name: 'Sales',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 }
    ]
  }]
}
</script>
```

## Component Props

Most chart components accept the following common props:

- `data`: Chart data array
- `options`: Configuration object
- `width`: Chart width
- `height`: Chart height
- `responsive`: Enable responsive behavior
- `theme`: Theme override

Check the API reference for component-specific props.
