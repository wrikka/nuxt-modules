# @wrikka/wmarkdown

Advanced Markdown module for Nuxt with custom parser, interactive features, and Notion-like editor mode.

## Features

- **Custom Markdown Parser** - No markdown-it dependency, built from scratch for maximum flexibility
- **Shiki Syntax Highlighting** - Best-in-class performance with lazy loading
- **Dual Mode Interface** - Preview Mode and Editor Mode (Notion-like block-based editing)
- **Link Hover Preview** - Hover over links to see instant previews
- **Beautiful Tables** - Sortable, filterable, and styled tables
- **Table of Contents** - Auto-generated TOC with scroll spy
- **Interactive Elements** - Collapsible sections, tabs, and more
- **UnoCSS Integration** - Fully styled with atomic CSS
- **TypeScript** - Full type safety

## Installation

```bash
bun add @wrikka/wmarkdown
```

## Usage

### Basic Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wmarkdown']
})
```

### Preview Mode

```vue
<template>
  <WMarkdownPreview :content="markdownContent" />
</template>
```

### Editor Mode

```vue
<template>
  <WMarkdownEditor v-model="content" />
</template>
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wmarkdown'],
  wmarkdown: {
    shiki: {
      theme: 'github-light',
      darkTheme: 'github-dark'
    },
    features: {
      linkPreview: true,
      toc: true,
      tables: true
    }
  }
})
```

## License

MIT
