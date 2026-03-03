---
layout: page
title: WUI Documentation
description: Comprehensive documentation for the WUI Nuxt module - a powerful UI component library built with Vue 3 and TypeScript.
---

<script setup lang="ts">
import WButton from '~/components/atoms/Button.vue'
import WCard from '~/components/molecules/Card.vue'
import WCardContent from '~/components/molecules/CardContent.vue'
import WCardHeader from '~/components/molecules/CardHeader.vue'
import WCardTitle from '~/components/molecules/CardTitle.vue'
import WFlex from '~/components/atoms/Flex.vue'
import WHeading from '~/components/atoms/Heading.vue'
import WIcon from '~/components/atoms/Icon.vue'
</script>

# Welcome to WUI Documentation

WUI is a comprehensive UI component library built specifically for Nuxt 3 applications. It provides a complete set of atomic design components that follow modern design principles and accessibility standards.

## 🚀 Quick Start

Get started with WUI in just a few steps:

1. **Install the module**
   ```bash
   npx nuxi@latest module add @wrikka/wui
   ```

2. **Configure your app**
   ```ts
   // nuxt.config.ts
   export default defineNuxtConfig({
     modules: ['@wrikka/wui']
   })
   ```

3. **Start using components**
   ```vue
   <template>
     <WButton>Click me</WButton>
   </template>
   ```

## ✨ Features

<WFlex direction="row" gap="md" wrap="wrap" class="my-6">
  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WIcon name="component" class="w-6 h-6 text-primary" />
      <WCardTitle>Atomic Design</WCardTitle>
    </WCardHeader>
    <WCardContent>
      Components organized in atoms, molecules, and organisms following atomic design principles.
    </WCardContent>
  </WCard>

  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WIcon name="accessibility" class="w-6 h-6 text-primary" />
      <WCardTitle>Accessible</WCardTitle>
    </WCardHeader>
    <WCardContent>
      All components follow WCAG 2.1 guidelines and include proper ARIA attributes.
    </WCardContent>
  </WCard>

  <WCard class="flex-1 min-w-64">
    <WCardHeader>
      <WIcon name="typescript" class="w-6 h-6 text-primary" />
      <WCardTitle>TypeScript</WCardTitle>
    </WCardHeader>
    <WCardContent>
      Full TypeScript support with proper type definitions for all components and props.
    </WCardContent>
  </WCard>
</WFlex>

## 📚 Documentation Structure

- **[Getting Started](./guide/getting-started)** - Installation and basic setup
- **[Components](./components/)** - Complete component reference
- **[API Reference](./api/)** - TypeScript interfaces and utilities
- **[Examples](./examples/)** - Interactive examples and use cases

## 🎨 Design System

WUI follows a consistent design system with:

- **Colors**: Semantic color tokens for light and dark themes
- **Typography**: Scalable font system with proper hierarchy
- **Spacing**: Consistent spacing scale using Tailwind CSS
- **Components**: Reusable UI primitives that can be composed

## 🤝 Contributing

We welcome contributions! Please see our [contributing guide](./contributing) for details on how to get involved.

## 📄 License

WUI is open source software licensed under the MIT License.
