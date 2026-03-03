import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { paletteRegistry } from '../../core/registry'
import { recentPlugin, pinnedPlugin, shortcutPlugin } from '../../core/plugins'
import type { PaletteConfig } from '../../module'

export default defineNuxtPlugin((_nuxtApp) => {
	const config = (useRuntimeConfig().public as Record<string, unknown>)['palette'] as PaletteConfig

	// Create default palette instance
	const defaultPalette = paletteRegistry.create('default', {
		search: config.search!
	})

	// Setup plugins
	recentPlugin.install(defaultPalette, { maxRecent: config.maxRecentCommands! })
	pinnedPlugin.install(defaultPalette)
	shortcutPlugin.install(defaultPalette)

	// Provide global shortcut
	if (config.shortcut && typeof window !== 'undefined') {
		const handleKeydown = (event: KeyboardEvent) => {
			const parts: string[] = []
			if (event.metaKey) parts.push('meta')
			if (event.ctrlKey) parts.push('ctrl')
			if (event.altKey) parts.push('alt')
			if (event.shiftKey) parts.push('shift')
			parts.push(event.key.toLowerCase())

			const pressed = parts.join('_')
			if (pressed === config.shortcut) {
				event.preventDefault()
				defaultPalette.toggle()
			}
		}

		window.addEventListener('keydown', handleKeydown)
	}

	// Provide to Nuxt app
	return {
		provide: {
			palette: defaultPalette,
			paletteRegistry
		}
	}
})
