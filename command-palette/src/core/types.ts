import type { CommandStore } from './store'
import type { SearchEngine } from './search'
import type { Command, RecentCommand, PinnedCommand } from '../types'

export interface PaletteEvents {
	register: (command: Command) => void
	unregister: (id: string) => void
	execute: (command: Command) => void
	search: (query: string, results: Command[]) => void
	open: () => void
	close: () => void
}

export interface PaletteState {
	isOpen: boolean
	query: string
	selectedIndex: number
	commands: Command[]
	recent: RecentCommand[]
	pinned: PinnedCommand[]
}

export interface PaletteInstance {
	id: string
	store: CommandStore
	search: SearchEngine
	state: PaletteState
	on: <K extends keyof PaletteEvents>(event: K, handler: PaletteEvents[K]) => void
	off: <K extends keyof PaletteEvents>(event: K, handler: PaletteEvents[K]) => void
	emit: <K extends keyof PaletteEvents>(event: K, ...args: Parameters<PaletteEvents[K]>) => void
	open: () => void
	close: () => void
	toggle: () => void
	execute: (id: string) => Promise<void>
	searchCommands: (query: string) => Command[]
}

export type PluginInstallFunction<T = unknown> = (instance: PaletteInstance, options?: T) => void

export interface PalettePlugin<T = unknown> {
	name: string
	install: PluginInstallFunction<T>
	uninstall?: (instance: PaletteInstance) => void
}
