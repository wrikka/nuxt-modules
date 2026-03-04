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
	/** Command arguments for inline execution */
	args?: CommandArgument[]
	/** Preview component or data */
	preview?: CommandPreview
	/** Whether command supports chaining */
	chainable?: boolean
	/** Chain configuration */
	chainConfig?: ChainConfig
}

export interface CommandArgument {
	name: string
	type: 'string' | 'number' | 'boolean' | 'select' | 'date'
	required?: boolean
	default?: unknown
	options?: { label: string; value: unknown }[]
	placeholder?: string
}

export interface CommandPreview {
	type: 'component' | 'iframe' | 'markdown' | 'json'
	component?: string
	data?: unknown
	url?: string
}

export interface ChainConfig {
	/** Keep palette open after execution */
	keepOpen?: boolean
	/** Delay before next command (ms) */
	delay?: number
	/** Maximum chain depth */
	maxDepth?: number
	/** Commands that can follow this one */
	nextCommands?: string[]
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

export interface CommandChain {
	id: string
	commands: string[]
	name?: string
	description?: string
}

export interface CommandMacro {
	id: string
	name: string
	commands: MacroStep[]
	shortcut?: string
	createdAt: number
}

export interface MacroStep {
	commandId: string
	args?: Record<string, unknown>
	delay?: number
}

export type SearchFilter = 'all' | 'files' | 'tags' | 'actions' | 'recent' | 'pinned'

export interface SearchFilters {
	/** @file - Filter by files */
	files?: string[]
	/** #tag - Filter by tags */
	tags?: string[]
	/** >action - Filter by action type */
	actionType?: string
	/** Filter by group */
	group?: string
}

export interface CommandPaletteState {
	isOpen: boolean
	searchQuery: string
	selectedIndex: number
	recentCommands: RecentCommand[]
	pinnedCommands: PinnedCommand[]
	history: CommandHistoryEntry[]
	/** Current active chain */
	activeChain?: CommandChain
	/** Chain execution history */
	chainHistory: string[]
	/** Current tab */
	activeTab: PaletteTab
	/** Theme mode */
	theme: ThemePreset
	/** Floating mode state */
	isFloating: boolean
	/** Floating position */
	position?: { x: number; y: number }
	/** Voice search active */
	voiceActive: boolean
}

export type PaletteTab = 'all' | 'recent' | 'pinned' | 'ai' | 'extensions'

export type ThemePreset = 'dark' | 'light' | 'high-contrast' | 'auto'

export interface CommandPaletteConfig {
	shortcut?: string
	maxRecentCommands?: number
	maxResults?: number
	maxHistory?: number
	fuseOptions?: {
		keys?: string[]
		threshold?: number
		includeScore?: boolean
	}
	/** Default theme */
	theme?: ThemePreset
	/** Enable command chains */
	enableChains?: boolean
	/** Enable AI suggestions */
	enableAi?: boolean
	/** Enable voice commands */
	enableVoice?: boolean
	/** Enable floating mode */
	enableFloating?: boolean
	/** Enable analytics */
	enableAnalytics?: boolean
	/** Enable sync */
	enableSync?: boolean
}

export type CommandRegistration = Omit<Command, 'id'> & { id?: string }

export interface CommandPaletteApi {
	register: (command: CommandRegistration) => string
	unregister: (id: string) => void
	open: () => void
	close: () => void
	toggle: () => void
	execute: (id: string) => Promise<void>
	/** Execute with arguments */
	executeWithArgs: (id: string, args: Record<string, unknown>) => Promise<void>
	pin: (id: string) => void
	unpin: (id: string) => void
	isPinned: (id: string) => boolean
	getRecent: () => RecentCommand[]
	clearRecent: () => void
	/** Start a command chain */
	startChain: (commandIds: string[]) => CommandChain
	/** Stop current chain */
	stopChain: () => void
	/** Create macro */
	createMacro: (name: string, steps: MacroStep[]) => CommandMacro
	/** Execute macro */
	executeMacro: (macroId: string) => Promise<void>
	/** Get search history */
	getHistory: () => CommandHistoryEntry[]
	/** Clear search history */
	clearHistory: () => void
	/** Search with filters */
	search: (query: string, filters?: SearchFilters) => Command[]
}

export interface AnalyticsEvent {
	commandId: string
	event: 'search' | 'execute' | 'pin' | 'chain' | 'macro'
	timestamp: number
	duration?: number
	query?: string
}

export interface CommandAnalytics {
	/** Total command executions */
	totalExecutions: number
	/** Most used commands */
	topCommands: { commandId: string; count: number }[]
	/** Search patterns */
	searchPatterns: { query: string; count: number }[]
	/** Average execution time */
	avgExecutionTime: number
	/** Chain usage stats */
	chainStats: { chainId: string; executions: number }[]
}

export interface VoiceCommandResult {
	transcript: string
	confidence: number
	matchedCommand?: Command
}

export interface SuggestionItem {
	id: string
	type: 'command' | 'recent' | 'ai' | 'template'
	title: string
	description?: string
	icon?: string
	command?: Command
}
