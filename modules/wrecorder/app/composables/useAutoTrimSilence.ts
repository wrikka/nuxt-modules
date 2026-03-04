export interface AudioSegment {
	start: number;
	end: number;
	isSilent: boolean;
	volume: number;
}

export interface SilenceTrimOptions {
	threshold?: number;
	minSilenceDuration?: number;
	padding?: number;
}

export interface TrimState {
	isAnalyzing: boolean;
	progress: number;
	segments: AudioSegment[];
	trimmedDuration: number;
	originalDuration: number;
}

export const useAutoTrimSilence = () => {
	const state = reactive<TrimState>({
		isAnalyzing: false,
		progress: 0,
		segments: [],
		trimmedDuration: 0,
		originalDuration: 0,
	});

	const analyzeAudio = async (
		audioBuffer: AudioBuffer,
		options: SilenceTrimOptions = {}
	): Promise<AudioSegment[]> => {
		const {
			threshold = -40,
			minSilenceDuration = 500,
			padding = 100,
		} = options;

		state.isAnalyzing = true;
		state.progress = 0;
		state.originalDuration = audioBuffer.duration * 1000;

		const sampleRate = audioBuffer.sampleRate;
		const channelData = audioBuffer.getChannelData(0);
		const numSamples = channelData.length;
		const thresholdLinear = Math.pow(10, threshold / 20);

		const segments: AudioSegment[] = [];
		let currentSegment: AudioSegment = {
			start: 0,
			end: 0,
			isSilent: false,
			volume: 0,
		};

		const windowSize = Math.floor(sampleRate * 0.01); // 10ms window
		let isSilent = false;
		let segmentStart = 0;

		for (let i = 0; i < numSamples; i += windowSize) {
			// คำนวณ RMS ของ window
			let sum = 0;
			const end = Math.min(i + windowSize, numSamples);
			for (let j = i; j < end; j++) {
				sum += channelData[j] * channelData[j];
			}
			const rms = Math.sqrt(sum / (end - i));
			const volume = 20 * Math.log10(rms + 1e-10);

			const newIsSilent = rms < thresholdLinear;

			if (newIsSilent !== isSilent) {
				// จบ segment เดิม
				currentSegment.end = (i / sampleRate) * 1000;
				currentSegment.isSilent = isSilent;
				segments.push({ ...currentSegment });

				// เริ่ม segment ใหม่
				currentSegment = {
					start: (i / sampleRate) * 1000,
					end: 0,
					isSilent: newIsSilent,
					volume,
				};

				isSilent = newIsSilent;
			}

			// อัปเดต progress
			if (i % (numSamples / 100) === 0) {
				state.progress = (i / numSamples) * 100;
				await new Promise(resolve => setTimeout(resolve, 0));
			}
		}

		// จบ segment สุดท้าย
		currentSegment.end = state.originalDuration;
		currentSegment.isSilent = isSilent;
		segments.push(currentSegment);

		// รวม segment ที่เงียบที่สั้นเกินไป
		state.segments = mergeShortSilences(segments, minSilenceDuration, padding);
		state.isAnalyzing = false;
		state.progress = 100;

		calculateTrimmedDuration();

		return state.segments;
	};

	const mergeShortSilences = (
		segments: AudioSegment[],
		minDuration: number,
		padding: number
	): AudioSegment[] => {
		const result: AudioSegment[] = [];
		let i = 0;

		while (i < segments.length) {
			const segment = segments[i];

			if (segment.isSilent) {
				const duration = segment.end - segment.start;

				if (duration < minDuration) {
					// รวมกับ segment ก่อนหน้าหรือถัดไป
					if (result.length > 0) {
						const prev = result[result.length - 1];
						prev.end = segment.end + padding;
					} else if (i + 1 < segments.length) {
						segments[i + 1].start = Math.max(0, segment.start - padding);
					}
				} else {
					// เพิ่ม padding
					result.push({
						...segment,
						start: Math.max(0, segment.start - padding),
						end: segment.end + padding,
					});
				}
			} else {
				result.push(segment);
			}

			i++;
		}

		return result;
	};

	const calculateTrimmedDuration = () => {
		let silentDuration = 0;
		state.segments.forEach(s => {
			if (s.isSilent) {
				silentDuration += s.end - s.start;
			}
		});
		state.trimmedDuration = state.originalDuration - silentDuration;
	};

	const getTrimmedRanges = (): Array<{ start: number; end: number }> => {
		return state.segments
			.filter(s => !s.isSilent)
			.map(s => ({ start: s.start, end: s.end }));
	};

	const reset = () => {
		state.isAnalyzing = false;
		state.progress = 0;
		state.segments = [];
		state.trimmedDuration = 0;
		state.originalDuration = 0;
	};

	return {
		state: readonly(state),
		analyzeAudio,
		getTrimmedRanges,
		reset,
	};
};
