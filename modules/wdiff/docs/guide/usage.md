# Usage

## Basic Usage

### Using the `useDiff` Composable

The `useDiff` composable provides reactive diff computation in your Vue components.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDiff } from '@wpackages/diff'

const oldData = ref({ name: 'John', age: 30 })
const newData = ref({ name: 'Jane', age: 30 })

const { diffResult } = useDiff(oldData, newData)

// diffResult.value will be:
// {
//   added: { name: 'Jane' },
//   deleted: { name: 'John' },
//   updated: {}
// }
</script>

<template>
  <div>
    <p>Added: {{ JSON.stringify(diffResult.added) }}</p>
    <p>Deleted: {{ JSON.stringify(diffResult.deleted) }}</p>
    <p>Updated: {{ JSON.stringify(diffResult.updated) }}</p>
  </div>
</template>
```

### Using the `diff` Function Directly

For non-reactive scenarios, use the `diff` function directly.

```ts
import { diff } from '@wpackages/diff'

const oldData = { name: 'John', age: 30 }
const newData = { name: 'Jane', age: 31 }

const result = diff(oldData, newData)
// result:
// {
//   added: { name: 'Jane' },
//   deleted: { name: 'John' },
//   updated: { age: 31 }
// }
```

## Advanced Usage

### Using Diff Components

Display diffs with pre-built Vue components.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDiff } from '@wpackages/diff'
import { DiffSummary, FileDiff } from '@wpackages/diff'

const oldData = ref({
  users: [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' }
  ],
  settings: { theme: 'light' }
})

const newData = ref({
  users: [
    { id: 1, name: 'Alice', role: 'superadmin' },
    { id: 3, name: 'Charlie', role: 'user' }
  ],
  settings: { theme: 'dark' }
})

const { diffResult } = useDiff(oldData, newData)
</script>

<template>
  <div class="space-y-6">
    <DiffSummary :diff="diffResult" title="Data Changes Summary" />

    <FileDiff :diff="diffResult" title="Detailed Changes" />
  </div>
</template>
```

### Generating Unified Diff Output

Use `useUnifiedDiff` to create formatted diff text.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDiff, useUnifiedDiff } from '@wpackages/diff'

const oldConfig = ref({
  api: { url: 'https://api.example.com', timeout: 5000 },
  features: ['auth', 'logging']
})

const newConfig = ref({
  api: { url: 'https://api.new.com', timeout: 10000 },
  features: ['auth', 'logging', 'cache']
})

const { diffResult } = useDiff(oldConfig, newConfig)
const { unifiedDiff } = useUnifiedDiff(diffResult, {
  title: 'Configuration Changes'
})
</script>

<template>
  <div>
    <h3>Unified Diff</h3>
    <pre class="bg-gray-100 p-4 rounded">{{ unifiedDiff }}</pre>
  </div>
</template>
```

### Analyzing Diff Statistics

Use `useDiffStatus` for detailed change analysis.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDiff, useDiffStatus } from '@wpackages/diff'

const oldState = ref({ count: 0, active: false })
const newState = ref({ count: 5, active: true, paused: false })

const { diffResult } = useDiff(oldState, newState)
const {
  hasChanges,
  addedCount,
  deletedCount,
  updatedCount,
  totalChanges
} = useDiffStatus(diffResult)
</script>

<template>
  <div v-if="hasChanges" class="stats">
    <p>Total changes: {{ totalChanges }}</p>
    <p>Added: {{ addedCount }}, Deleted: {{ deletedCount }}, Updated: {{ updatedCount }}</p>
  </div>
  <div v-else>
    No changes detected
  </div>
</template>
```

### Ignoring Specific Paths

Use `DiffOptions` to ignore certain paths during comparison.

```ts
import { diff } from '@wpackages/diff'

const oldData = {
  user: { name: 'John', email: 'john@example.com' },
  metadata: { timestamp: 1234567890, version: '1.0' }
}

const newData = {
  user: { name: 'Jane', email: 'jane@example.com' },
  metadata: { timestamp: 1234567891, version: '1.1' }
}

const result = diff(oldData, newData, {
  ignorePaths: ['metadata.timestamp']
})

// result.updated will only contain email change, not timestamp
```

### Handling Complex Data Types

The diff function handles various data types including arrays, objects, Maps, and Sets.

```ts
import { diff } from '@wpackages/diff'

const oldData = {
  items: [1, 2, 3],
  map: new Map([['a', 1], ['b', 2]]),
  set: new Set([1, 2, 3])
}

const newData = {
  items: [1, 2, 3, 4],
  map: new Map([['a', 1], ['c', 3]]),
  set: new Set([2, 3, 4])
}

const result = diff(oldData, newData)
// Handles array additions, map key changes, set differences
```
