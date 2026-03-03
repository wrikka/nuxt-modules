# Usage

## Setup

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wpackages/chart'],
  // Optional: Add @nuxt/icon for icons in components
  // modules: ['@nuxt/icon']
})
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

## Using Chart Functions Directly

You can also use chart generation functions directly in your components:

```vue
<script setup lang="ts">
const barData = generateBarChartData(
  ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  [10, 20, 30, 40, 50]
)
</script>

<template>
  <div>
    <!-- Your chart rendering logic here -->
    <pre>{{ JSON.stringify(barData, null, 2) }}</pre>
  </div>
</template>
```
