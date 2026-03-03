# Installation

## Prerequisites

- Node.js 18+
- Bun package manager

## Install

```bash
bun add @wpackages/diff
```

## Nuxt Setup

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({

  modules: [

    '@wpackages/diff'

  ]

})
```

## What the Module Provides

The `@wpackages/diff` module automatically:

- Adds UnoCSS to your Nuxt project for styling components
- Registers Vue components (`DiffSummary`, `FileDiff`, `DiffSection`) globally
- Makes composables (`useDiff`, `useUnifiedDiff`, `useDiffStatus`) available for auto-import
- Exports the core `diff` function for direct use

After installation, you can immediately start using diff functionality in your Nuxt application.
