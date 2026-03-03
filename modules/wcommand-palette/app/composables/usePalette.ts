import { readonly, ref, watch, type DeepReadonly, type Ref } from 'vue'
import type { PaletteInstance } from '../../core/types'
import type { Command, CommandRegistration } from '../../types'
import { paletteRegistry } from '../../core/registry'
import { usePaletteContext } from './usePaletteProvider'

export interface UsePaletteOptions {
	id?: string
	autoCreate?: boolean
}

export interface UsePaletteReturn {
	instance: PaletteInstance
	isOpen: DeepReadonly<Ref<boolean>>
	query: Ref<string>
	selectedIndex: Ref<number>
	results: DeepReadonly<Ref<Command[]>>
	recent: DeepReadonly<Ref<{ id: string; timestamp: number; count: number }[]>>
	pinned: DeepReadonly<Ref<{ id: string; order: number }[]>>
	open: () => void
	close: () => void
	toggle: () => void
	selectNext: () => void
	selectPrev: () => void
	selectIndex: (index: number) => void
	execute: (id: string) => Promise<void>
	register: (command: Omit<Command, 'id'> & { id?: string }) => string
	unregister: (id: string) => void
	search: (query: string) => Command[]
}

export function usePalette(options: UsePaletteOptions = {}): UsePaletteReturn {
	const context = usePaletteContext()

	// Get or create instance
	let instance: PaletteInstance
	if (context && !options.id) {
		instance = context.instance
	} else {
		const id = options.id ?? 'default'
		if (paletteRegistry.has(id)) {
			instance = paletteRegistry.get(id)!
		} else if (options.autoCreate !== false) {
			instance = paletteRegistry.create(id)
		} else {
			throw new Error(`Palette instance "${id}" not found. Set autoCreate to true or create it manually.`)
		}
	}

	// Local reactive state
	const isOpen = ref(instance.state.isOpen)
	const query = ref(instance.state.query)
	const selectedIndex = ref(instance.state.selectedIndex)
	const results = ref<Command[]>(instance.state.commands)
	const recent = ref(instance.state.recent)
	const pinned = ref(instance.state.pinned)

	// Sync with instance state
	instance.on('open', () => { isOpen.value = true })
	instance.on('close', () => { isOpen.value = false })
	instance.on('search', (q: string, cmds: Command[]) => {
		query.value = q
		results.value = cmds
	})

	// Watch for query changes and trigger search
	watch(query, (newQuery) => {
		instance.state.query = newQuery
		results.value = instance.searchCommands(newQuery)
	}, { immediate: true })

	// Actions
	const open = () => instance.open()
	const close = () => instance.close()
	const toggle = () => instance.toggle()

	const selectNext = () => {
		const len = results.value.length
		if (len > 0) {
			selectedIndex.value = (selectedIndex.value + 1) % len
			instance.state.selectedIndex = selectedIndex.value
		}
	}

	const selectPrev = () => {
		const len = results.value.length
		if (len > 0) {
			selectedIndex.value = (selectedIndex.value - 1 + len) % len
			instance.state.selectedIndex = selectedIndex.value
		}
	}

	const selectIndex = (index: number) => {
		selectedIndex.value = Math.max(0, Math.min(index, results.value.length - 1))
		instance.state.selectedIndex = selectedIndex.value
	}

	const execute = async (id: string) => {
		await instance.execute(id)
	}

	const register = (command: CommandRegistration): string => {
		return instance.store.register(command)
	}

	const unregister = (id: string) => {
		instance.store.unregister(id)
	}

	const search = (q: string): Command[] => {
		return instance.searchCommands(q)
	}

	return {
		instance,
		isOpen: readonly(isOpen),
		query,
		selectedIndex,
		results: readonly(results),
		recent: readonly(recent),
		pinned: readonly(pinned),
		open,
		close,
		toggle,
		selectNext,
		selectPrev,
		selectIndex,
		execute,
		register,
		unregister,
		search
	}
}
