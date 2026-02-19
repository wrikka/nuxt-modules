import type { Command } from '../../types'
import { inject, provide, readonly, ref, type InjectionKey, type Ref, type DeepReadonly } from 'vue'
import type { PaletteInstance, PalettePlugin } from '../../core/types'
import { paletteRegistry, type RegistryOptions } from '../../core/registry'
import { PluginManager } from '../../core/plugins/manager'

export interface PaletteProviderOptions extends RegistryOptions {
	plugins?: PalettePlugin[]
	pluginOptions?: Record<string, unknown>
}

export interface PaletteContext {
	instance: PaletteInstance
	plugins: PluginManager
	isOpen: DeepReadonly<Ref<boolean>>
	query: DeepReadonly<Ref<string>>
	selectedIndex: DeepReadonly<Ref<number>>
	commands: DeepReadonly<Ref<Command[]>>
	recent: DeepReadonly<Ref<unknown[]>>
	pinned: DeepReadonly<Ref<unknown[]>>
}

export const PALETTE_INJECTION_KEY: InjectionKey<PaletteContext> = Symbol('palette')

export function providePalette(
	id: string,
	options: PaletteProviderOptions = {}
): PaletteContext {
	// Create or get instance
	let instance: PaletteInstance
	if (paletteRegistry.has(id)) {
		instance = paletteRegistry.get(id)!
	} else {
		instance = paletteRegistry.create(id, options)
	}

	// Setup plugins
	const plugins = new PluginManager(instance)
	if (options.plugins) {
		for (const plugin of options.plugins) {
			const pluginOptions = options.pluginOptions?.[plugin.name]
			plugins.install(plugin, pluginOptions)
		}
	}

	// Create reactive refs
	const isOpen = ref(instance.state.isOpen)
	const query = ref(instance.state.query)
	const selectedIndex = ref(instance.state.selectedIndex)
	const commands = ref<Command[]>(instance.state.commands)
	const recent = ref(instance.state.recent)
	const pinned = ref(instance.state.pinned)

	// Sync state
	instance.on('open', () => { isOpen.value = true })
	instance.on('close', () => { isOpen.value = false })
	instance.on('search', (newQuery: string, results: Command[]) => {
		query.value = newQuery
		commands.value = results
	})

	const context: PaletteContext = {
		instance,
		plugins,
		isOpen: readonly(isOpen),
		query: readonly(query),
		selectedIndex: readonly(selectedIndex),
		commands: readonly(commands),
		recent: readonly(recent),
		pinned: readonly(pinned)
	}

	provide(PALETTE_INJECTION_KEY, context)
	return context
}

export function usePaletteContext(): PaletteContext | undefined {
	return inject(PALETTE_INJECTION_KEY)
}
