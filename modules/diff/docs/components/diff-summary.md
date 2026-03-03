# DiffSummary

Displays a summary of changes with counts and percentages.

## Props

- `diff` (required): The diff result object
- `title` (optional): Title for the summary

## Example

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
