import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { CommandMacro, MacroStep } from '../types'

const macros = ref<CommandMacro[]>([])
const macroStorageKey = 'palette-macros'

export interface UseCommandMacrosReturn {
	/** All saved macros */
	macros: Ref<CommandMacro[]>
	/** Create a new macro */
	createMacro: (name: string, steps: MacroStep[], shortcut?: string) => CommandMacro
	/** Delete a macro */
	deleteMacro: (macroId: string) => void
	/** Execute a macro */
	executeMacro: (macroId: string) => Promise<void>
	/** Get macro by ID */
	getMacro: (macroId: string) => CommandMacro | undefined
	/** Update macro shortcut */
	updateMacroShortcut: (macroId: string, shortcut: string) => void
	/** Export macros to JSON */
	exportMacros: () => string
	/** Import macros from JSON */
	importMacros: (json: string) => void
}

export function useCommandMacros(): UseCommandMacrosReturn {
	// Load from localStorage on init
	const loadMacros = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(macroStorageKey)
			if (stored) {
				try {
					macros.value = JSON.parse(stored)
				} catch {
					macros.value = []
				}
			}
		}
	}

	const saveMacros = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(macroStorageKey, JSON.stringify(macros.value))
		}
	}

	const createMacro = (name: string, steps: MacroStep[], shortcut?: string): CommandMacro => {
		const macro: CommandMacro = {
			id: `macro-${Date.now()}`,
			name,
			steps,
			shortcut,
			createdAt: Date.now(),
		}
		macros.value.push(macro)
		saveMacros()
		return macro
	}

	const deleteMacro = (macroId: string) => {
		const idx = macros.value.findIndex(m => m.id === macroId)
		if (idx > -1) {
			macros.value.splice(idx, 1)
			saveMacros()
		}
	}

	const executeMacro = async (macroId: string): Promise<void> => {
		const macro = macros.value.find(m => m.id === macroId)
		if (!macro) return

		for (const step of macro.steps) {
			// Emit event for execution - handled by usePalette
			const event = new CustomEvent('palette-execute-step', {
				detail: step,
			})
			document.dispatchEvent(event)

			if (step.delay) {
				await sleep(step.delay)
			}
		}
	}

	const getMacro = (macroId: string): CommandMacro | undefined => {
		return macros.value.find(m => m.id === macroId)
	}

	const updateMacroShortcut = (macroId: string, shortcut: string) => {
		const macro = macros.value.find(m => m.id === macroId)
		if (macro) {
			macro.shortcut = shortcut
			saveMacros()
		}
	}

	const exportMacros = (): string => {
		return JSON.stringify(macros.value, null, 2)
	}

	const importMacros = (json: string) => {
		try {
			const imported = JSON.parse(json) as CommandMacro[]
			macros.value = imported
			saveMacros()
		} catch (e) {
			console.error('Failed to import macros:', e)
		}
	}

	const sleep = (ms: number): Promise<void> =>
		new Promise(resolve => setTimeout(resolve, ms))

	// Load on init
	loadMacros()

	return {
		macros: computed(() => macros.value),
		createMacro,
		deleteMacro,
		executeMacro,
		getMacro,
		updateMacroShortcut,
		exportMacros,
		importMacros,
	}
}
