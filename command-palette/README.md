# @wrikka/command-palette

A comprehensive Nuxt module for building command palette interfaces with fuzzy search, keyboard navigation, and extensive customization options.

## Features

- **Global Keyboard Shortcut** (Cmd/Ctrl+K) — Open from any page
- **Fuzzy Search** — Intelligent command search powered by Fuse.js
- **Recent Commands** — Quick access to recently used commands
- **Pinned Commands** — Pin frequently used commands for instant access
- **Keyboard Navigation** — Navigate with ↑↓, execute with ↵, close with Esc
- **Command Groups** — Organize commands into categories
- **Context-Aware Commands** — Show commands based on current page context
- **Command Analytics** — Track command usage patterns
- **Multi-Select** — Select and execute multiple commands simultaneously

## Installation

```bash
bun add @wrikka/command-palette
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/command-palette'],
  commandPalette: {
    shortcut: 'meta_k',      // Default: Cmd+K
    maxRecentCommands: 10,
    maxResults: 10
  }
})
```

## Usage

```vue
<!-- app.vue -->
<template>
  <NuxtPage />
  <CommandPalette />
</template>

<script setup>
const { $commandPalette } = useNuxtApp()

onMounted(() => {
  $commandPalette.register({
    id: 'go-home',
    title: 'Go Home',
    description: 'Navigate to home page',
    icon: '🏠',
    shortcut: 'meta_shift_h',
    action: () => navigateTo('/')
  })
})
</script>
```

## API

### Composables

| Composable | Description |
|------------|-------------|
| `useCommandPalette()` | Core command management |
| `useCommandGroups()` | Command grouping |
| `useContextCommands()` | Context-aware commands |
| `useCommandAnalytics()` | Usage analytics |
| `useMultiSelectCommands()` | Multi-selection support |

### Command Registration

```ts
const { register } = useCommandPalette()

register({
  id: 'unique-id',           // Optional, auto-generated if not provided
  title: 'Command Title',    // Required
  description: 'Description', // Optional
  icon: '🔍',                // Optional
  shortcut: 'meta_k',        // Optional
  keywords: ['search', 'find'], // Optional
  group: 'navigation',       // Optional
  context: ['/dashboard'],   // Optional - only show on specific pages
  action: () => { /* ... */ } // Required
})
```

## License

MIT
