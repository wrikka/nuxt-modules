import { readonly, ref } from "vue"

export function useKeyboardNavigationV2() {
	const isVimMode = ref(false)
	const currentRow = ref(0)
	const currentCol = ref(0)
	const mode = ref<"normal" | "insert" | "visual">("normal")

	const tasks = ref<Array<{ id: string, title: string }>>([])

	function enableVimMode(): void {
		isVimMode.value = true
		document.addEventListener("keydown", handleVimKeydown)
	}

	function disableVimMode(): void {
		isVimMode.value = false
		document.removeEventListener("keydown", handleVimKeydown)
	}

	function handleVimKeydown(e: KeyboardEvent): void {
		if (!isVimMode.value || mode.value === "insert") {
			if (e.key === "Escape") {
				mode.value = "normal"
				e.preventDefault()
			}
			return
		}

		switch (e.key) {
			case "j":
			case "ArrowDown":
				e.preventDefault()
				moveDown()
				break
			case "k":
			case "ArrowUp":
				e.preventDefault()
				moveUp()
				break
			case "h":
			case "ArrowLeft":
				e.preventDefault()
				moveLeft()
				break
			case "l":
			case "ArrowRight":
				e.preventDefault()
				moveRight()
				break
			case "g":
				if (e.shiftKey) {
					e.preventDefault()
					goToBottom()
				}
				else {
					e.preventDefault()
					goToTop()
				}
				break
			case "d":
				if (e.shiftKey) {
					e.preventDefault()
					deleteCurrent()
				}
				break
			case "i":
				e.preventDefault()
				enterInsertMode()
				break
			case "v":
				e.preventDefault()
				toggleVisualMode()
				break
			case "Enter":
				e.preventDefault()
				selectCurrent()
				break
			case "/":
				e.preventDefault()
				startSearch()
				break
			case "n":
				e.preventDefault()
				nextSearchResult()
				break
			case "Escape":
				e.preventDefault()
				mode.value = "normal"
				break
		}
	}

	function moveDown(): void {
		currentRow.value = Math.min(currentRow.value + 1, tasks.value.length - 1)
	}

	function moveUp(): void {
		currentRow.value = Math.max(currentRow.value - 1, 0)
	}

	function moveLeft(): void {
		currentCol.value = Math.max(currentCol.value - 1, 0)
	}

	function moveRight(): void {
		currentCol.value++
	}

	function goToTop(): void {
		currentRow.value = 0
	}

	function goToBottom(): void {
		currentRow.value = tasks.value.length - 1
	}

	function deleteCurrent(): void {
		const task = tasks.value[currentRow.value]
		if (task) {
			// Emit delete event
		}
	}

	function enterInsertMode(): void {
		mode.value = "insert"
	}

	function toggleVisualMode(): void {
		mode.value = mode.value === "visual" ? "normal" : "visual"
	}

	function selectCurrent(): void {
		const task = tasks.value[currentRow.value]
		if (task) {
			// Emit select event
		}
	}

	function startSearch(): void {
		// Open search interface
	}

	function nextSearchResult(): void {
		// Navigate to next search result
	}

	function setTasks(newTasks: Array<{ id: string, title: string }>): void {
		tasks.value = newTasks
	}

	return {
		isVimMode: readonly(isVimMode),
		mode: readonly(mode),
		currentRow: readonly(currentRow),
		currentCol: readonly(currentCol),
		enableVimMode,
		disableVimMode,
		setTasks,
		moveDown,
		moveUp,
		selectCurrent,
	}
}
