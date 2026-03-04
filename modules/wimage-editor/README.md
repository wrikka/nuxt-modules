# wimage-editor

Image editor module for Nuxt.js with canvas-based editing capabilities.

## Features

- Image Crop & Resize with aspect ratio control
- Rotate & Flip transformations
- Canvas-based editing engine
- Basic filters (grayscale, sepia, blur, brightness, contrast, saturation, hue)
- Undo/Redo stack
- Touch/Mobile support
- Image compression
- Annotation tools (shapes, text, arrows)
- Export multiple formats (PNG, JPEG, WebP)

## Installation

```bash
bun install @wrikka/wimage-editor
```

## Usage

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/wimage-editor'],
  wimageEditor: {
    defaultCanvasWidth: 800,
    defaultCanvasHeight: 600,
    defaultExportFormat: 'png',
    defaultExportQuality: 0.92,
    enableHistory: true,
    maxHistorySize: 20
  }
})
```

```vue
<template>
  <WImageEditor
    src="/path/to/image.jpg"
    @save="onSave"
    @cancel="onCancel"
  />
</template>
```

## Composables

- `useImageEditor()` - Main editor composable
- `useCanvasEngine()` - Canvas manipulation
- `useImageFilters()` - Apply filters
- `useImageHistory()` - Undo/Redo management

## License

MIT
