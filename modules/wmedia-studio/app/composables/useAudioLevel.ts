export const useAudioLevel = () => {
	const audioLevel = ref(0);
	let audioContext: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let microphone: MediaStreamAudioSourceNode | null = null;
	let animationFrameId: number | null = null;

	const startMonitoring = (stream: MediaStream) => {
		try {
			audioContext = new AudioContext();
			analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;

			const audioTracks = stream.getAudioTracks();
			if (audioTracks.length === 0) {
				audioLevel.value = 0;
				return;
			}

			const audioStream = new MediaStream(audioTracks);
			microphone = audioContext.createMediaStreamSource(audioStream);
			microphone.connect(analyser);

			const dataArray = new Uint8Array(analyser.frequencyBinCount);

			const updateAudioLevel = () => {
				if (!analyser) return;

				analyser.getByteFrequencyData(dataArray);

				let sum = 0;
				for (let i = 0; i < dataArray.length; i++) {
					sum += dataArray[i] ?? 0;
				}

				const average = sum / dataArray.length;
				audioLevel.value = (average / 255) * 100;

				animationFrameId = requestAnimationFrame(updateAudioLevel);
			};

			updateAudioLevel();
		} catch (error) {
			console.error("Error starting audio level monitoring:", error);
			audioLevel.value = 0;
		}
	};

	const stopMonitoring = () => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		if (microphone) {
			microphone.disconnect();
			microphone = null;
		}

		if (analyser) {
			analyser.disconnect();
			analyser = null;
		}

		if (audioContext) {
			void audioContext.close();
			audioContext = null;
		}

		audioLevel.value = 0;
	};

	return {
		audioLevel,
		startMonitoring,
		stopMonitoring,
	};
};
