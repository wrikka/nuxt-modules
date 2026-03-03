// Core exports
export { paletteRegistry, type PaletteRegistry, type RegistryOptions } from './core/registry'
export { createCommandStore, type CommandStore } from './core/store'
export { createSearchEngine, type SearchEngine, type SearchOptions } from './core/search'
export { createPaletteInstance } from './core/instance'
export type { PaletteInstance } from './core/types'

// Plugin exports
export { PluginManager, recentPlugin, pinnedPlugin, shortcutPlugin } from './core/plugins'
export type { RecentPluginOptions, PinnedPluginOptions, ShortcutPluginOptions } from './core/plugins'

// Types
export type { PalettePlugin, PaletteEvents, PaletteState } from './core/types'

// Vue exports
export { usePalette, type UsePaletteOptions, type UsePaletteReturn } from './runtime/composables/usePalette'
export {
	providePalette,
	usePaletteContext,
	PALETTE_INJECTION_KEY,
	type PaletteProviderOptions,
	type PaletteContext
} from './runtime/composables/usePaletteProvider'

// Re-export original types
export type {
	Command,
	CommandGroup,
	CommandWithMeta,
	RecentCommand,
	PinnedCommand,
	SearchResult,
	CommandHistoryEntry,
	CommandRegistration,
	CommandPaletteApi,
	CommandPaletteConfig,
	CommandPaletteState
} from './types'
