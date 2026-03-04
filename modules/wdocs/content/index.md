---
title: Getting Started
description: Get started with WDocs
toc: true
---

# Getting Started

WDocs is a documentation module for Nuxt that provides a VitePress-like experience.

## Features

- 📝 **Markdown-based** - Write documentation in Markdown
- 🎨 **Themable** - Use WUI components for consistent design
- ⚡️ **Fast SSG** - Static site generation with Nuxt
- 🔍 **Search** - Built-in full-text search
- 📱 **Responsive** - Mobile-friendly design

## Installation

```bash
bun add @wrikka/wdocs
```

## Quick Start

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wrikka/wdocs']
})
```

Start writing your documentation in the `content/` directory.
