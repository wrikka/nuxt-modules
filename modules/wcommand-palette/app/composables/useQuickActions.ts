import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Command } from '../types'

export interface UseQuickActionsReturn {
	/** Pin a command */
	pinCommand: (command: Command) => void
	/** Unpin a command */
	unpinCommand: (command: Command) => void
	/** Check if command is pinned */
	isPinned: (command: Command) => boolean
	/** Copy command link/ID */
	copyCommandLink: (command: Command) => Promise<void>
	/** Share command */
	shareCommand: (command: Command) => void
	/** Edit command (if custom) */
	editCommand: (command: Command) => void
	/** Duplicate command */
	duplicateCommand: (command: Command) => Command
	/** Delete custom command */
	deleteCommand: (command: Command) => void
	/** Export command as JSON */
	exportCommand: (command: Command) => string
}

const STORAGE_KEY = 'palette-pinned'
const pinnedIds = ref<Set<string>>(new Set())

export function useQuickActions(): UseQuickActionsReturn {
	// Load pinned commands
	const loadPinned = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				try {
					const ids = JSON.parse(stored) as string[]
					pinnedIds.value = new Set(ids)
				} catch {
					pinnedIds.value = new Set()
				}
			}
		}
	}

	const savePinned = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify([...pinnedIds.value]))
		}
	}

	const pinCommand = (command: Command) => {
		pinnedIds.value.add(command.id)
		savePinned()
	}

	const unpinCommand = (command: Command) => {
		pinnedIds.value.delete(command.id)
		savePinned()
	}

	const isPinned = (command: Command): boolean => {
		return pinnedIds.value.has(command.id)
	}

	const copyCommandLink = async (command: Command): Promise<void> => {
		const link = `palette://command/${command.id}`
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			await navigator.clipboard.writeText(link)
		}
	}

	const shareCommand = (command: Command) => {
		if (typeof navigator !== 'undefined' && navigator.share) {
			navigator.share({
				title: command.title,
				text: command.description || '',
				url: `palette://command/${command.id}`,
			})
		} else {
			copyCommandLink(command)
		}
	}

	const editCommand = (command: Command) => {
		// Emit event for command editing
		const event = new CustomEvent('palette-edit-command', { detail: command })
		document.dispatchEvent(event)
	}

	const duplicateCommand = (command: Command): Command => {
		return {
			...command,
			id: `${command.id}-copy-${Date.now()}`,
			name: `${command.name} (Copy)`,
			title: `${command.title} (Copy)`,
		}
	}

	const deleteCommand = (command: Command) => {
		// Emit event for command deletion
		const event = new CustomEvent('palette-delete-command', { detail: command.id })
		document.dispatchEvent(event)
	}

	const exportCommand = (command: Command): string => {
		return JSON.stringify(command, null, 2)
	}

	// Load on init
	loadPinned()

	return {
		pinCommand,
		unpinCommand,
		isPinned,
		copyCommandLink,
		shareCommand,
		editCommand,
		duplicateCommand,
		deleteCommand,
		exportCommand,
	}
}
