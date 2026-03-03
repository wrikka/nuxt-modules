export const useAudioEnhancement = () => {
	const isEnabled = ref(false);
	const noiseReduction = ref(true);
	const echoCancellation = ref(true);
	const autoGainControl = ref(true);

	const applyAudioEnhancement = async (stream: MediaStream): Promise<MediaStream> => {
		if (!isEnabled.value) {
			return stream;
		}

		try {
			const audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(stream);
			const destination = audioContext.createMediaStreamDestination();

			const gainNode = audioContext.createGain();

			if (autoGainControl.value) {
				const analyser = audioContext.createAnalyser();
				analyser.fftSize = 256;
				source.connect(analyser);

				const dataArray = new Uint8Array(analyser.frequencyBinCount);

				const adjustGain = () => {
					analyser.getByteFrequencyData(dataArray);
					let sum = 0;
					for (let i = 0; i < dataArray.length; i++) {
						sum += dataArray[i]!;
					}
					const average = sum / dataArray.length;

					if (average < 50) {
						gainNode.gain.value = 2;
					} else if (average > 200) {
						gainNode.gain.value = 0.5;
					} else {
						gainNode.gain.value = 1;
					}

					requestAnimationFrame(adjustGain);
				};

				adjustGain();
				analyser.connect(gainNode);
			} else {
				source.connect(gainNode);
			}

			gainNode.connect(destination);

			const enhancedStream = destination.stream;

			const _originalAudioTracks = stream.getAudioTracks();
			const enhancedAudioTracks = enhancedStream.getAudioTracks();

			if (enhancedAudioTracks.length > 0) {
				enhancedAudioTracks.forEach((track) => {
					track.enabled = noiseReduction.value || echoCancellation.value;
					if (noiseReduction.value) {
						void track.applyConstraints({
							noiseSuppression: true,
							echoCancellation: echoCancellation.value,
							autoGainControl: autoGainControl.value,
						} as MediaTrackConstraints);
					}
				});
			}

			return enhancedStream;
		} catch (error) {
			console.error("Error applying audio enhancement:", error);
			return stream;
		}
	};

	return {
		isEnabled,
		noiseReduction,
		echoCancellation,
		autoGainControl,
		applyAudioEnhancement,
	};
};
