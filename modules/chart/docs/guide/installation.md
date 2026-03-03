# Installation

## Prerequisites

- Nuxt 3.x
- Node.js 18+
- TypeScript (recommended)

## Install the Package

```bash
# npm
npm install @wpackages/chart

# yarn
yarn add @wpackages/chart

# pnpm
pnpm add @wpackages/chart

# bun
bun add @wpackages/chart
```

## Add to Nuxt Config

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wpackages/chart']
})
```

## Verify Installation

After installation, chart functions will be auto-imported in your Nuxt application. You can test this by creating a simple component:

```vue
<script setup lang="ts">
// This function will be auto-imported
const data = generateBarChartData(
  ['A', 'B', 'C'],
  [1, 2, 3]
)
</script>

<template>
  <div>
    <h1>Chart Module Test</h1>
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
```

If the page loads without errors, the module is properly installed and configured.
