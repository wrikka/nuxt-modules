export interface NoiseSuppressionOptions {
	noiseLevel?: number;
	enhanceLevel?: number;
	autoGain?: boolean;
	suppressKeyboard?: boolean;
	suppressMouse?: boolean;
}

export interface NoiseSuppressionState {
	enabled: boolean;
	noiseLevel: number;
	enhanceLevel: number;
	autoGain: boolean;
	suppressKeyboard: boolean;
	suppressMouse: boolean;
	isProcessing: boolean;
}

export const useNoiseSuppression = (options: NoiseSuppressionOptions = {}) => {
	const {
		noiseLevel = 50,
		enhanceLevel = 30,
		autoGain = true,
		suppressKeyboard = true,
		suppressMouse = true,
	} = options;

	const state = reactive<NoiseSuppressionState>({
		enabled: false,
		noiseLevel,
		enhanceLevel,
		autoGain,
		suppressKeyboard,
		suppressMouse,
		isProcessing: false,
	});

	const audioContext = ref<AudioContext | null>(null);
	const sourceNode = ref<MediaStreamAudioSourceNode | null>(null);
	const destinationNode = ref<MediaStreamAudioDestinationNode | null>(null);
	const gainNode = ref<GainNode | null>(null);
	const filterNodes = ref<BiquadFilterNode[]>([]);
	const analyserNode = ref<AnalyserNode | null>(null);
	const originalStream = ref<MediaStream | null>(null);
	const processedStream = ref<MediaStream | null>(null);
	const frequencyData = ref<Uint8Array | null>(null);
	const timeData = ref<Uint8Array | null>(null);

	const frequencyDataArray = computed(() => {
		if (!analyserNode.value || !frequencyData.value) return [];
		analyserNode.value.getByteFrequencyData(frequencyData.value);
		return Array.from(frequencyData.value);
	});

	const timeDataArray = computed(() => {
		if (!analyserNode.value || !timeData.value) return [];
		analyserNode.value.getByteTimeDomainData(timeData.value);
		return Array.from(timeData.value);
	});

	const initialize = async (stream: MediaStream): Promise<MediaStream> => {
		if (!stream.getAudioTracks().length) {
			throw new Error("Stream has no audio tracks");
		}

		originalStream.value = stream;

		try {
			audioContext.value = new AudioContext({
				latencyHint: "interactive",
			});

			sourceNode.value = audioContext.value.createMediaStreamSource(stream);
			destinationNode.value = audioContext.value.createMediaStreamDestination();
			analyserNode.value = audioContext.value.createAnalyser();
			analyserNode.value.fftSize = 256;
			analyserNode.value.smoothingTimeConstant = 0.8;

			frequencyData.value = new Uint8Array(analyserNode.value.frequencyBinCount);
			timeData.value = new Uint8Array(analyserNode.value.fftSize);

			gainNode.value = audioContext.value.createGain();

			applyNoiseSuppression();

			processedStream.value = destinationNode.value.stream;
			return processedStream.value;
		} catch (error) {
			cleanup();
			throw new Error(
				`Failed to initialize noise suppression: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	};

	const applyNoiseSuppression = (): void => {
		if (!audioContext.value || !sourceNode.value || !destinationNode.value || !gainNode.value) return;

		filterNodes.value.forEach((node) => node.disconnect());
		filterNodes.value = [];
		sourceNode.value.disconnect();
		gainNode.value.disconnect();
		analyserNode.value?.disconnect();

		let currentNode: AudioNode = sourceNode.value;

		if (state.enabled) {
			state.isProcessing = true;

			const highPass = audioContext.value.createBiquadFilter();
			highPass.type = "highpass";
			highPass.frequency.value = 80;
			highPass.Q.value = 0.7;
			filterNodes.value.push(highPass);
			currentNode.connect(highPass);
			currentNode = highPass;

			const lowPass = audioContext.value.createBiquadFilter();
			lowPass.type = "lowpass";
			lowPass.frequency.value = 8000;
			lowPass.Q.value = 0.7;
			filterNodes.value.push(lowPass);
			currentNode.connect(lowPass);
			currentNode = lowPass;

			const noiseReduction = audioContext.value.createBiquadFilter();
			noiseReduction.type = "notch";
			noiseReduction.frequency.value = 60;
			noiseReduction.Q.value = 10;
			filterNodes.value.push(noiseReduction);
			currentNode.connect(noiseReduction);
			currentNode = noiseReduction;

			if (state.suppressKeyboard) {
				const keyboardFilter = audioContext.value.createBiquadFilter();
				keyboardFilter.type = "peaking";
				keyboardFilter.frequency.value = 400;
				keyboardFilter.Q.value = 1;
				keyboardFilter.gain.value = -state.noiseLevel * 0.3;
				filterNodes.value.push(keyboardFilter);
				currentNode.connect(keyboardFilter);
				currentNode = keyboardFilter;
			}

			if (state.suppressMouse) {
				const mouseFilter = audioContext.value.createBiquadFilter();
				mouseFilter.type = "peaking";
				mouseFilter.frequency.value = 2000;
				mouseFilter.Q.value = 2;
				mouseFilter.gain.value = -state.noiseLevel * 0.2;
				filterNodes.value.push(mouseFilter);
				currentNode.connect(mouseFilter);
				currentNode = mouseFilter;
			}

			if (state.autoGain) {
				const compressor = audioContext.value.createDynamicsCompressor();
				compressor.threshold.value = -24;
				compressor.knee.value = 30;
				compressor.ratio.value = 12;
				compressor.attack.value = 0.003;
				compressor.release.value = 0.25;
				filterNodes.value.push(compressor);
				currentNode.connect(compressor);
				currentNode = compressor;
			}

			const enhanceGain = audioContext.value.createGain();
			enhanceGain.gain.value = 1 + state.enhanceLevel / 100;
			filterNodes.value.push(enhanceGain);
			currentNode.connect(enhanceGain);
			currentNode = enhanceGain;
		}

		currentNode.connect(gainNode.value);
		gainNode.value.connect(destinationNode.value);
		gainNode.value.connect(analyserNode.value!);

		gainNode.value.gain.value = state.enabled ? 1 : 0.8;
	};

	const toggle = (): void => {
		state.enabled = !state.enabled;
		applyNoiseSuppression();
	};

	const setNoiseLevel = (level: number): void => {
		state.noiseLevel = Math.max(0, Math.min(100, level));
		if (state.enabled) {
			applyNoiseSuppression();
		}
	};

	const setEnhanceLevel = (level: number): void => {
		state.enhanceLevel = Math.max(0, Math.min(100, level));
		if (state.enabled) {
			applyNoiseSuppression();
		}
	};

	const setAutoGain = (enabled: boolean): void => {
		state.autoGain = enabled;
		if (state.enabled) {
			applyNoiseSuppression();
		}
	};

	const setSuppressKeyboard = (enabled: boolean): void => {
		state.suppressKeyboard = enabled;
		if (state.enabled) {
			applyNoiseSuppression();
		}
	};

	const setSuppressMouse = (enabled: boolean): void => {
		state.suppressMouse = enabled;
		if (state.enabled) {
			applyNoiseSuppression();
		}
	};

	const applyPreset = (preset: string): void => {
		switch (preset) {
			case "default":
				state.noiseLevel = 50;
				state.enhanceLevel = 30;
				break;
			case "aggressive":
				state.noiseLevel = 80;
				state.enhanceLevel = 50;
				break;
			case "light":
				state.noiseLevel = 30;
				state.enhanceLevel = 15;
				break;
			case "voice":
				state.noiseLevel = 60;
				state.enhanceLevel = 40;
				state.autoGain = true;
				break;
			case "music":
				state.noiseLevel = 20;
				state.enhanceLevel = 10;
				state.autoGain = false;
				break;
		}
		applyNoiseSuppression();
	};

	const getAudioLevel = (): number => {
		if (!analyserNode.value || !timeData.value) return 0;
		analyserNode.value.getByteTimeDomainData(timeData.value);
		let sum = 0;
		for (let i = 0; i < timeData.value.length; i++) {
			const x = (timeData.value[i] - 128) / 128;
			sum += x * x;
		}
		return Math.sqrt(sum / timeData.value.length);
	};

	const cleanup = (): void => {
		filterNodes.value.forEach((node) => {
			try {
				node.disconnect();
			} catch {}
		});
		filterNodes.value = [];

		try {
			sourceNode.value?.disconnect();
		} catch {}
		try {
			gainNode.value?.disconnect();
		} catch {}
		try {
			analyserNode.value?.disconnect();
		} catch {}
		try {
			destinationNode.value?.disconnect();
		} catch {}

		sourceNode.value = null;
		gainNode.value = null;
		analyserNode.value = null;
		destinationNode.value = null;

		if (audioContext.value && audioContext.value.state !== "closed") {
			audioContext.value.close();
		}
		audioContext.value = null;

		originalStream.value = null;
		processedStream.value = null;
		state.isProcessing = false;
	};

	onUnmounted(() => {
		cleanup();
	});

	return {
		state,
		audioContext,
		originalStream,
		processedStream,
		frequencyDataArray,
		timeDataArray,
		initialize,
		toggle,
		setNoiseLevel,
		setEnhanceLevel,
		setAutoGain,
		setSuppressKeyboard,
		setSuppressMouse,
		applyPreset,
		getAudioLevel,
		cleanup,
	};
};
