# @wrikka/wslide

Better than Slidev - A powerful slide deck module for Nuxt.js with superior features and developer experience.

## Features (ที่ดีกว่า Slidev)

| Feature           | Slidev        | WSlide                     |
| ----------------- | ------------- | -------------------------- |
| Nuxt Integration  | Standalone    | Native                     |
| Transitions       | Basic         | Auto-animate + 12+ effects |
| Video Backgrounds | Plugin needed | Native support             |
| Presenter Sync    | Basic         | Real-time WebSocket        |
| Mobile Experience | Limited       | Touch gestures             |
| Component Slots   | Limited       | Full slot system           |
| TOC Search        | None          | Built-in fuzzy search      |
| Font Size Control | None          | Adjustable notes           |

## Installation

```bash
bun add @wrikka/wslide
```

## Usage

### Basic Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
	modules: ["@wrikka/wslide",],
	wslide: {
		theme: "default",
		transition: "slide",
	},
},);
```

### Create Slides

```markdown
---
title: My Presentation
author: Developer
---

# Welcome to WSlide

Better than Slidev!

---
layout: two-cols
title: Features
---

## Left Column

- Native Nuxt integration
- Auto-animate transitions
- Video backgrounds

## Right Column

- Touch gestures
- Real-time presenter sync
- Fuzzy search TOC
```

### Use in Page

```vue
<template>
  <WSlideDeck :deck="deck" />
</template>

<script setup>
const deck = parseSlideDeck(slideContent);
</script>
```

## Components

- **WSlideDeck** - Main deck container
- **WSlideSlide** - Individual slide renderer
- **WSlideControls** - Navigation controls
- **WSlideProgress** - Progress bar
- **WSlideToc** - Table of contents with search
- **WSlideNotes** - Presenter notes panel

## Keyboard Shortcuts

| Key       | Action               |
| --------- | -------------------- |
| → ↓ Space | Next slide/click     |
| ← ↑       | Previous slide/click |
| Home      | First slide          |
| End       | Last slide           |

## Touch Gestures

- Swipe left → Next
- Swipe right → Previous

## Scripts

- `bun run dev` - Development server
- `bun run build` - Build module
- `bun run lint` - Run linter
- `bun run test` - Run tests
- `bun run verify` - Full verification
