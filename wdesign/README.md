# @wrikka/wdesign

Design system with UnoCSS and Vue components for consistent UI across applications.

## Installation

```bash
bun add @wrikka/wdesign
```

## Usage

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wrikka/wdesign']
})
```

Then use the components in your templates:

```vue
<template>
  <WButton>Click me</WButton>
</template>
```

## License

MIT
