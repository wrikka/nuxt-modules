# @wpackages/diff

Nuxt diff utilities module documentation.

## Features

- 🔄 Efficient diff calculation algorithms
- 🩹 Data patching and unpatching operations
- ✅ Comprehensive validation with type safety
- 🌊 Streaming diff for large datasets
- 🧩 Functional programming approach
- 📊 Statistics and performance monitoring
- 🔧 Highly customizable options
- 🎯 TypeScript first-class support

## Getting Started

Get started with @wpackages/diff by following our [installation guide](/guide/installation).

## Quick Example

```ts
import { diff } from '@wpackages/diff'

const oldData = { name: 'John', age: 30 }
const newData = { name: 'Jane', age: 30 }

const result = diff(oldData, newData)
// result.added: { name: 'Jane' }
// result.deleted: { name: 'John' }
// result.updated: {}
```

## API Reference

Check out the full [API documentation](/api/) for detailed information.
