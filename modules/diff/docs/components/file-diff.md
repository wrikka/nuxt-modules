# FileDiff

Structured view of differences grouped by type.

## Props

- `diff` (required): The diff result object
- `title` (optional): Title for the diff view

## Example

```vue
<template>
  <FileDiff :diff="diffResult" title="File Changes" />
</template>

<script setup lang="ts">
import { FileDiff, diff } from '@wpackages/diff'

const oldData = { items: [1, 2, 3] }
const newData = { items: [1, 2, 3, 4] }
const diffResult = diff(oldData, newData)
</script>
```
