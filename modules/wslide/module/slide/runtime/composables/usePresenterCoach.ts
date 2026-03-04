import { ref, computed, onMounted, onUnmounted } from "vue";

export interface CoachFeedback {
	id: string;
	type: "pace" | "clarity" | "engagement" | "filler" | "volume";
	message: string;
	severity: "info" | "warning" | "critical";
	timestamp: number;
	suggestion: string;
}

export interface PresentationMetrics {
	speakingPace: number; // words per minute
	fillerWordCount: number;
	volumeLevel: number; // 0-100
	clarityScore: number; // 0-100
	engagementIndicators: number;
	duration: number;
}

export function usePresenterCoach() {
	const isActive = ref(false);
	const feedbacks = ref<CoachFeedback[]>([]);
	const metrics = ref<PresentationMetrics>({
		speakingPace: 0,
		fillerWordCount: 0,
		volumeLevel: 0,
		clarityScore: 0,
		engagementIndicators: 0,
		duration: 0,
	});
	const transcript = ref("");
	const startTime = ref<number | null>(null);

	const recentFeedback = computed(() => {
		return feedbacks.value.slice(-5);
	});

	const overallScore = computed(() => {
		const { speakingPace, clarityScore, fillerWordCount } = metrics.value;
		let score = clarityScore;
		
		// Pace scoring (optimal: 120-150 wpm)
		if (speakingPace >= 120 && speakingPace <= 150) {
			score += 25;
		} else if (speakingPace >= 100 && speakingPace <= 170) {
			score += 15;
		}
		
		// Filler word penalty
		score -= Math.min(fillerWordCount * 2, 25);
		
		return Math.max(0, Math.min(100, score));
	});

	const fillerWords = [
		"um", "uh", "like", "you know", "actually", "basically",
		"literally", "so", "well", "right", "okay", "I mean",
	];

	function start() {
		isActive.value = true;
		startTime.value = Date.now();
		startListening();
	}

	function stop() {
		isActive.value = false;
		if (startTime.value) {
			metrics.value.duration = Date.now() - startTime.value;
		}
		stopListening();
	}

	let recognition: SpeechRecognition | null = null;
	let wordCount = 0;
	let lastWordTime = Date.now();

	function startListening() {
		if (typeof window === "undefined") return;
		
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) return;

		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onresult = (event) => {
			const results = event.results;
			const lastResult = results[results.length - 1];
			
			if (lastResult.isFinal) {
				const text = lastResult[0].transcript;
				transcript.value += " " + text;
				analyzeSpeech(text);
			}
		};

		recognition.start();
	}

	function stopListening() {
		recognition?.stop();
		recognition = null;
	}

	function analyzeSpeech(text: string) {
		const words = text.split(/\s+/).filter(w => w.length > 0);
		wordCount += words.length;
		
		// Calculate speaking pace
		const now = Date.now();
		const timeDiff = (now - lastWordTime) / 1000 / 60; // minutes
		if (timeDiff > 0) {
			metrics.value.speakingPace = Math.round(wordCount / timeDiff);
		}
		
		// Check filler words
		const lowerText = text.toLowerCase();
		for (const filler of fillerWords) {
			const regex = new RegExp(`\\b${filler}\\b`, "gi");
			const matches = lowerText.match(regex);
			if (matches) {
				metrics.value.fillerWordCount += matches.length;
				addFeedback({
					type: "filler",
					message: `Filler word detected: "${filler}"`,
					severity: "warning",
					suggestion: `Try pausing silently instead of using "${filler}"`,
				});
			}
		}
		
		// Pace feedback
		if (metrics.value.speakingPace > 170) {
			addFeedback({
				type: "pace",
				message: "Speaking too fast",
				severity: "warning",
				suggestion: "Slow down to 120-150 words per minute for better clarity",
			});
		} else if (metrics.value.speakingPace < 100) {
			addFeedback({
				type: "pace",
				message: "Speaking too slow",
				severity: "info",
				suggestion: "Pick up the pace slightly to maintain engagement",
			});
		}
		
		// Volume detection (if supported)
		detectVolume();
	}

	async function detectVolume() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const audioContext = new AudioContext();
			const analyser = audioContext.createAnalyser();
			const microphone = audioContext.createMediaStreamSource(stream);
			microphone.connect(analyser);
			
			analyser.fftSize = 256;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			
			analyser.getByteFrequencyData(dataArray);
			const average = dataArray.reduce((a, b) => a + b) / bufferLength;
			metrics.value.volumeLevel = Math.round((average / 128) * 100);
			
			if (metrics.value.volumeLevel < 30) {
				addFeedback({
					type: "volume",
					message: "Volume too low",
					severity: "warning",
					suggestion: "Speak louder or move closer to the microphone",
				});
			}
			
			stream.getTracks().forEach(t => t.stop());
		} catch {
			// Volume detection not available
		}
	}

	function addFeedback(partial: Omit<CoachFeedback, "id" | "timestamp">) {
		const feedback: CoachFeedback = {
			...partial,
			id: `feedback-${Date.now()}`,
			timestamp: Date.now(),
		};
		
		feedbacks.value.push(feedback);
		
		// Keep only last 20 feedbacks
		if (feedbacks.value.length > 20) {
			feedbacks.value.shift();
		}
	}

	function clearFeedbacks() {
		feedbacks.value = [];
	}

	function getReport() {
		return {
			score: overallScore.value,
			metrics: metrics.value,
			feedbackCount: feedbacks.value.length,
			fillerWords: metrics.value.fillerWordCount,
			avgPace: metrics.value.speakingPace,
			duration: metrics.value.duration,
			transcript: transcript.value,
		};
	}

	onUnmounted(() => {
		stop();
	});

	return {
		isActive: readonly(isActive),
		feedbacks: readonly(feedbacks),
		metrics: readonly(metrics),
		recentFeedback,
		overallScore,
		start,
		stop,
		clearFeedbacks,
		getReport,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
