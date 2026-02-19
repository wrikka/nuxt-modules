/**
 * Composable for Keyboard Macros
 */
export const useKeyboardMacros = () => {
	const { $toast } = useNuxtApp()

	const macros = useState<{ id: string; name: string; keys: string[]; action: string }[]>("keyboard-macros", () => [])
	const isRecording = useState<boolean>("macro-recording", () => false)
	const recordedKeys = useState<string[]>("recorded-keys", () => [])

	/**
	 * Start recording macro
	 */
	const startRecording = () => {
		isRecording.value = true
		recordedKeys.value = []
		$toast.info("Recording macro... Press keys to record")

		// Listen for key events
		document.addEventListener("keydown", handleKeyDown)
	}

	/**
	 * Stop recording
	 */
	const stopRecording = (name: string, action: string) => {
		isRecording.value = false
		document.removeEventListener("keydown", handleKeyDown)

		if (recordedKeys.value.length === 0) {
			$toast.error("No keys recorded")
			return null
		}

		const macro = {
			id: crypto.randomUUID(),
			name,
			keys: [...recordedKeys.value],
			action,
		}

		macros.value.push(macro)
		recordedKeys.value = []
		$toast.success(`Macro "${name}" saved`)
		return macro
	}

	/**
	 * Cancel recording
	 */
	const cancelRecording = () => {
		isRecording.value = false
		recordedKeys.value = []
		document.removeEventListener("keydown", handleKeyDown)
	}

	/**
	 * Handle key down during recording
	 */
	const handleKeyDown = (e: KeyboardEvent) => {
		if (!isRecording.value) return

		const keyCombo = [
			e.ctrlKey ? "Ctrl" : "",
			e.altKey ? "Alt" : "",
			e.shiftKey ? "Shift" : "",
			e.metaKey ? "Meta" : "",
			e.key,
		].filter(Boolean).join("+")

		if (!recordedKeys.value.includes(keyCombo)) {
			recordedKeys.value.push(keyCombo)
		}
	}

	/**
	 * Delete macro
	 */
	const deleteMacro = (macroId: string) => {
		macros.value = macros.value.filter(m => m.id !== macroId)
		$toast.success("Macro deleted")
	}

	/**
	 * Execute macro
	 */
	const executeMacro = (macroId: string) => {
		const macro = macros.value.find(m => m.id === macroId)
		if (!macro) return

		// Execute the associated action
		switch (macro.action) {
			case "create-task":
				$toast.info("Macro: Create new task")
				break
			case "toggle-view":
				$toast.info("Macro: Toggle view")
				break
			case "search":
				$toast.info("Macro: Open search")
				break
			default:
				$toast.info(`Macro executed: ${macro.name}`)
			}
	}

	/**
	 * Format key combo for display
	 */
	const formatKeyCombo = (keys: string[]): string => {
		return keys.join(" → ")
	}

	/**
	 * Get predefined shortcuts
	 */
	const getPredefinedShortcuts = () => {
		return [
			{ keys: ["Ctrl+N"], action: "create-task", description: "New task" },
			{ keys: ["Ctrl+K"], action: "search", description: "Search" },
			{ keys: ["Ctrl+1"], action: "view-kanban", description: "Kanban view" },
			{ keys: ["Ctrl+2"], action: "view-list", description: "List view" },
			{ keys: ["Ctrl+3"], action: "view-calendar", description: "Calendar view" },
			{ keys: ["Ctrl+/"], action: "help", description: "Keyboard shortcuts" },
		]
	}

	return {
		macros: readonly(macros),
		isRecording,
		recordedKeys,
		startRecording,
		stopRecording,
		cancelRecording,
		deleteMacro,
		executeMacro,
		formatKeyCombo,
		getPredefinedShortcuts,
	}
}
