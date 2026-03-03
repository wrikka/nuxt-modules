# Composables

The @wpackages/chart module provides several composables for reactive chart management and data handling.

## useChartData

Generate and manage chart data reactively.

### Basic Usage

```ts
const { chartData } = useChartData()
```

### Update Data

```ts
const { chartData, updateData } = useChartData()

// Update with new data
updateData({
  series: [{
    name: 'Sales',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 150 },
      // ...
    ]
  }]
})
```

### Randomize Data

```ts
const { chartData, randomizeData } = useChartData()

// Generate random data
randomizeData()
```

## useChartConfig

Manage chart configuration options.

```ts
const { config, updateConfig } = useChartConfig({
  theme: 'dark',
  responsive: true,
  animation: true
})

// Update configuration
updateConfig({ theme: 'light' })
```

## useChartTheme

Handle chart theming.

```ts
const { theme, toggleTheme, setTheme } = useChartTheme('light')

// Toggle between light and dark
toggleTheme()

// Set specific theme
setTheme('dark')
```

### Usage in Template

```vue
<template>
  <div>
    <p>Current theme: {{ theme }}</p>
    <button @click="toggleTheme">Toggle Theme</button>
  </div>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useChartTheme('light')
</script>
```

## useChartExport

Export chart data to various formats.

```ts
const { exportToJSON, exportToCSV, downloadJSON, downloadCSV } = useChartExport()

// Export to JSON string
const jsonString = exportToJSON(chartData)

// Export to CSV string
const csvString = exportToCSV(chartData)

// Download as JSON file
downloadJSON(chartData, 'chart-data.json')

// Download as CSV file
downloadCSV(chartData, 'chart-data.csv')
```

## useChartImport

Import chart data from files.

```ts
const { importFromJSON, importFromCSV, importFromFile } = useChartImport()

// Import from JSON string
const dataFromJSON = importFromJSON(jsonString)

// Import from CSV string
const dataFromCSV = importFromCSV(csvString)

// Import from file input
const handleFileImport = async (file: File) => {
  const data = await importFromFile(file)
  // Use imported data
}
```

## useChartResponsive

Handle responsive behavior.

```ts
const { isMobile, isTablet, isDesktop } = useChartResponsive()

// Use in template
// <div v-if="isMobile">Mobile layout</div>
// <div v-else-if="isTablet">Tablet layout</div>
// <div v-else>Desktop layout</div>
```

### Complete Example

```vue
<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">Chart Dashboard</h2>

    <!-- Theme controls -->
    <div class="mb-4">
      <button @click="toggleTheme" class="px-4 py-2 bg-gray-200 rounded">
        Toggle {{ theme === 'light' ? 'Dark' : 'Light' }} Theme
      </button>
    </div>

    <!-- Chart container -->
    <ChartContainer
      :title="`Sales Data (${isMobile ? 'Mobile' : isDesktop ? 'Desktop' : 'Tablet'})`"
      class="mb-4"
    >
      <BarChart :data="chartData.series[0].data" />
    </ChartContainer>

    <!-- Controls -->
    <div class="flex gap-2 mb-4">
      <button @click="randomizeData" class="px-4 py-2 bg-blue-500 text-white rounded">
        Randomize Data
      </button>
      <button @click="downloadJSON(chartData, 'sales-data.json')" class="px-4 py-2 bg-green-500 text-white rounded">
        Export JSON
      </button>
      <button @click="downloadCSV(chartData, 'sales-data.csv')" class="px-4 py-2 bg-green-500 text-white rounded">
        Export CSV
      </button>
    </div>

    <!-- Legend -->
    <ChartLegend :series="chartData.series" />
  </div>
</template>

<script setup lang="ts">
const { chartData, randomizeData } = useChartData()
const { theme, toggleTheme } = useChartTheme('light')
const { downloadJSON, downloadCSV } = useChartExport()
const { isMobile, isDesktop } = useChartResponsive()
</script>
```
