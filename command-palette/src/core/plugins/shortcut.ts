import type { PalettePlugin, PaletteInstance } from '../types'

export interface ShortcutPluginOptions {
	preventDefault?: boolean
}

export const shortcutPlugin: PalettePlugin<ShortcutPluginOptions> = {
	name: 'shortcut',

	install(instance: PaletteInstance, options: ShortcutPluginOptions = {}) {
		const preventDefault = options.preventDefault ?? true

		const shortcutMap = new Map<string, string>() // shortcut -> commandId

		const registerShortcut = (shortcut: string, commandId: string): void => {
			shortcutMap.set(shortcut, commandId)
		}

		const unregisterShortcut = (shortcut: string): void => {
			shortcutMap.delete(shortcut)
		}

		const parseShortcut = (event: KeyboardEvent): string => {
			const parts: string[] = []
			if (event.metaKey) parts.push('meta')
			if (event.ctrlKey) parts.push('ctrl')
			if (event.altKey) parts.push('alt')
			if (event.shiftKey) parts.push('shift')
			parts.push(event.key.toLowerCase())
			return parts.join('_')
		}

		const handleKeydown = (event: KeyboardEvent): void => {
			const shortcut = parseShortcut(event)
			const commandId = shortcutMap.get(shortcut)

			if (commandId) {
				if (preventDefault) {
					event.preventDefault()
				}
				instance.execute(commandId).catch(console.error)
			}
		}

		// Add keyboard listener
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown)
		}

		// Extend instance
		;(instance as unknown as Record<string, unknown>)['registerShortcut'] = registerShortcut
		;(instance as unknown as Record<string, unknown>)['unregisterShortcut'] = unregisterShortcut

		// Auto-register shortcuts from commands
		instance.on('register', (command) => {
			if (command.shortcut) {
				registerShortcut(command.shortcut, command.id)
			}
		})

		instance.on('unregister', (id: string) => {
			for (const [shortcut, commandId] of shortcutMap) {
				if (commandId === id) {
					shortcutMap.delete(shortcut)
				}
			}
		})
	},

	uninstall(_instance: PaletteInstance) {
		// Cleanup is handled automatically
	}
}
