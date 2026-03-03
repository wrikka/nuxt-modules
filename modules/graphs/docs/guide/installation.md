# Installation

## Prerequisites

- Node.js 18+
- Bun (recommended) or npm/yarn
- Nuxt 3 project

## Install the Package

```bash
# Using bun (recommended)
bun add @wpackages/graphs

# Using npm
npm install @wpackages/graphs

# Using yarn
yarn add @wpackages/graphs
```

## Add to Nuxt Config

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@wpackages/graphs'
  ]
})
```

## Verify Installation

Create a simple test to verify the installation works:

```vue
<script setup>
import { dijkstra } from '@wpackages/graphs'

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 1 },
  C: { A: 2, B: 1 }
}

const result = dijkstra(graph, 'A', 'B')
console.log(result) // Should log the shortest path result
</script>

<template>
  <div>Graphs module is working!</div>
</template>
```

## Development Setup

If you want to contribute or modify the module:

```bash
# Clone the repository
git clone https://github.com/wrikka/bun-packages.git
cd bun-packages

# Install dependencies
bun install

# Go to graphs package
cd packages/graphs

# Run tests
bun run test

# Build the package
bun run build
```
