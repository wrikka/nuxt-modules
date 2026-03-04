import * as Tone from "tone";
import { ref } from "vue";

export interface RecordingState {
	isRecording: boolean;
	startTime: number;
	trackId: string | null;
}

export interface MetronomeSettings {
	enabled: boolean;
	volume: number;
	sound: "click" | "wood" | "beeps";
}

export const useAudioRecording = () => {
	const recordingState = ref<RecordingState>({
		isRecording: false,
		startTime: 0,
		trackId: null,
	});

	const metronomeSettings = ref<MetronomeSettings>({
		enabled: false,
		volume: 0.5,
		sound: "click",
	});

	const metronome = ref<Tone.MembraneSynth | null>(null);
	const metronomeLoop = ref<Tone.Loop | null>(null);

	const initializeMetronome = async () => {
		await Tone.start();

		metronome.value = new Tone.MembraneSynth({
			pitchDecay: 0.05,
			octaves: 10,
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.001,
				decay: 0.4,
				sustain: 0.01,
				release: 1.4,
			},
		}).toDestination();
	};

	const startRecording = async (trackId: string, bpm: number) => {
		await initializeMetronome();

		if (recordingState.value.isRecording) return;

		recordingState.value = {
			isRecording: true,
			startTime: Date.now(),
			trackId,
		};

		if (metronomeSettings.value.enabled) {
			startMetronome(bpm);
		}
	};

	const stopRecording = async () => {
		if (!recordingState.value.isRecording) return null;

		recordingState.value.isRecording = false;

		if (metronomeLoop.value) {
			metronomeLoop.value.dispose();
			metronomeLoop.value = null;
		}

		return recordingState.value;
	};

	const startMetronome = (bpm: number) => {
		if (!metronome.value) return;

		const secondsPerBeat = 60 / bpm;

		metronomeLoop.value = new Tone.Loop((time) => {
			metronome.value?.triggerAttackRelease("C4", "32n", time);
		}, secondsPerBeat).start(0);
	};

	const stopMetronome = () => {
		if (metronomeLoop.value) {
			metronomeLoop.value.dispose();
			metronomeLoop.value = null;
		}
	};

	const toggleMetronome = () => {
		metronomeSettings.value.enabled = !metronomeSettings.value.enabled;
	};

	const setMetronomeVolume = (volume: number) => {
		metronomeSettings.value.volume = volume;
	};

	const dispose = () => {
		stopMetronome();
		metronome.value?.dispose();
	};

	return {
		recordingState,
		metronomeSettings,
		startRecording,
		stopRecording,
		startMetronome,
		stopMetronome,
		toggleMetronome,
		setMetronomeVolume,
		dispose,
	};
};
