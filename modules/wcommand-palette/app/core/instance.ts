// Import PaletteInstance type for internal use and re-export for external use
import type { PaletteInstance, PaletteEvents, PaletteState } from './types'
export type { PaletteInstance } from './types'

import type { CommandStore } from './store'
import type { SearchEngine } from './search'
import type { Command, SearchResult } from '../types'

type EventHandlers = {
	[K in keyof PaletteEvents]: Set<PaletteEvents[K]>
}

export function createPaletteInstance(
	id: string,
	store: CommandStore,
	searchEngine: SearchEngine
): PaletteInstance {
	const state: PaletteState = {
		isOpen: false,
		query: '',
		selectedIndex: 0,
		commands: [],
		recent: [],
		pinned: []
	}

	const events: EventHandlers = {
		register: new Set(),
		unregister: new Set(),
		execute: new Set(),
		search: new Set(),
		open: new Set(),
		close: new Set()
	}

	const on = <K extends keyof PaletteEvents>(event: K, handler: PaletteEvents[K]): void => {
		events[event].add(handler)
	}

	const off = <K extends keyof PaletteEvents>(event: K, handler: PaletteEvents[K]): void => {
		events[event].delete(handler)
	}

	const emit = <K extends keyof PaletteEvents>(event: K, ...args: Parameters<PaletteEvents[K]>): void => {
		events[event].forEach(handler => {
			(handler as (...args: unknown[]) => void)(...args)
		})
	}

	const open = (): void => {
		state.isOpen = true
		emit('open')
	}

	const close = (): void => {
		state.isOpen = false
		emit('close')
	}

	const toggle = (): void => {
		if (state.isOpen) {
			close()
		} else {
			open()
		}
	}

	const execute = async (id: string): Promise<void> => {
		const command = store.get(id)
		if (!command || command.disabled) return

		close()
		await command.action()
		emit('execute', command)
	}

	const searchCommands = (query: string): Command[] => {
		const allCommands = store.getAll().filter(cmd => !cmd.hidden)
		const results = searchEngine.search(query, allCommands)
		state.commands = results.map((r: SearchResult) => r.item)
		emit('search', query, state.commands)
		return state.commands
	}

	return {
		id,
		store,
		search: searchEngine,
		state,
		on,
		off,
		emit,
		open,
		close,
		toggle,
		execute,
		searchCommands
	}
}
