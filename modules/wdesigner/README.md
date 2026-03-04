# wdesigner

Design & Canvas Module for Nuxt - Vector editing with layers and artboards

## Features

- **Vector Tools**: Pen, Bezier curves, shapes
- **Layer System**: Unlimited nested layers with blend modes
- **Smart Guides**: Intelligent snapping and alignment
- **Artboard System**: Multiple artboards per document
- **Component/Symbol**: Reusable design components
- **Design Tokens**: Scalable design system
- **Masking**: Clip and alpha masks
- **Export Slices**: Export multiple regions at once
- **Real-time Collaboration**: WebRTC-based multi-user editing with cursors and operations sync
- **Plugin Architecture**: Extensible plugin system with hooks and API

## Installation

```bash
bun add @wrikka/wdesigner
```

## Usage

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/wdesigner']
})
```

## Components

- `WDesignerCanvas` - Main canvas component
- `WDesignerLayers` - Layer panel
- `WDesignerToolbar` - Tools toolbar
- `WDesignerProperties` - Properties panel
- `CollaborationPanel` - Real-time collaboration UI
- `PluginManager` - Plugin installation and management

## Composables

- `useDesigner()` - Main designer state
- `useDesignerLayers()` - Layer management
- `useDesignerHistory()` - Undo/redo
- `useDesignerExport()` - Export functionality
- `useDesignerCollaboration()` - Real-time collaboration (WebRTC)
- `useDesignerPlugins()` - Plugin architecture

## Collaboration

Enable real-time collaboration:

```vue
<script setup>
const { collaboration } = useDesigner(projectId)

const startCollaboration = async () => {
  const roomId = await collaboration.createRoom('My Name')
  // Share roomId with teammates
}

const join = async (roomId) => {
  await collaboration.joinRoom(roomId, 'My Name')
}
</script>
```

## Plugins

Create custom plugins:

```typescript
// my-plugin.ts
export const manifest = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  apiVersion: '1.0.0'
}

export const activate = async (context) => {
  context.utils.registerCommand('myCommand', {
    name: 'My Command',
    execute: () => console.log('Hello!')
  })
}
```

## License

MIT
