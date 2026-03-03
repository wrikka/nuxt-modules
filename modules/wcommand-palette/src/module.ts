import { defineNuxtModule, addPlugin, addImports, addComponentsDir, createResolver } from '@nuxt/kit'
import type { SearchOptions } from './core/search'
import type { PalettePlugin } from './core/types'

export interface PaletteConfig {
	shortcut?: string
	maxRecentCommands?: number
	maxResults?: number
	search?: SearchOptions
	instances?: Record<string, {
		shortcut?: string
		maxResults?: number
		plugins?: string[]
	}>
}

const defaultConfig: PaletteConfig = {
	shortcut: 'meta_k',
	maxRecentCommands: 10,
	maxResults: 10,
	search: {
		keys: ['name', 'title', 'description', 'keywords'],
		threshold: 0.3,
		maxResults: 10
	}
}

export default defineNuxtModule<PaletteConfig>({
	meta: {
		name: '@wrikka/command-palette',
		configKey: 'palette'
	},
	defaults: defaultConfig,
	setup(options, nuxt) {
		const resolver = createResolver(import.meta.url)

		// Add runtime plugin
		addPlugin({
			src: resolver.resolve('./runtime/plugins/palette-client.ts'),
			mode: 'client'
		})

		// Add auto-imports
		addImports([
			{
				name: 'usePalette',
				from: resolver.resolve('./runtime/composables/usePalette')
			},
			{
				name: 'usePaletteProvider',
				from: resolver.resolve('./runtime/composables/usePaletteProvider')
			},
			{
				name: 'paletteRegistry',
				from: resolver.resolve('./core/registry')
			}
		])

		// Add components
		addComponentsDir({
			path: resolver.resolve('./runtime/components'),
			prefix: 'Palette'
		})

			// Expose config to runtime
			// biome-ignore lint/suspicious/noAssignInExpressions: required for Nuxt
			; (nuxt.options.runtimeConfig.public as Record<string, unknown>)['palette'] = options
	}
})

export type { SearchOptions, PalettePlugin }
