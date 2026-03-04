# Components

Overview of Vue components provided by @wpackages/diff.

## Available Components

- [DiffSummary](/components/diff-summary) - Displays a summary of changes with counts and percentages
- [FileDiff](/components/file-diff) - Structured view of differences grouped by type
- [DiffSection](/components/diff-section) - Internal component for displaying diff sections (typically used by FileDiff)

## Usage

Import components in your Vue files:

```vue
<script setup lang="ts">
import { DiffSummary, FileDiff } from '@wpackages/diff'
</script>

<template>
  <DiffSummary :diff="diffResult" />
</template>
```

## Styling

Components use UnoCSS for styling. The module automatically includes UnoCSS in your Nuxt project. Components use Tailwind CSS-compatible utility classes that are processed by UnoCSS.

You can customize the appearance by overriding the default classes or extending the UnoCSS configuration in your project.
