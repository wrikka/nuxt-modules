import { readonly, ref } from "vue"

const audioContext = ref<AudioContext | null>(null)
const currentSound = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const sounds = {
	work: "/sounds/work-start.mp3",
	break: "/sounds/break-start.mp3",
	complete: "/sounds/complete.mp3",
	click: "/sounds/click.mp3",
	alarm: "/sounds/alarm.mp3",
}

export function useAudio() {
	function initAudio() {
		if (!audioContext.value && typeof window !== "undefined") {
			audioContext.value = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
		}
	}

	function playSound(soundName: keyof typeof sounds, volume = 0.5) {
		if (typeof window === "undefined") return

		initAudio()
		stopSound()

		const audio = new Audio(sounds[soundName])
		audio.volume = volume
		currentSound.value = audio
		isPlaying.value = true

		audio.play().catch(() => {
			isPlaying.value = false
		})

		audio.onended = () => {
			isPlaying.value = false
		}
	}

	function playBeep(volume = 0.5) {
		if (!audioContext.value || typeof window === "undefined") return

		const oscillator = audioContext.value.createOscillator()
		const gainNode = audioContext.value.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(audioContext.value.destination)

		oscillator.frequency.value = 800
		oscillator.type = "sine"

		gainNode.gain.setValueAtTime(volume, audioContext.value.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.value.currentTime + 0.5)

		oscillator.start(audioContext.value.currentTime)
		oscillator.stop(audioContext.value.currentTime + 0.5)
	}

	function stopSound() {
		if (currentSound.value) {
			currentSound.value.pause()
			currentSound.value.currentTime = 0
			isPlaying.value = false
		}
	}

	async function requestNotificationPermission() {
		if (typeof window === "undefined" || !("Notification" in window)) return false

		if (Notification.permission === "granted") return true
		if (Notification.permission === "denied") return false

		const permission = await Notification.requestPermission()
		return permission === "granted"
	}

	function showNotification(title: string, body: string) {
		if (typeof window === "undefined" || !("Notification" in window)) return

		if (Notification.permission === "granted") {
			new Notification(title, {
				body,
				icon: "/icon-pomodoro.png",
				badge: "/icon-pomodoro.png",
			})
		}
	}

	return {
		audioContext: readonly(audioContext),
		isPlaying: readonly(isPlaying),
		playSound,
		playBeep,
		stopSound,
		requestNotificationPermission,
		showNotification,
	}
}
