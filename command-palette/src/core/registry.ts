import type { PaletteInstance } from './types'
import { createCommandStore } from './store'
import { createSearchEngine } from './search'
import { createPaletteInstance } from './instance'
import type { SearchOptions } from './search'

export interface RegistryOptions {
	search?: SearchOptions
}

export interface PaletteRegistry {
	create: (id: string, options?: RegistryOptions) => PaletteInstance
	get: (id: string) => PaletteInstance | undefined
	has: (id: string) => boolean
	remove: (id: string) => void
	getAll: () => PaletteInstance[]
	clear: () => void
}

const instances = new Map<string, PaletteInstance>()

export const paletteRegistry: PaletteRegistry = {
	create: (id: string, options: RegistryOptions = {}): PaletteInstance => {
		if (instances.has(id)) {
			throw new Error(`Palette instance with id "${id}" already exists`)
		}

		const store = createCommandStore()
		const search = createSearchEngine(options.search)
		const instance = createPaletteInstance(id, store, search)

		instances.set(id, instance)
		return instance
	},

	get: (id: string): PaletteInstance | undefined => {
		return instances.get(id)
	},

	has: (id: string): boolean => {
		return instances.has(id)
	},

	remove: (id: string): void => {
		const instance = instances.get(id)
		if (instance) {
			instances.delete(id)
		}
	},

	getAll: (): PaletteInstance[] => {
		return Array.from(instances.values())
	},

	clear: (): void => {
		instances.clear()
	}
}
