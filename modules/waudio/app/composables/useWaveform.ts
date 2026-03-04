export interface WaveformData {
	peaks: number[];
	duration: number;
	sampleRate: number;
}

export const useWaveform = () => {
	const waveformCache = ref<Map<string, WaveformData>>(new Map());
	const loading = ref<Set<string>>(new Set());

	const generateAudioWaveform = async (audioUrl: string, samples: number = 1000): Promise<WaveformData> => {
		if (waveformCache.value.has(audioUrl)) {
			return waveformCache.value.get(audioUrl)!;
		}

		loading.value.add(audioUrl);

		try {
			const response = await fetch(audioUrl);
			const arrayBuffer = await response.arrayBuffer();
			const audioContext = new AudioContext();
			const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

			const channelData = audioBuffer.getChannelData(0);
			const blockSize = Math.floor(channelData.length / samples);
			const peaks: number[] = [];

			for (let i = 0; i < samples; i++) {
				const start = i * blockSize;
				let max = 0;

				for (let j = 0; j < blockSize; j++) {
					const value = Math.abs(channelData[start + j] ?? 0);
					if (value > max) {
						max = value;
					}
				}

				peaks.push(max);
			}

			const waveformData: WaveformData = {
				peaks,
				duration: audioBuffer.duration,
				sampleRate: audioBuffer.sampleRate,
			};

			waveformCache.value.set(audioUrl, waveformData);

			return waveformData;
		} catch (error) {
			console.error("Failed to generate waveform:", error);
			throw error;
		} finally {
			loading.value.delete(audioUrl);
		}
	};

	const generateVideoWaveform = async (videoUrl: string, samples: number = 1000): Promise<WaveformData> => {
		if (waveformCache.value.has(videoUrl)) {
			return waveformCache.value.get(videoUrl)!;
		}

		loading.value.add(videoUrl);

		try {
			const video = document.createElement("video");
			video.crossOrigin = "anonymous";
			video.preload = "auto";
			video.src = videoUrl;

			await new Promise<void>((resolve, reject) => {
				video.onloadedmetadata = () => resolve();
				video.onerror = reject;
			});

			const audioContext = new AudioContext();
			const source = audioContext.createMediaElementSource(video);
			const analyser = audioContext.createAnalyser();
			const destination = audioContext.createMediaStreamDestination();

			source.connect(analyser);
			analyser.connect(destination);

			const duration = video.duration;
			const sampleInterval = duration / samples;
			const peaks: number[] = [];

			for (let i = 0; i < samples; i++) {
				const time = i * sampleInterval;
				video.currentTime = time;

				await new Promise<void>((resolve) => {
					const onSeeked = () => {
						video.removeEventListener("seeked", onSeeked);
						resolve();
					};
					video.addEventListener("seeked", onSeeked);
				});

				const dataArray = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(dataArray);

				let sum = 0;
				for (let j = 0; j < dataArray.length; j++) {
					sum += dataArray[j] ?? 0;
				}
				const average = sum / dataArray.length;
				peaks.push(average / 255);
			}

			const waveformData: WaveformData = {
				peaks,
				duration,
				sampleRate: audioContext.sampleRate,
			};

			waveformCache.value.set(videoUrl, waveformData);

			video.pause();
			video.src = "";
			source.disconnect();

			return waveformData;
		} catch (error) {
			console.error("Failed to generate video waveform:", error);
			throw error;
		} finally {
			loading.value.delete(videoUrl);
		}
	};

	const generateWaveform = async (
		url: string,
		type: "audio" | "video",
		samples: number = 1000,
	): Promise<WaveformData> => {
		if (type === "audio") {
			return generateAudioWaveform(url, samples);
		} else {
			return generateVideoWaveform(url, samples);
		}
	};

	const getWaveform = (url: string): WaveformData | null => {
		return waveformCache.value.get(url) || null;
	};

	const isLoading = (url: string): boolean => {
		return loading.value.has(url);
	};

	const clearCache = () => {
		waveformCache.value.clear();
	};

	const removeFromCache = (url: string) => {
		waveformCache.value.delete(url);
	};

	return {
		waveformCache,
		loading,
		generateWaveform,
		generateAudioWaveform,
		generateVideoWaveform,
		getWaveform,
		isLoading,
		clearCache,
		removeFromCache,
	};
};
