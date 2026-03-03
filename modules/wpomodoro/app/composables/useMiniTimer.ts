import { computed, readonly, ref } from "vue"

const isMini = ref(false)
const miniPosition = ref({ x: 20, y: 20 })
const isDragging = ref(false)

export function useMiniTimer() {
	const miniStyle = computed(() => ({
		position: "fixed" as const,
		right: `${miniPosition.value.x}px`,
		bottom: `${miniPosition.value.y}px`,
		zIndex: 9999,
	}))

	function toggleMini() {
		isMini.value = !isMini.value
	}

	function enableMini() {
		isMini.value = true
	}

	function disableMini() {
		isMini.value = false
	}

	function startDrag(event: MouseEvent | TouchEvent) {
		isDragging.value = true
		const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
		const clientY = "touches" in event ? event.touches[0].clientY : event.clientY

		const startX = clientX - (window.innerWidth - miniPosition.value.x)
		const startY = clientY - (window.innerHeight - miniPosition.value.y)

		function onMove(e: MouseEvent | TouchEvent) {
			if (!isDragging.value) return
			const moveX = "touches" in e ? e.touches[0].clientX : e.clientX
			const moveY = "touches" in e ? e.touches[0].clientY : e.clientY

			miniPosition.value = {
				x: Math.max(0, Math.min(window.innerWidth - 150, window.innerWidth - moveX + startX)),
				y: Math.max(0, Math.min(window.innerHeight - 80, window.innerHeight - moveY + startY)),
			}
		}

		function onEnd() {
			isDragging.value = false
			document.removeEventListener("mousemove", onMove as EventListener)
			document.removeEventListener("mouseup", onEnd)
			document.removeEventListener("touchmove", onMove as EventListener)
			document.removeEventListener("touchend", onEnd)
		}

		document.addEventListener("mousemove", onMove as EventListener)
		document.addEventListener("mouseup", onEnd)
		document.addEventListener("touchmove", onMove as EventListener)
		document.addEventListener("touchend", onEnd)
	}

	return {
		isMini: readonly(isMini),
		miniPosition: readonly(miniPosition),
		isDragging: readonly(isDragging),
		miniStyle,
		toggleMini,
		enableMini,
		disableMini,
		startDrag,
	}
}
