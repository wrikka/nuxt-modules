import type { PalettePlugin, PaletteInstance } from '../types'
import type { PinnedCommand } from '../../types'

export interface PinnedPluginOptions {
	persist?: boolean
	storageKey?: string
}

export const pinnedPlugin: PalettePlugin<PinnedPluginOptions> = {
	name: 'pinned',

	install(instance: PaletteInstance, options: PinnedPluginOptions = {}) {
		const persist = options.persist ?? true
		const storageKey = options.storageKey ?? `palette-pinned-${instance.id}`

		// Load from storage
		if (persist && typeof window !== 'undefined') {
			const stored = localStorage.getItem(storageKey)
			if (stored) {
				try {
					instance.state.pinned = JSON.parse(stored)
				} catch {
					instance.state.pinned = []
				}
			}
		}

		// Add pin/unpin methods to instance
		const pin = (id: string): void => {
			if (!instance.state.pinned.find((p: PinnedCommand) => p.id === id)) {
				instance.state.pinned.push({
					id,
					order: instance.state.pinned.length
				})
				persistPinned()
			}
		}

		const unpin = (id: string): void => {
			instance.state.pinned = instance.state.pinned.filter((p: PinnedCommand) => p.id !== id)
			// Reorder remaining
			instance.state.pinned.forEach((p: PinnedCommand, index: number) => {
				p.order = index
			})
			persistPinned()
		}

		const isPinned = (id: string): boolean => {
			return instance.state.pinned.some((p: PinnedCommand) => p.id === id)
		}

		const reorderPinned = (newOrder: string[]): void => {
			instance.state.pinned = newOrder.map((id, index) => ({
				id,
				order: index
			}))
			persistPinned()
		}

		const persistPinned = (): void => {
			if (persist && typeof window !== 'undefined') {
				localStorage.setItem(storageKey, JSON.stringify(instance.state.pinned))
			}
		}

			// Extend instance
		;(instance as unknown as Record<string, unknown>)['pin'] = pin
		;(instance as unknown as Record<string, unknown>)['unpin'] = unpin
		;(instance as unknown as Record<string, unknown>)['isPinned'] = isPinned
		;(instance as unknown as Record<string, unknown>)['reorderPinned'] = reorderPinned
	},

	uninstall(instance: PaletteInstance) {
		instance.state.pinned = []
	}
}
