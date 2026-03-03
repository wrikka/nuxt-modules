---
title: Getting Started
description: Learn how to install and set up WUI in your Nuxt 3 project
---

<script setup lang="ts">
import WButton from '~/components/atoms/Button.vue'
import WCard from '~/components/molecules/Card.vue'
import WCardContent from '~/components/molecules/CardContent.vue'
import WCardHeader from '~/components/molecules/CardHeader.vue'
import WCardTitle from '~/components/molecules/CardTitle.vue'
import WAlert from '~/components/molecules/Alert.vue'
import WCode from '~/components/atoms/Code.vue'
</script>

# Getting Started

Welcome to WUI! This guide will help you get started with the WUI Nuxt module in your project.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** version 18 or higher
- **Nuxt 3** project (fresh or existing)
- **TypeScript** configured in your project

<WAlert class="my-4">
  <template #title>WUI requires Nuxt 3</template>
  WUI is built specifically for Nuxt 3 and will not work with Nuxt 2 or other frameworks.
</WAlert>

## Installation

Install WUI using the Nuxt module installer:

```bash
npx nuxi@latest module add @wrikka/wui
```

Or install manually:

```bash
# npm
npm install @wrikka/wui

# yarn
yarn add @wrikka/wui

# pnpm
pnpm add @wrikka/wui

# bun
bun add @wrikka/wui
```

## Configuration

After installation, add WUI to your Nuxt configuration:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wui'],
  wui: {
    // Optional configuration
    theme: 'default',
    prefix: 'W' // Component prefix
  }
})
```

## Basic Usage

Once installed, you can start using WUI components in your Vue templates:

```vue
<template>
  <div class="p-4">
    <WButton @click="handleClick">
      Click me!
    </WButton>
  </div>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('Button clicked!')
}
</script>
```

## Next Steps

Now that you have WUI set up, you can:

- [Explore Components](./components/) - See all available components
- [Learn about Theming](./guide/theming) - Customize the appearance
- [Check Examples](./examples/) - See real-world usage examples

## Troubleshooting

### Component not found error

If you get a "component not found" error, make sure:

1. The module is properly added to your `nuxt.config.ts`
2. You've restarted your development server after installation
3. You're using the correct component name (with prefix)

### Styling issues

If components don't look right:

1. Make sure you have Tailwind CSS configured
2. Check that your CSS framework is compatible with WUI
3. Verify your theme configuration

## Support

Need help? Check out our [GitHub Issues](https://github.com/wrikka/wui/issues) or join our [Discord community](https://discord.gg/wui).
