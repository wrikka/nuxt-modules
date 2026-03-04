import { reactive, readonly, computed } from "vue";

export interface SoundEffect {
	id: string;
	name: string;
	category: "transition" | "notification" | "ambient" | "ui" | "custom";
	url: string;
	duration: number;
	volume: number;
}

export interface SoundEffectsLibraryState {
	effects: SoundEffect[];
	categories: string[];
	isPlaying: boolean;
	currentEffect?: SoundEffect;
	masterVolume: number;
}

const DEFAULT_EFFECTS: SoundEffect[] = [
	{ id: "start-recording", name: "Start Recording", category: "notification", url: "", duration: 1, volume: 0.8 },
	{ id: "stop-recording", name: "Stop Recording", category: "notification", url: "", duration: 1, volume: 0.8 },
	{ id: "pause-recording", name: "Pause", category: "notification", url: "", duration: 0.5, volume: 0.6 },
	{ id: "error", name: "Error", category: "notification", url: "", duration: 0.5, volume: 1 },
	{ id: "success", name: "Success", category: "notification", url: "", duration: 1, volume: 0.7 },
	{ id: "whoosh", name: "Whoosh", category: "transition", url: "", duration: 0.5, volume: 0.5 },
	{ id: "click", name: "Click", category: "ui", url: "", duration: 0.1, volume: 0.3 },
	{ id: "chime", name: "Chime", category: "notification", url: "", duration: 2, volume: 0.6 },
];

export const useSoundEffectsLibrary = () => {
	const state = reactive<SoundEffectsLibraryState>({
		effects: [...DEFAULT_EFFECTS],
		categories: ["transition", "notification", "ambient", "ui", "custom"],
		isPlaying: false,
		masterVolume: 1,
	});

	const audioContext: AudioContext | null = typeof window !== "undefined" ? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() : null;

	const addEffect = (effect: Omit<SoundEffect, "id">): string => {
		const id = `sfx-${Date.now()}`;
		const newEffect = { ...effect, id };
		state.effects.push(newEffect);
		return id;
	};

	const removeEffect = (id: string) => {
		state.effects = state.effects.filter(e => e.id !== id);
	};

	const playEffect = async (id: string): Promise<boolean> => {
		const effect = state.effects.find(e => e.id === id);
		if (!effect || !audioContext) return false;

		try {
			// Create oscillator for simple synthesized sounds
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			// Different sounds based on category
			switch (effect.category) {
				case "notification":
					oscillator.type = "sine";
					oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
					oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3);
					break;
				case "error":
					oscillator.type = "sawtooth";
					oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
					break;
				case "transition":
					oscillator.type = "triangle";
					oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
					oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + effect.duration);
					break;
				default:
					oscillator.type = "sine";
					oscillator.frequency.value = 440;
				}

			const volume = effect.volume * state.masterVolume;
			gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + effect.duration);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + effect.duration);

			state.isPlaying = true;
			state.currentEffect = effect;

			setTimeout(() => {
				state.isPlaying = false;
			}, effect.duration * 1000);

			return true;
		} catch {
			return false;
		}
	};

	const playStartRecording = () => playEffect("start-recording");
	const playStopRecording = () => playEffect("stop-recording");
	const playPauseRecording = () => playEffect("pause-recording");
	const playError = () => playEffect("error");
	const playSuccess = () => playEffect("success");

	const setMasterVolume = (volume: number) => {
		state.masterVolume = Math.max(0, Math.min(1, volume));
	};

	const getEffectsByCategory = (category: string): SoundEffect[] => {
		return state.effects.filter(e => e.category === category);
	};

	const uploadCustomEffect = async (file: File, name: string): Promise<string | null> => {
		try {
			const url = URL.createObjectURL(file);
			const audio = new Audio(url);

			await new Promise<void>((resolve, reject) => {
				audio.onloadedmetadata = () => resolve();
				audio.onerror = () => reject();
			});

			const id = addEffect({
				name,
				category: "custom",
				url,
				duration: audio.duration,
				volume: 0.8,
			});

			return id;
		} catch {
			return null;
		}
	};

	return {
		state: readonly(state),
		effects: computed(() => state.effects),
		addEffect,
		removeEffect,
		playEffect,
		playStartRecording,
		playStopRecording,
		playPauseRecording,
		playError,
		playSuccess,
		setMasterVolume,
		getEffectsByCategory,
		uploadCustomEffect,
	};
};
