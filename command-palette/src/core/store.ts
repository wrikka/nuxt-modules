import type { Command, CommandRegistration } from '../types'

export interface CommandStore {
	commands: Map<string, Command>
	register: (command: CommandRegistration) => string
	unregister: (id: string) => void
	get: (id: string) => Command | undefined
	getAll: () => Command[]
}

export function createCommandStore(): CommandStore {
	const commands = new Map<string, Command>()

	const generateId = (): string => `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

	const register = (command: CommandRegistration): string => {
		const id = command.id ?? generateId()
		const cmd: Command = { ...command, id }
		commands.set(id, cmd)
		return id
	}

	const unregister = (id: string): void => {
		commands.delete(id)
	}

	const get = (id: string): Command | undefined => {
		return commands.get(id)
	}

	const getAll = (): Command[] => {
		return Array.from(commands.values())
	}

	return {
		commands,
		register,
		unregister,
		get,
		getAll
	}
}
