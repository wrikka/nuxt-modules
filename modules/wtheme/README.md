# @wrikka/wtheme

UnoCSS preset สำหรับ Wrikka design system theme

## Features

- 🎨 Theme colors แบบ HSL CSS variables
- 🌙 Dark mode support
- 🔧 Customizable colors
- ⚡ UnoCSS preset integration

## Installation

```bash
bun add @wrikka/wtheme
```

## Usage

### With UnoCSS

```ts
// uno.config.ts
import { defineConfig, presetWind4 } from 'unocss'
import { presetWtheme } from '@wrikka/wtheme'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWtheme(),
  ],
})
```

### With Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
  ],

  unocss: {
    nuxtLayers: true,
  },
})
```

```ts
// uno.config.ts
import { defineConfig, presetWind4 } from 'unocss'
import { presetWtheme } from '@wrikka/wtheme'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWtheme(),
  ],
})
```

## Theme Colors

### Primary
- `bg-primary` - Primary background
- `text-primary-foreground` - Primary text
- `hover:bg-primary-hover` - Primary hover state

### Secondary
- `bg-secondary` - Secondary background
- `text-secondary-foreground` - Secondary text

### Status
- `bg-success` / `text-success-foreground`
- `bg-warning` / `text-warning-foreground`
- `bg-destructive` / `text-destructive-foreground`

### Surface
- `bg-surface` - Surface background
- `bg-surface-elevated` - Elevated surface
- `text-surface-foreground` - Surface text
- `border-border` - Border color

### Interaction
- `bg-muted` / `text-muted-foreground`
- `bg-accent` / `text-accent-foreground`

### Other
- `bg-background` / `text-foreground`
- `border-focus` - Focus ring color
- `bg-overlay` - Overlay color
- `bg-skeleton` / `bg-skeleton-shine`

## Examples

```vue
<!-- Primary button -->
<button class="bg-primary text-primary-foreground hover:bg-primary-hover">
  Click me
</button>

<!-- Card with surface -->
<div class="bg-surface border border-border rounded-lg p-4">
  <h2 class="text-foreground font-bold">Title</h2>
  <p class="text-muted-foreground">Description</p>
</div>

<!-- Destructive action -->
<button class="bg-destructive text-destructive-foreground hover:bg-destructive-hover">
  Delete
</button>
```

## Customization

```ts
import { presetWtheme } from '@wrikka/wtheme'

presetWtheme({
  darkMode: true,
  colors: {
    primary: 'hsl(200 100% 50%)',
  },
})
```

## License

MIT
