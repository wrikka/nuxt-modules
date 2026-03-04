export interface TranscriptionSegment {
	id: string;
	start: number;
	end: number;
	text: string;
	confidence: number;
	isFinal: boolean;
}

export interface TranscriptionState {
	isListening: boolean;
	isSupported: boolean;
	segments: TranscriptionSegment[];
	currentText: string;
	interimText: string;
	language: string;
	error?: string;
}

export const useAITranscription = () => {
	const state = reactive<TranscriptionState>({
		isListening: false,
		isSupported: false,
		segments: [],
		currentText: "",
		interimText: "",
		language: "th-TH",
	});

	let recognition: SpeechRecognition | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];

	const checkSupport = (): boolean => {
		if (typeof window === "undefined") return false;
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		state.isSupported = !!SpeechRecognition;
		return state.isSupported;
	};

	const initializeRecognition = () => {
		if (!checkSupport()) return false;

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = state.language;

		recognition.onstart = () => {
			state.isListening = true;
		};

		recognition.onend = () => {
			state.isListening = false;
		};

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let interimTranscript = "";
			let finalTranscript = "";

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				const confidence = event.results[i][0].confidence;

				if (event.results[i].isFinal) {
					finalTranscript += transcript;
					addSegment(transcript, confidence, true);
				} else {
					interimTranscript += transcript;
				}
			}

			state.interimText = interimTranscript;
			if (finalTranscript) {
				state.currentText += finalTranscript;
			}
		};

		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			state.error = event.error;
			state.isListening = false;
		};

		return true;
	};

	const addSegment = (text: string, confidence: number, isFinal: boolean) => {
		const now = Date.now();
		const segment: TranscriptionSegment = {
			id: `seg-${now}-${Math.random().toString(36).substr(2, 9)}`,
			start: now - (state.segments.length > 0 ? state.segments[state.segments.length - 1].end : now),
			end: now,
			text,
			confidence,
			isFinal,
		};
		state.segments.push(segment);
	};

	const start = async () => {
		if (!recognition) {
			if (!initializeRecognition()) {
				state.error = "Speech recognition not supported";
				return;
			}
		}

		try {
			recognition?.start();
		} catch (error) {
			state.error = error instanceof Error ? error.message : "Failed to start transcription";
		}
	};

	const stop = () => {
		recognition?.stop();
		state.isListening = false;
	};

	const setLanguage = (lang: string) => {
		state.language = lang;
		if (recognition) {
			recognition.lang = lang;
		}
	};

	const clearTranscription = () => {
		state.segments = [];
		state.currentText = "";
		state.interimText = "";
	};

	const exportTranscription = (format: "txt" | "json" | "srt" = "txt"): string => {
		switch (format) {
			case "json":
				return JSON.stringify(state.segments, null, 2);
			case "srt":
				return exportToSRT();
			case "txt":
			default:
				return state.segments.map(s => s.text).join("\n");
		}
	};

	const exportToSRT = (): string => {
		const formatTime = (ms: number): string => {
			const hours = Math.floor(ms / 3600000);
			const minutes = Math.floor((ms % 3600000) / 60000);
			const seconds = Math.floor((ms % 60000) / 1000);
			const milliseconds = Math.floor(ms % 1000);
			return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(3, "0")}`;
		};

		let srt = "";
		state.segments.forEach((segment, index) => {
			srt += `${index + 1}\n`;
			srt += `${formatTime(segment.start)} --> ${formatTime(segment.end)}\n`;
			srt += `${segment.text}\n\n`;
		});
		return srt;
	};

	const searchTranscription = (query: string): TranscriptionSegment[] => {
		const lowerQuery = query.toLowerCase();
		return state.segments.filter(s => s.text.toLowerCase().includes(lowerQuery));
	};

	const getTranscriptionAtTime = (timeMs: number): TranscriptionSegment | undefined => {
		return state.segments.find(s => timeMs >= s.start && timeMs <= s.end);
	};

	const editSegment = (id: string, newText: string) => {
		const segment = state.segments.find(s => s.id === id);
		if (segment) {
			segment.text = newText;
		}
	};

	const deleteSegment = (id: string) => {
		state.segments = state.segments.filter(s => s.id !== id);
	};

	const mergeSegments = (ids: string[]) => {
		const segmentsToMerge = state.segments.filter(s => ids.includes(s.id));
		if (segmentsToMerge.length < 2) return;

		const mergedText = segmentsToMerge.map(s => s.text).join(" ");
		const mergedStart = Math.min(...segmentsToMerge.map(s => s.start));
		const mergedEnd = Math.max(...segmentsToMerge.map(s => s.end));
		const avgConfidence = segmentsToMerge.reduce((sum, s) => sum + s.confidence, 0) / segmentsToMerge.length;

		const merged: TranscriptionSegment = {
			id: `seg-${Date.now()}`,
			start: mergedStart,
			end: mergedEnd,
			text: mergedText,
			confidence: avgConfidence,
			isFinal: true,
		};

		state.segments = [
			...state.segments.filter(s => !ids.includes(s.id)),
			merged,
		].sort((a, b) => a.start - b.start);
	};

	// Advanced: Transcribe from audio file using Web Speech API or external service
	const transcribeAudioFile = async (audioFile: File): Promise<boolean> => {
		// Note: Web Speech API doesn't support file transcription directly
		// This would require sending to a server or using Web Audio API
		// Placeholder for future implementation
		console.log("Audio file transcription would require server-side processing");
		return false;
	};

	onMounted(() => {
		checkSupport();
	});

	onUnmounted(() => {
		stop();
	});

	return {
		state: readonly(state),
		isSupported: computed(() => state.isSupported),
		isListening: computed(() => state.isListening),
		segments: computed(() => state.segments),
		fullText: computed(() => state.segments.map(s => s.text).join(" ")),
		checkSupport,
		start,
		stop,
		setLanguage,
		clearTranscription,
		exportTranscription,
		searchTranscription,
		getTranscriptionAtTime,
		editSegment,
		deleteSegment,
		mergeSegments,
		transcribeAudioFile,
	};
};
