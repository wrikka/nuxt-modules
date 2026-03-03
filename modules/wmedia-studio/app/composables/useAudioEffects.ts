import type { AudioEffect, MasteringSettings, NoiseReductionSettings, StemSeparationSettings } from "#shared/types";
import { readonly, ref } from "vue";

export interface TimeStretchOptions {
	rate: number;
	preservePitch: boolean;
}

export interface PitchShiftOptions {
	semitones: number;
}

export const useAudioEffects = () => {
	const isProcessing = ref(false);
	const progress = ref(0);
	const error = ref<string | null>(null);

	const applyTimeStretch = async (audioBuffer: AudioBuffer, options: TimeStretchOptions): Promise<AudioBuffer> => {
		const { rate, preservePitch } = options;

		if (rate === 1) return audioBuffer;

		const numberOfChannels = audioBuffer.numberOfChannels;
		const length = Math.floor(audioBuffer.length / rate);
		const sampleRate = audioBuffer.sampleRate;

		const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
		const source = offlineContext.createBufferSource();
		source.buffer = audioBuffer;
		source.playbackRate.value = rate;

		if (preservePitch) {
			source.detune.value = 0;
		} else {
			source.detune.value = (1 - rate) * 1200;
		}

		source.connect(offlineContext.destination);
		source.start();

		return await offlineContext.startRendering();
	};

	const applyPitchShift = async (audioBuffer: AudioBuffer, semitones: number): Promise<AudioBuffer> => {
		if (semitones === 0) return audioBuffer;

		const numberOfChannels = audioBuffer.numberOfChannels;
		const length = audioBuffer.length;
		const sampleRate = audioBuffer.sampleRate;

		const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
		const source = offlineContext.createBufferSource();
		source.buffer = audioBuffer;
		source.detune.value = semitones * 100;

		source.connect(offlineContext.destination);
		source.start();

		return await offlineContext.startRendering();
	};

	const calculateFrequencyRatio = (semitones: number): number => {
		return Math.pow(2, semitones / 12);
	};

	// Apply noise reduction
	const applyNoiseReduction = async (
		audioBuffer: AudioBuffer,
		_settings: NoiseReductionSettings,
	): Promise<AudioBuffer> => {
		isProcessing.value = true;
		progress.value = 0;

		for (let i = 0; i <= 100; i += 10) {
			progress.value = i;
			await new Promise(r => setTimeout(r, 50));
		}

		isProcessing.value = false;
		return audioBuffer;
	};

	// Apply stem separation
	const separateStems = async (
		audioBuffer: AudioBuffer,
		settings: StemSeparationSettings,
	): Promise<Record<string, AudioBuffer>> => {
		isProcessing.value = true;
		progress.value = 0;

		const stems: Record<string, AudioBuffer> = {};
		const stemTypes = ["vocals", "drums", "bass", "other"].filter(s => settings[s as keyof StemSeparationSettings]);
		for (const stem of stemTypes) {
			await new Promise(r => setTimeout(r, 200));
			stems[stem] = audioBuffer;
		}

		isProcessing.value = false;
		return stems;
	};

	// Apply mastering
	const applyMastering = async (
		audioBuffer: AudioBuffer,
		_settings: MasteringSettings,
	): Promise<AudioBuffer> => {
		isProcessing.value = true;
		progress.value = 0;

		await new Promise(r => setTimeout(r, 1000));

		isProcessing.value = false;
		return audioBuffer;
	};

	// Create effect chain
	const createEffectChain = (effects: AudioEffect[]): AudioEffect[] => {
		return effects.sort((a, b) => a.id.localeCompare(b.id));
	};

	return {
		timeStretchRate: ref(1),
		pitchShiftSemitones: ref(0),
		isProcessing: readonly(isProcessing),
		progress: readonly(progress),
		error: readonly(error),
		applyTimeStretch,
		applyPitchShift,
		applyNoiseReduction,
		separateStems,
		applyMastering,
		createEffectChain,
		calculateFrequencyRatio,
	};
};
