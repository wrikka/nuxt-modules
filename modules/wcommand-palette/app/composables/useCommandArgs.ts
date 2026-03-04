import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Command, CommandArgument } from '../types'

export interface UseCommandArgsReturn {
	/** Currently active command with args */
	activeCommand: Ref<Command | null>
	/** Current argument values */
	argValues: Ref<Record<string, unknown>>
	/** Current argument being edited */
	currentArg: Ref<number>
	/** Whether currently collecting args */
	isCollectingArgs: Ref<boolean>
	/** Start collecting args for command */
	startArgs: (command: Command) => void
	/** Set argument value */
	setArgValue: (name: string, value: unknown) => void
	/** Go to next argument */
	nextArg: () => boolean
	/** Go to previous argument */
	prevArg: () => void
	/** Complete arg collection and execute */
	complete: () => Record<string, unknown> | null
	/** Cancel arg collection */
	cancel: () => void
	/** Get argument display string */
	getArgString: () => string
}

export function useCommandArgs(): UseCommandArgsReturn {
	const activeCommand = ref<Command | null>(null)
	const argValues = ref<Record<string, unknown>>({})
	const currentArg = ref(0)
	const isCollectingArgs = ref(false)

	const startArgs = (command: Command) => {
		if (!command.args || command.args.length === 0) {
			isCollectingArgs.value = false
			return
		}

		activeCommand.value = command
		argValues.value = {}
		currentArg.value = 0
		isCollectingArgs.value = true

		// Set defaults
		for (const arg of command.args) {
			if (arg.default !== undefined) {
				argValues.value[arg.name] = arg.default
			}
		}
	}

	const setArgValue = (name: string, value: unknown) => {
		argValues.value[name] = value
	}

	const nextArg = (): boolean => {
		if (!activeCommand.value?.args) return true

		const args = activeCommand.value.args
		if (currentArg.value < args.length - 1) {
			currentArg.value++
			return false
		}
		return true
	}

	const prevArg = () => {
		if (currentArg.value > 0) {
			currentArg.value--
		}
	}

	const complete = (): Record<string, unknown> | null => {
		if (!activeCommand.value?.args) return null

		// Check required args
		for (const arg of activeCommand.value.args) {
			if (arg.required && !(arg.name in argValues.value)) {
				return null
			}
		}

		isCollectingArgs.value = false
		return { ...argValues.value }
	}

	const cancel = () => {
		isCollectingArgs.value = false
		activeCommand.value = null
		argValues.value = {}
		currentArg.value = 0
	}

	const getArgString = (): string => {
		const parts: string[] = []
		for (const [key, value] of Object.entries(argValues.value)) {
			if (value !== undefined && value !== '') {
				parts.push(`${key}:${value}`)
			}
		}
		return parts.join(' ')
	}

	return {
		activeCommand,
		argValues,
		currentArg,
		isCollectingArgs,
		startArgs,
		setArgValue,
		nextArg,
		prevArg,
		complete,
		cancel,
		getArgString,
	}
}
