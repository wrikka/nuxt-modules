# @wpackages/diff

## Introduction

A comprehensive Nuxt module providing diff utilities for comparing, patching, and validating data changes with TypeScript support.

## Installation

```bash
bun add @wpackages/diff
```

## Features

- 🔄 Efficient diff calculation algorithms
- 🩹 Data patching and unpatching operations
- ✅ Comprehensive validation with type safety
- 🌊 Streaming diff for large datasets
- 🧩 Functional programming approach
- 📊 Statistics and performance monitoring
- 🔧 Highly customizable options
- 🎯 TypeScript first-class support

## Goal

- ⚡ Provide fast and reliable diff operations
- 🛡️ Ensure type safety in all operations
- 📈 Support large-scale data processing
- 🔧 Offer flexible configuration options
- 🎯 Simplify complex diff scenarios

## Architecture

### Key Concepts

- **DiffResult**: Structured representation of differences between data
- **Patch**: Apply changes to data immutably
- **Validate**: Ensure data integrity before operations
- **Stream**: Handle large datasets efficiently

## Design Principles

- **Functional**: Pure functions with no side effects
- **Type-safe**: Full TypeScript support
- **Immutable**: Operations don't mutate original data
- **Composable**: Functions work together seamlessly
- **Performant**: Optimized for speed and memory usage

## Usage

| Command | Description |
|---------|-------------|
| `bun add @wpackages/diff` | Install the package |
| `bun run dev` | Start development mode |
| `bun run build` | Build the package |
| `bun run test` | Run all tests |

## Usage Examples

### Basic Diff Calculation

```ts
import { diff } from '@wpackages/diff'

const oldData = { name: 'John', age: 30 }
const newData = { name: 'Jane', age: 30 }

const result = diff(oldData, newData)
// result.added: { name: 'Jane' }
// result.deleted: { name: 'John' }
// result.updated: {}
```

### Data Patching

```ts
import { patch } from '@wpackages/diff'

const original = { items: [1, 2, 3] }
const diffResult = {
  added: { items: { '3': 4 } },
  deleted: {},
  updated: {}
}

const patched = patch(original, diffResult)
// patched: { items: [1, 2, 3, 4] }
```

### Validation

```ts
import { validateDiff } from '@wpackages/diff'

const options = { maxDepth: 5, validateTypes: true }
const result = validateDiff(options, dataA, dataB)

if (result.isValid) {
  // Proceed with diff operations
} else {
  console.log('Validation errors:', result.errors)
}
```

### Streaming Diff

```ts
import { streamingDiff } from '@wpackages/diff'

async function* dataStream() {
  yield { id: 1, value: 'a' }
  yield { id: 2, value: 'b' }
}

const generator = await streamingDiff(dataStream(), anotherStream)
for await (const chunk of generator) {
  console.log('Diff chunk:', chunk)
}
```

### Nuxt Integration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wpackages/diff']
})

// In component
<script setup lang="ts">
const { diff, patch, validateDiff } = await import('@wpackages/diff')

// Use the utilities
</script>
```

### Vue Components

#### DiffSummary

Displays a summary of changes with counts and percentages.

```vue
<template>
  <DiffSummary :diff="diffResult" title="Changes Summary" />
</template>

<script setup lang="ts">
import { DiffSummary, diff } from '@wpackages/diff'

const oldData = { name: 'John', age: 30 }
const newData = { name: 'Jane', age: 31 }
const diffResult = diff(oldData, newData)
</script>
```


#### FileDiff

Structured view of differences grouped by type.

```vue
<template>
  <FileDiff :diff="diffResult" title="File Changes" />
</template>

<script setup lang="ts">
import { FileDiff, diff } from '@wpackages/diff'
</script>
```

### Vue Composables

#### useDiff

```ts
import { useDiff } from '@wpackages/diff'

const oldData = { name: 'John', age: 30 }
const newData = { name: 'Jane', age: 31 }

const { diffResult } = useDiff(oldData, newData)
// diffResult is reactive
```

#### useDiffStatus

```ts
import { useDiffStatus } from '@wpackages/diff'

const { hasChanges, addedCount, deletedCount, updatedCount, totalChanges } = useDiffStatus(diffResult)
```

#### useUnifiedDiff

```ts
import { useUnifiedDiff } from '@wpackages/diff'

const { unifiedDiff } = useUnifiedDiff(diffResult, { title: 'Unified Diff' })

// unifiedDiff.value contains the formatted diff string
```

## API

### Core Functions

| Function | Parameters | Return | Description |
|----------|------------|--------|-------------|
| `diff` | `(oldData, newData, options?)` | `DiffResult` | Calculate differences between data |
| `patch` | `(data, diff)` | `T` | Apply diff to data immutably |
| `unpatch` | `(data, diff)` | `T` | Reverse diff application |
| `validateDiff` | `(options, dataA, dataB)` | `ValidationResult` | Validate data for diff operations |

### Composables

| Composable | Description |
|------------|-------------|
| `useDiff` | Reactive diff calculation for Vue |
| `useDiffStatus` | Get diff status and counts |
| `useUnifiedDiff` | Generate unified diff format |

## Development

| Command | Description |
|---------|-------------|
| `bun run build` | Build the package |
| `bun run dev` | Start development mode |
| `bun run test` | Run all tests |
| `bun run lint` | Check code quality |
| `bun run verify` | Run full verification |
| `bun run docs:dev` | Start documentation server |
| `bun run docs:build` | Build documentation |

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our coding standards and includes tests.

## License

[MIT License](https://choosealicense.com/licenses/mit/)

| Category | Item |
|----------|------|
| Permissions | Commercial use, Distribution, Modification, Private use |
| Limitations | Liability, Warranty |
