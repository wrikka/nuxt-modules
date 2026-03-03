import type { FuseResultMatch } from 'fuse.js'

export interface Command {
	id: string
	name: string
	title: string
	description?: string
	icon?: string
	shortcut?: string
	keywords?: string[]
	group?: string
	context?: string[]
	action: () => void | Promise<void>
	disabled?: boolean
	hidden?: boolean
	priority?: number
}

export interface CommandGroup {
	id: string
	name: string
	icon?: string
	priority?: number
}

export interface CommandWithMeta extends Command {
	_score?: number
	_matches?: readonly FuseResultMatch[]
	_isRecent?: boolean
	_isPinned?: boolean
}

export interface SearchResult {
	item: Command
	score?: number | undefined
	matches?: readonly FuseResultMatch[] | undefined
}

export interface RecentCommand {
	id: string
	timestamp: number
	count: number
}

export interface PinnedCommand {
	id: string
	order: number
}

export interface CommandHistoryEntry {
	query: string
	timestamp: number
}

export interface CommandPaletteState {
	isOpen: boolean
	searchQuery: string
	selectedIndex: number
	recentCommands: RecentCommand[]
	pinnedCommands: PinnedCommand[]
	history: CommandHistoryEntry[]
}

export interface CommandPaletteConfig {
	shortcut?: string
	maxRecentCommands?: number
	maxResults?: number
	fuseOptions?: {
		keys?: string[]
		threshold?: number
		includeScore?: boolean
	}
}

export type CommandRegistration = Omit<Command, 'id'> & { id?: string }

export interface CommandPaletteApi {
	register: (command: CommandRegistration) => string
	unregister: (id: string) => void
	open: () => void
	close: () => void
	toggle: () => void
	execute: (id: string) => Promise<void>
	pin: (id: string) => void
	unpin: (id: string) => void
	isPinned: (id: string) => boolean
	getRecent: () => RecentCommand[]
	clearRecent: () => void
}
