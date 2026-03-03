import { computed, readonly, ref } from "vue"
import type { Soundscape } from "#pomodoro/types"

const soundscapes = ref<Soundscape[]>([
	{ id: "rain", name: "ฝนตก", icon: "i-ph-cloud-rain", src: "/soundscapes/rain.mp3" },
	{ id: "cafe", name: "ร้านกาแฟ", icon: "i-ph-coffee", src: "/soundscapes/cafe.mp3" },
	{ id: "forest", name: "ป่าไม้", icon: "i-ph-tree", src: "/soundscapes/forest.mp3" },
	{ id: "waves", name: "คลื่นทะเล", icon: "i-ph-waves", src: "/soundscapes/waves.mp3" },
	{ id: "fire", name: "กองไฟ", icon: "i-ph-fire", src: "/soundscapes/fire.mp3" },
	{ id: "whitenoise", name: "White Noise", icon: "i-ph-speaker-high", src: "/soundscapes/whitenoise.mp3" },
])

const currentSoundscape = ref<Soundscape | null>(null)
const audioElement = ref<HTMLAudioElement | null>(null)
const volume = ref(0.3)
const isPlaying = ref(false)

export function useSoundscapes() {
	const isMuted = computed(() => volume.value === 0)

	function play(soundscape: Soundscape) {
		if (typeof window === "undefined") return

		stop()

		currentSoundscape.value = soundscape
		const audio = new Audio(soundscape.src)
		audio.loop = true
		audio.volume = volume.value
		audioElement.value = audio

		audio.play().catch(() => {
			isPlaying.value = false
		})
		isPlaying.value = true
	}

	function stop() {
		if (audioElement.value) {
			audioElement.value.pause()
			audioElement.value.currentTime = 0
			audioElement.value = null
		}
		currentSoundscape.value = null
		isPlaying.value = false
	}

	function setVolume(value: number) {
		volume.value = Math.max(0, Math.min(1, value))
		if (audioElement.value) {
			audioElement.value.volume = volume.value
		}
	}

	function toggleMute() {
		if (isMuted.value) {
			setVolume(0.3)
		} else {
			setVolume(0)
		}
	}

	return {
		soundscapes: readonly(soundscapes),
		currentSoundscape: readonly(currentSoundscape),
		volume: readonly(volume),
		isPlaying: readonly(isPlaying),
		isMuted,
		play,
		stop,
		setVolume,
		toggleMute,
	}
}
