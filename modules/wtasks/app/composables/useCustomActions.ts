import { readonly, ref } from "vue"

export interface CustomAction {
	id: string
	name: string
	icon: string
	shortcut: string
	action: () => void | Promise<void>
}

export function useCustomActions() {
	const actions = ref<CustomAction[]>([])
	const isEditing = ref(false)

	function registerAction(action: Omit<CustomAction, "id">): string {
		const id = crypto.randomUUID()
		actions.value.push({ ...action, id })
		return id
	}

	function unregisterAction(id: string): void {
		actions.value = actions.value.filter(a => a.id !== id)
	}

	function updateAction(id: string, updates: Partial<CustomAction>): void {
		const index = actions.value.findIndex(a => a.id === id)
		if (index !== -1) {
			actions.value[index] = { ...actions.value[index], ...updates }
		}
	}

	function executeAction(id: string): void {
		const action = actions.value.find(a => a.id === id)
		if (action) {
			action.action()
		}
	}

	function getActionByShortcut(shortcut: string): CustomAction | undefined {
		return actions.value.find(a => a.shortcut === shortcut)
	}

	function handleSlashCommand(input: string): CustomAction | null {
		const command = input.startsWith("/") ? input.slice(1) : input
		return actions.value.find(a =>
			a.name.toLowerCase().replace(/\s+/g, "") === command.toLowerCase().replace(/\s+/g, ""),
		) || null
	}

	// Preset actions
	function createPresetActions(): CustomAction[] {
		return [
			{
				id: "preset-new-task",
				name: "New Task",
				icon: "i-lucide-plus",
				shortcut: "/task",
				action: () => { /* open new task modal */ },
			},
			{
				id: "preset-search",
				name: "Search",
				icon: "i-lucide-search",
				shortcut: "/search",
				action: () => { /* open search */ },
			},
			{
				id: "preset-filter",
				name: "Filter",
				icon: "i-lucide-filter",
				shortcut: "/filter",
				action: () => { /* open filter panel */ },
			},
		]
	}

	return {
		actions: readonly(actions),
		isEditing: readonly(isEditing),
		registerAction,
		unregisterAction,
		updateAction,
		executeAction,
		getActionByShortcut,
		handleSlashCommand,
		createPresetActions,
	}
}
