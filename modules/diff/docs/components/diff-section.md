# DiffSection

Internal component for displaying diff changes grouped by type. Typically used by `FileDiff` component.

## Props

- `type` (required): The type of changes to display (`"added"`, `"deleted"`, or `"updated"`)
- `items` (required): Object containing the changed items
- `icon` (required): Icon to display in the section header
- `label` (required): Label text for the section

## Example

```vue
<script setup lang="ts">
import { DiffSection } from '@wpackages/diff'
</script>

<template>
  <DiffSection
    type="added"
    :items="{ name: 'Jane', age: 25 }"
    icon="➕"
    label="Added Items"
  />
</template>
```

## Notes

This component is primarily used internally by the `FileDiff` component. For most use cases, use `FileDiff` or `DiffSummary` instead.
