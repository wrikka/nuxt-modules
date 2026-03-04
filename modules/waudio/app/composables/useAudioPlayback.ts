import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import { ref } from "vue";

export interface UseAudioPlaybackOptions {
	onPlayStateChange?: (isPlaying: boolean) => void;
	onTimeUpdate?: (time: number) => void;
}

export const useAudioPlayback = (options: UseAudioPlaybackOptions = {}) => {
	const wavesurfer = ref<WaveSurfer | null>(null);
	const audioBuffer = ref<AudioBuffer | null>(null);
	const isPlaying = ref(false);
	const currentTime = ref(0);
	const duration = ref(0);
	const volume = ref(1);
	const isLooping = ref(false);
	const zoomLevel = ref(100);

	const player = ref<Tone.Player | null>(null);

	const initializeAudio = async () => {
		await Tone.start();
	};

	const loadAudioFile = async (file: File, container: string | HTMLElement): Promise<void> => {
		await initializeAudio();

		const arrayBuffer = await file.arrayBuffer();
		audioBuffer.value = await new AudioContext().decodeAudioData(arrayBuffer);
		duration.value = audioBuffer.value.duration;

		if (wavesurfer.value) {
			wavesurfer.value.destroy();
		}

		wavesurfer.value = WaveSurfer.create({
			container: typeof container === "string" ? container : container,
			waveColor: "#4a9eff",
			progressColor: "#0066cc",
			cursorColor: "#ffffff",
			barWidth: 2,
			barGap: 3,
			barRadius: 3,
			height: 200,
			normalize: true,
			minPxPerSec: zoomLevel.value,
		});

		const blob = new Blob([arrayBuffer], { type: file.type });
		const url = URL.createObjectURL(blob);
		await wavesurfer.value.load(url);

		wavesurfer.value.on("ready", () => {
			duration.value = wavesurfer.value!.getDuration();
		});

		wavesurfer.value.on("audioprocess", () => {
			currentTime.value = wavesurfer.value!.getCurrentTime();
			options.onTimeUpdate?.(currentTime.value);
		});

		wavesurfer.value.on("finish", () => {
			isPlaying.value = false;
			options.onPlayStateChange?.(false);
			if (isLooping.value) {
				void wavesurfer.value!.play();
				isPlaying.value = true;
				options.onPlayStateChange?.(true);
			}
		});
	};

	const play = async () => {
		await initializeAudio();
		if (wavesurfer.value) {
			void wavesurfer.value.play();
			isPlaying.value = true;
			options.onPlayStateChange?.(true);
		}
		if (player.value) {
			player.value.start();
		}
	};

	const pause = () => {
		if (wavesurfer.value) {
			wavesurfer.value.pause();
			isPlaying.value = false;
			options.onPlayStateChange?.(false);
		}
		if (player.value) {
			player.value.stop();
		}
	};

	const stop = () => {
		if (wavesurfer.value) {
			wavesurfer.value.stop();
			isPlaying.value = false;
			options.onPlayStateChange?.(false);
			currentTime.value = 0;
		}
		if (player.value) {
			player.value.stop();
		}
	};

	const seek = (time: number) => {
		if (wavesurfer.value) {
			wavesurfer.value.seekTo(time / duration.value);
			currentTime.value = time;
		}
	};

	const setVolume = (vol: number) => {
		volume.value = vol;
		if (player.value) {
			player.value.volume.value = Tone.dbToGain(vol * 100 - 100);
		}
	};

	const setZoom = (zoom: number) => {
		zoomLevel.value = zoom;
		if (wavesurfer.value) {
			wavesurfer.value.zoom(zoom);
		}
	};

	const toggleLoop = () => {
		isLooping.value = !isLooping.value;
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		const ms = Math.floor((seconds % 1) * 100);
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
	};

	return {
		wavesurfer,
		audioBuffer,
		isPlaying,
		currentTime,
		duration,
		volume,
		isLooping,
		zoomLevel,
		player,
		initializeAudio,
		loadAudioFile,
		play,
		pause,
		stop,
		seek,
		setVolume,
		setZoom,
		toggleLoop,
		formatTime,
	};
};
