import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { CommandChain, Command, ChainConfig } from '../types'
import { usePalette } from './usePalette'

export interface UseCommandChainsReturn {
	/** Current active chain */
	activeChain: Ref<CommandChain | undefined>
	/** Chain execution history */
	chainHistory: Ref<string[]>
	/** Whether currently in chain mode */
	isChaining: Ref<boolean>
	/** Start a new command chain */
	startChain: (commands: string[]) => CommandChain
	/** Add command to current chain */
	addToChain: (commandId: string) => void
	/** Remove command from chain */
	removeFromChain: (commandId: string) => void
	/** Stop current chain */
	stopChain: () => void
	/** Execute current chain */
	executeChain: () => Promise<void>
	/** Execute command as part of chain */
	executeChained: (command: Command) => Promise<void>
	/** Check if command can chain */
	canChain: (commandId: string) => boolean
	/** Get chain suggestions for current state */
	getChainSuggestions: () => Command[]
}

export function useCommandChains(paletteId?: string): UseCommandChainsReturn {
	const palette = usePalette({ id: paletteId ?? 'default' })
	const activeChain = ref<CommandChain | undefined>()
	const chainHistory = ref<string[]>([])
	const isChaining = computed(() => activeChain.value !== undefined)

	const startChain = (commandIds: string[]): CommandChain => {
		const chain: CommandChain = {
			id: `chain-${Date.now()}`,
			commands: commandIds,
		}
		activeChain.value = chain
		chainHistory.value = []
		return chain
	}

	const addToChain = (commandId: string) => {
		if (activeChain.value) {
			activeChain.value.commands.push(commandId)
		}
	}

	const removeFromChain = (commandId: string) => {
		if (activeChain.value) {
			const idx = activeChain.value.commands.indexOf(commandId)
			if (idx > -1) {
				activeChain.value.commands.splice(idx, 1)
			}
		}
	}

	const stopChain = () => {
		activeChain.value = undefined
		chainHistory.value = []
	}

	const executeChain = async (): Promise<void> => {
		if (!activeChain.value || activeChain.value.commands.length === 0) return

		for (const commandId of activeChain.value.commands) {
			await palette.execute(commandId)
			chainHistory.value.push(commandId)

			// Check chain config for delay
			const command = palette.results.value.find(c => c.id === commandId)
			if (command?.chainConfig?.delay) {
				await sleep(command.chainConfig.delay)
			}
		}

		stopChain()
	}

	const executeChained = async (command: Command): Promise<void> => {
		await palette.execute(command.id)
		chainHistory.value.push(command.id)

		// Check if we should keep palette open
		const shouldKeepOpen = command.chainConfig?.keepOpen ?? false
		const canContinue = command.chainable ?? false

		if (!shouldKeepOpen && !canContinue) {
			stopChain()
			palette.close()
		}
	}

	const canChain = (commandId: string): boolean => {
		const command = palette.results.value.find(c => c.id === commandId)
		return command?.chainable ?? false
	}

	const getChainSuggestions = (): Command[] => {
		if (chainHistory.value.length === 0) return palette.results.value

		const lastCommandId = chainHistory.value[chainHistory.value.length - 1]
		const lastCommand = palette.results.value.find(c => c.id === lastCommandId)

		if (!lastCommand?.chainConfig?.nextCommands) {
			return palette.results.value.filter(c => c.chainable)
		}

		return palette.results.value.filter(c =>
			lastCommand.chainConfig?.nextCommands?.includes(c.id)
		)
	}

	const sleep = (ms: number): Promise<void> =>
		new Promise(resolve => setTimeout(resolve, ms))

	return {
		activeChain,
		chainHistory,
		isChaining,
		startChain,
		addToChain,
		removeFromChain,
		stopChain,
		executeChain,
		executeChained,
		canChain,
		getChainSuggestions,
	}
}
