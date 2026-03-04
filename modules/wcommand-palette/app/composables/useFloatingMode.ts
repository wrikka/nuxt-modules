import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export interface UseFloatingModeReturn {
	/** Whether palette is in floating mode */
	isFloating: Ref<boolean>
	/** Floating position */
	position: Ref<{ x: number; y: number }>
	/** Enable floating mode */
	enableFloating: () => void
	/** Disable floating mode */
	disableFloating: () => void
	/** Toggle floating mode */
	toggleFloating: () => void
	/** Start dragging */
	startDrag: (e: MouseEvent) => void
	/** Stop dragging */
	stopDrag: () => void
	/** Handle drag move */
	onDrag: (e: MouseEvent) => void
	/** Reset position to default */
	resetPosition: () => void
	/** Is currently dragging */
	isDragging: Ref<boolean>
}

const STORAGE_KEY = 'palette-floating-position'
const DEFAULT_POSITION = { x: 100, y: 100 }

export function useFloatingMode(): UseFloatingModeReturn {
	const isFloating = ref(false)
	const position = ref<{ x: number; y: number }>({ ...DEFAULT_POSITION })
	const isDragging = ref(false)
	let dragOffset = { x: 0, y: 0 }

	const loadPosition = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				try {
					position.value = JSON.parse(stored)
				} catch {
					position.value = { ...DEFAULT_POSITION }
				}
			}
		}
	}

	const savePosition = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(position.value))
		}
	}

	const enableFloating = () => {
		isFloating.value = true
		loadPosition()
	}

	const disableFloating = () => {
		isFloating.value = false
	}

	const toggleFloating = () => {
		if (isFloating.value) {
			disableFloating()
		} else {
			enableFloating()
		}
	}

	const startDrag = (e: MouseEvent) => {
		isDragging.value = true
		dragOffset = {
			x: e.clientX - position.value.x,
			y: e.clientY - position.value.y,
		}

		if (typeof document !== 'undefined') {
			document.addEventListener('mousemove', onDrag)
			document.addEventListener('mouseup', stopDrag)
		}
	}

	const stopDrag = () => {
		isDragging.value = false
		savePosition()

		if (typeof document !== 'undefined') {
			document.removeEventListener('mousemove', onDrag)
			document.removeEventListener('mouseup', stopDrag)
		}
	}

	const onDrag = (e: MouseEvent) => {
		if (!isDragging.value) return

		position.value = {
			x: e.clientX - dragOffset.x,
			y: e.clientY - dragOffset.y,
		}

		// Constrain to viewport
		if (typeof window !== 'undefined') {
			position.value.x = Math.max(0, Math.min(position.value.x, window.innerWidth - 400))
			position.value.y = Math.max(0, Math.min(position.value.y, window.innerHeight - 600))
		}
	}

	const resetPosition = () => {
		position.value = { ...DEFAULT_POSITION }
		savePosition()
	}

	return {
		isFloating,
		position,
		enableFloating,
		disableFloating,
		toggleFloating,
		startDrag,
		stopDrag,
		onDrag,
		resetPosition,
		isDragging,
	}
}
