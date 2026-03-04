# @wrikka/command-palette

A comprehensive Nuxt module for building command palette interfaces with fuzzy search, keyboard navigation, and extensive customization options.

## Features

### Core Features
- **Global Keyboard Shortcut** (Cmd/Ctrl+K) — Open from any page
- **Fuzzy Search** — Intelligent command search powered by Fuse.js
- **Recent Commands** — Quick access to recently used commands
- **Pinned Commands** — Pin frequently used commands for instant access
- **Keyboard Navigation** — Navigate with ↑↓, execute with ↵, close with Esc
- **Command Groups** — Organize commands into categories
- **Context-Aware Commands** — Show commands based on current page context
- **Command Analytics** — Track command usage patterns
- **Multi-Select** — Select and execute multiple commands simultaneously
- **Search History** — Track and recall previous searches
- **Floating Preview** — Preview results before execution
- **Command Chains** — Execute multiple commands in sequence
- **Command Macros** — Create reusable command sequences

### AI & Smart Features
- **AI-Powered Search** — AI understands user intent and suggests commands
- **Command Suggestions** — Smart suggestions based on time and usage patterns
- **Natural Language Input** — Type commands in natural language
- **Voice Commands** — Use voice to search and execute commands

### Productivity Tools
- **Quick File Navigator** — Search and open files in your project
- **Quick Math** — Calculate expressions directly in search box
- **Emoji Picker** — Quick emoji selection with categories
- **Color Picker** — Choose colors with multiple format outputs
- **QR Generator** — Generate QR codes from URLs or text
- **Text Transformation** — Transform text case and encoding (base64, URL, etc.)
- **Quick Notes** — Take and manage quick notes from palette
- **URL Shortener** — Shorten and expand URLs with analytics

### Utility Features
- **Usage Heatmap** — Visualize command usage patterns
- **Export/Import Config** — Backup and share configurations
- **Keyboard Shortcut Helper** — Learn and discover shortcuts
- **Command Aliases** — Create nicknames for commands
- **Cloud Sync** — Sync commands across devices
- **Theme Support** — Multiple theme presets

## Installation

```bash
bun add @wrikka/command-palette
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/command-palette'],
  palette: {
    shortcut: 'meta_k',
    maxRecentCommands: 10,
    maxResults: 10,
    enableAi: true,
    enableVoice: true,
    enableChains: true,
    enableAnalytics: true
  }
})
```

## Usage

```vue
<template>
  <NuxtPage />
  <CommandPalette />
</template>

<script setup>
const { $commandPalette } = useNuxtApp()

onMounted(() => {
  $commandPalette.register({
    id: 'go-home',
    title: 'Go Home',
    description: 'Navigate to home page',
    icon: '🏠',
    shortcut: 'meta_shift_h',
    action: () => navigateTo('/')
  })
})
</script>
```

## API

### Core Composables

| Composable | Description |
|------------|-------------|
| `usePalette()` | Core command management |
| `usePaletteProvider()` | Context provider setup |
| `useCommandSuggestions()` | AI-powered suggestions |
| `useCommandAnalytics()` | Usage analytics |
| `useCommandChains()` | Command chaining |
| `useCommandMacros()` | Macro management |

### Navigation & Files

| Composable | Description |
|------------|-------------|
| `useQuickFileNavigator()` | File search and navigation |
| `useSearchFilters()` | Advanced search filtering |
| `useSearchHistory()` | Search history management |

### Smart Features

| Composable | Description |
|------------|-------------|
| `useNaturalLanguage()` | Natural language parsing |
| `useVoiceCommands()` | Voice control |
| `useAISuggestions()` | AI recommendations |

### Productivity

| Composable | Description |
|------------|-------------|
| `useQuickMath()` | Mathematical expressions |
| `useEmojiPicker()` | Emoji selection |
| `useColorPicker()` | Color selection |
| `useQRGenerator()` | QR code generation |
| `useTextTransform()` | Text transformation |
| `useQuickNotes()` | Quick note taking |
| `useURLShortener()` | URL shortening |

### Utility

| Composable | Description |
|------------|-------------|
| `useUsageHeatmap()` | Usage visualization |
| `useConfigImportExport()` | Config backup |
| `useShortcutHelper()` | Shortcut discovery |
| `useCommandAliases()` | Command aliases |
| `useCloudSync()` | Cross-device sync |
| `useTheme()` | Theme management |
| `useFloatingMode()` | Floating palette |

### UX/UI Composables

| Composable | Description |
|------------|-------------|
| `useSmartPositioning()` | Smart palette positioning |
| `useCommandBreadcrumbs()` | Command chain breadcrumbs |
| `useInlinePreview()` | Inline preview panel |
| `useSkeletonLoading()` | Skeleton loading states |
| `useFocusTrap()` | Focus trap for accessibility |
| `useAriaLive()` | ARIA live announcements |
| `useKeyboardHintOverlay()` | Keyboard shortcuts overlay |
| `useCommandIconFallback()` | Auto-generated icons |
| `useEmptyState()` | Empty state illustrations |
| `useMicroInteractions()` | Micro-animations |
| `useScrollSnap()` | Scroll snap to items |
| `useVirtualScroll()` | Virtual scrolling for long lists |
| `useGestureSupport()` | Mobile swipe gestures |
| `useDynamicHeight()` | Dynamic palette height |
| `useBlurBackdrop()` | Blur backdrop effect |
| `useSystemTray()` | System tray integration |
| `useHapticFeedback()` | Haptic feedback on mobile |
| `useSoundEffects()` | Audio feedback |
| `useWindowResizeObserver()` | Responsive window handling |
| `useCommandCountBadge()` | Result count badges |
| `useLoadingProgress()` | Loading progress bar |
| `useContextualHeader()` | Contextual header info |
| `usePinIndicator()` | Pin status indicators |
| `useRecentBadge()` | "New" badge for recent commands |

### Command Registration

```ts
const { register } = usePalette()

register({
  id: 'unique-id',
  title: 'Command Title',
  description: 'Description',
  icon: '🔍',
  shortcut: 'meta_k',
  keywords: ['search', 'find'],
  group: 'navigation',
  context: ['/dashboard'],
  chainable: true,
  preview: { type: 'component', component: 'MyPreview' },
  action: () => { /* ... */ }
})
```

## Feature Examples

### Quick Math
```ts
const { evaluate } = useQuickMath()
const result = evaluate('10 * 5 + 3') // { result: 53, formatted: '53' }
```

### Emoji Picker
```ts
const { searchEmojis, selectEmoji } = useEmojiPicker()
const emojis = searchEmojis('heart')
selectEmoji('❤️')
```

### Color Picker
```ts
const { selectColor, getFormats } = useColorPicker()
selectColor('#3b82f6')
const formats = getFormats('#3b82f6')
// { hex: '#3b82f6', rgb: 'rgb(59, 130, 246)', ... }
```

### URL Shortener
```ts
const { shorten, expand, getStats } = useURLShortener()
const short = shorten('https://example.com', 'my-link')
// { id: 'my-link', short: 'http://localhost:3000/s/my-link', ... }
```

### Text Transformation
```ts
const { transform } = useTextTransform()
transform('hello world', 'camelCase') // { transformed: 'helloWorld' }
transform('hello', 'base64-encode') // { transformed: 'aGVsbG8=' }
```

### Natural Language
```ts
const { parse } = useNaturalLanguage()
const result = parse('go to settings')
// { intent: 'settings', confidence: 0.9, matchedCommand: {...} }
```

### Command Aliases
```ts
const { createAlias, resolveAlias } = useCommandAliases()
createAlias('gh', 'go-home')
const commandId = resolveAlias('gh') // 'go-home'
```

## License

MIT
