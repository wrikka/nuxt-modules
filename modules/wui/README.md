# @wrikka/wui

UI Component Library with UnoCSS and Vue components for consistent design across applications.

## Installation

```bash
bun add @wrikka/wui
```

## Usage

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wrikka/wui']
})
```

Then use the components in your templates:

```vue
<template>
  <WButton>Click me</WButton>
</template>
```

## Structure

- `src/runtime/components/` - Vue components (atoms, molecules, organisms)
- `src/runtime/layouts/` - Layout components
- `docs/app/` - Documentation app

## License

MIT
