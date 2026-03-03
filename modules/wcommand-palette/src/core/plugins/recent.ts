import type { PalettePlugin, PaletteInstance } from '../types'
import type { RecentCommand } from '../../types'

export interface RecentPluginOptions {
	maxRecent?: number
	persist?: boolean
	storageKey?: string
}

export const recentPlugin: PalettePlugin<RecentPluginOptions> = {
	name: 'recent',

	install(instance: PaletteInstance, options: RecentPluginOptions = {}) {
		const maxRecent = options.maxRecent ?? 10
		const persist = options.persist ?? true
		const storageKey = options.storageKey ?? `palette-recent-${instance.id}`

		// Load from storage
		if (persist && typeof window !== 'undefined') {
			const stored = localStorage.getItem(storageKey)
			if (stored) {
				try {
					instance.state.recent = JSON.parse(stored)
				} catch {
					instance.state.recent = []
				}
			}
		}

		// Track executed commands
		instance.on('execute', (command) => {
			const existing = instance.state.recent.find((r: RecentCommand) => r.id === command.id)
			if (existing) {
				existing.count++
				existing.timestamp = Date.now()
			} else {
				instance.state.recent.push({
					id: command.id,
					timestamp: Date.now(),
					count: 1
				})
			}

			// Sort and limit
			instance.state.recent = instance.state.recent
				.sort((a: RecentCommand, b: RecentCommand) => b.timestamp - a.timestamp)
				.slice(0, maxRecent)

			// Persist
			if (persist && typeof window !== 'undefined') {
				localStorage.setItem(storageKey, JSON.stringify(instance.state.recent))
			}
		})
	},

	uninstall(instance: PaletteInstance) {
		instance.state.recent = []
	}
}
