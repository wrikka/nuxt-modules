# wmedia-library

Asset Management Module for Nuxt - Smart media library with AI tagging

## Features

- **Smart Search**: AI-powered content-aware search
- **Folder Hierarchy**: Nested folder structure
- **Tag System**: Multi-level tags with auto-suggestions
- **Auto-tagging AI**: Automatic content analysis and tagging
- **Collections**: Organize assets into collections
- **Favorites**: Bookmark important assets
- **Duplicate Detection**: Find and manage duplicates
- **Metadata Editor**: Edit EXIF, XMP metadata

## Installation

```bash
bun add @wrikka/wmedia-library
```

## Usage

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/wmedia-library']
})
```

## Components

- `WAssetLibrary` - Main asset browser
- `WAssetSearch` - Advanced search component
- `WAssetTags` - Tag management
- `WAssetFolders` - Folder tree view

## Composables

- `useAssetLibrary()` - Library state management
- `useAssetSearch()` - Search functionality
- `useAssetTags()` - Tag operations
- `useAssetMetadata()` - Metadata editing

## License

MIT
