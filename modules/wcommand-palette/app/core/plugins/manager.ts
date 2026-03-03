import type { PalettePlugin, PaletteInstance } from '../types'

export class PluginManager {
	private plugins = new Map<string, PalettePlugin>()
	private instance: PaletteInstance

	constructor(instance: PaletteInstance) {
		this.instance = instance
	}

	install(plugin: PalettePlugin, options?: unknown): void {
		if (this.plugins.has(plugin.name)) {
			console.warn(`Plugin "${plugin.name}" is already installed`)
			return
		}

		plugin.install(this.instance, options)
		this.plugins.set(plugin.name, plugin)
	}

	uninstall(name: string): void {
		const plugin = this.plugins.get(name)
		if (!plugin) {
			console.warn(`Plugin "${name}" is not installed`)
			return
		}

		plugin.uninstall?.(this.instance)
		this.plugins.delete(name)
	}

	get(name: string): PalettePlugin | undefined {
		return this.plugins.get(name)
	}

	has(name: string): boolean {
		return this.plugins.has(name)
	}

	getAll(): PalettePlugin[] {
		return Array.from(this.plugins.values())
	}

	clear(): void {
		for (const [, plugin] of this.plugins) {
			plugin.uninstall?.(this.instance)
		}
		this.plugins.clear()
	}
}
