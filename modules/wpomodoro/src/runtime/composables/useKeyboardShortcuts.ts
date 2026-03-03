import { onMounted, onUnmounted, readonly, ref } from "vue"
import type { KeyboardShortcut } from "#pomodoro/types"

const isFocusMode = ref(false)
const blockedNotifications = ref<string[]>([])
const originalTitle = ref("")

const shortcuts: KeyboardShortcut[] = [
	{ key: "Space", action: "start-pause", description: "เริ่ม/หยุด timer" },
	{ key: "R", action: "reset", description: "รีเซ็ต timer" },
	{ key: "S", action: "skip", description: "ข้าม phase ปัจจุบัน" },
	{ key: "F", action: "focus", description: "เปิด/ปิด focus mode" },
	{ key: "M", action: "mini", description: "เปิด/ปิด mini timer" },
	{ key: "?", action: "help", description: "แสดง help shortcuts" },
]

export function useKeyboardShortcuts(
	onStartPause: () => void,
	onReset: () => void,
	onSkip: () => void,
	onFocusToggle: () => void,
	onMiniToggle: () => void,
	onHelp: () => void,
) {
	const showHelp = ref(false)

	function handleKeydown(event: KeyboardEvent) {
		if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
			return
		}

		switch (event.key) {
			case " ":
				event.preventDefault()
				onStartPause()
				break
			case "r":
			case "R":
				onReset()
				break
			case "s":
			case "S":
				onSkip()
				break
			case "f":
			case "F":
				onFocusToggle()
				break
			case "m":
			case "M":
				onMiniToggle()
				break
			case "?":
				showHelp.value = !showHelp.value
				if (showHelp.value) {
					onHelp()
				}
				break
		}
	}

	onMounted(() => {
		window.addEventListener("keydown", handleKeydown)
	})

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeydown)
	})

	return {
		shortcuts: readonly(shortcuts),
		showHelp: readonly(showHelp),
		handleKeydown,
	}
}

export function useFocusMode() {
	function enableFocusMode() {
		isFocusMode.value = true

		if (typeof document !== "undefined") {
			originalTitle.value = document.title
			document.title = "🍅 Focus Mode - Pomodoro"
			document.body.classList.add("pomodoro-focus-mode")
		}
	}

	function disableFocusMode() {
		isFocusMode.value = false

		if (typeof document !== "undefined") {
			document.title = originalTitle.value
			document.body.classList.remove("pomodoro-focus-mode")
		}
	}

	function toggleFocusMode() {
		if (isFocusMode.value) {
			disableFocusMode()
		} else {
			enableFocusMode()
		}
	}

	return {
		isFocusMode: readonly(isFocusMode),
		enableFocusMode,
		disableFocusMode,
		toggleFocusMode,
	}
}
