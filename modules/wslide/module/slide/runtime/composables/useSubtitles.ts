import { ref, computed, onMounted, onUnmounted } from "vue";

export interface SubtitleConfig {
	sourceLanguage: string;
	targetLanguages: string[];
	position: "top" | "bottom";
	fontSize: "small" | "medium" | "large";
	showOriginal: boolean;
	autoTranslate: boolean;
}

export interface SubtitleEntry {
	id: string;
	text: string;
	translatedText?: Record<string, string>;
	timestamp: number;
	duration: number;
	speaker?: string;
}

export function useSubtitles(config?: Partial<SubtitleConfig>) {
	const defaultConfig: SubtitleConfig = {
		sourceLanguage: "en-US",
		targetLanguages: ["th", "ja", "zh", "es"],
		position: "bottom",
		fontSize: "medium",
		showOriginal: true,
		autoTranslate: true,
		...config,
	};

	const isActive = ref(false);
	const entries = ref<SubtitleEntry[]>([]);
	const currentEntry = ref<SubtitleEntry | null>(null);
	const recognition = ref<SpeechRecognition | null>(null);
	const transcript = ref("");

	const formattedSubtitles = computed(() => {
		return entries.value.map(entry => ({
			...entry,
			time: formatTime(entry.timestamp),
		}));
	});

	const latestSubtitle = computed(() => {
		return entries.value[entries.value.length - 1]?.text || "";
	});

	function init() {
		if (typeof window === "undefined") return;
		
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		
		if (SpeechRecognition) {
			recognition.value = new SpeechRecognition();
			recognition.value.continuous = true;
			recognition.value.interimResults = true;
			recognition.value.lang = defaultConfig.sourceLanguage;
			
			recognition.value.onresult = handleResult;
			recognition.value.onerror = handleError;
		}
	}

	function handleResult(event: SpeechRecognitionEvent) {
		const results = event.results;
		const lastResult = results[results.length - 1];
		
		transcript.value = lastResult[0].transcript;
		
		if (lastResult.isFinal) {
			addEntry(transcript.value);
		}
	}

	function handleError(event: SpeechRecognitionErrorEvent) {
		console.error("Subtitle recognition error:", event.error);
	}

	function addEntry(text: string) {
		const entry: SubtitleEntry = {
			id: `sub-${Date.now()}`,
			text,
			timestamp: Date.now(),
			duration: 5000,
		};
		
		if (defaultConfig.autoTranslate) {
			translateEntry(entry);
		}
		
		entries.value.push(entry);
		currentEntry.value = entry;
		
		// Keep only last 50 entries
		if (entries.value.length > 50) {
			entries.value.shift();
		}
	}

	async function translateEntry(entry: SubtitleEntry) {
		if (typeof window !== "undefined" && "ai" in window) {
			try {
				const ai = (window as Window & { ai?: { createTextSession: () => Promise<{ prompt: (p: string) => Promise<string> }> } }).ai;
				if (!ai) return;
				
				const session = await ai.createTextSession();
				entry.translatedText = {};
				
				for (const lang of defaultConfig.targetLanguages) {
					const prompt = `Translate "${entry.text}" to ${getLanguageName(lang)}. Reply with translation only.`;
					const translation = await session.prompt(prompt);
					entry.translatedText[lang] = translation.trim();
				}
			} catch (err) {
				console.error("Translation error:", err);
			}
		}
	}

	function getLanguageName(code: string): string {
		const names: Record<string, string> = {
			en: "English",
			th: "Thai",
			ja: "Japanese",
			zh: "Chinese",
			es: "Spanish",
			fr: "French",
			de: "German",
			ko: "Korean",
		};
		return names[code] || code;
	}

	function formatTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", { 
			hour12: false, 
			hour: "2-digit", 
			minute: "2-digit",
			second: "2-digit",
		});
	}

	function start() {
		isActive.value = true;
		recognition.value?.start();
	}

	function stop() {
		isActive.value = false;
		recognition.value?.stop();
	}

	function toggle() {
		if (isActive.value) {
			stop();
		} else {
			start();
		}
	}

	function clear() {
		entries.value = [];
		currentEntry.value = null;
	}

	function setLanguage(lang: string) {
		defaultConfig.sourceLanguage = lang;
		if (recognition.value) {
			recognition.value.lang = lang;
		}
	}

	function exportSubtitles(): string {
		const data = entries.value.map(e => ({
			time: formatTime(e.timestamp),
			text: e.text,
			translations: e.translatedText,
		}));
		return JSON.stringify(data, null, 2);
	}

	onMounted(() => {
		init();
	});

	onUnmounted(() => {
		stop();
	});

	return {
		isActive: readonly(isActive),
		entries: readonly(entries),
		currentEntry: readonly(currentEntry),
		transcript: readonly(transcript),
		formattedSubtitles,
		latestSubtitle,
		start,
		stop,
		toggle,
		clear,
		setLanguage,
		exportSubtitles,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
