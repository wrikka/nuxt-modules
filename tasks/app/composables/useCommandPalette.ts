import { computed, onMounted, onUnmounted, readonly, ref } from "vue"

export interface CommandItem {
	id: string
	label: string
	description?: string
	icon?: string
	shortcut?: string
	section: string
	action: () => void | Promise<void>
}

export function useCommandPalette() {
	const isOpen = ref(false)
	const searchQuery = ref("")
	const selectedIndex = ref(0)
	const commands = ref<CommandItem[]>([])

	function registerCommand(command: CommandItem) {
		commands.value.push(command)
	}

	function unregisterCommand(id: string) {
		commands.value = commands.value.filter(c => c.id !== id)
	}

	const filteredCommands = computed(() => {
		if (!searchQuery.value) return commands.value

		const query = searchQuery.value.toLowerCase()
		return commands.value.filter(cmd =>
			cmd.label.toLowerCase().includes(query) ||
			cmd.description?.toLowerCase().includes(query) ||
			cmd.section.toLowerCase().includes(query),
		)
	})

	const groupedCommands = computed(() => {
		const groups = new Map<string, CommandItem[]>()
		for (const cmd of filteredCommands.value) {
			if (!groups.has(cmd.section)) {
				groups.set(cmd.section, [])
			}
			groups.get(cmd.section)!.push(cmd)
		}
		return Array.from(groups.entries())
	})

	function open() {
		isOpen.value = true
		searchQuery.value = ""
		selectedIndex.value = 0
	}

	function close() {
		isOpen.value = false
	}

	function selectNext() {
		const total = filteredCommands.value.length
		selectedIndex.value = (selectedIndex.value + 1) % total
	}

	function selectPrev() {
		const total = filteredCommands.value.length
		selectedIndex.value = (selectedIndex.value - 1 + total) % total
	}

	async function executeSelected() {
		const cmd = filteredCommands.value[selectedIndex.value]
		if (cmd) {
			close()
			await cmd.action()
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault()
			open()
			return
		}

		if (!isOpen.value) return

		switch (e.key) {
			case "Escape":
				close()
				break
			case "ArrowDown":
				e.preventDefault()
				selectNext()
				break
			case "ArrowUp":
				e.preventDefault()
				selectPrev()
				break
			case "Enter":
				e.preventDefault()
				executeSelected()
				break
		}
	}

	onMounted(() => {
		document.addEventListener("keydown", handleKeydown)
	})

	onUnmounted(() => {
		document.removeEventListener("keydown", handleKeydown)
	})

	return {
		isOpen: readonly(isOpen),
		searchQuery,
		selectedIndex: readonly(selectedIndex),
		groupedCommands,
		open,
		close,
		selectNext,
		selectPrev,
		executeSelected,
		registerCommand,
		unregisterCommand,
	}
}
