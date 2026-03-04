export interface TranslationSegment {
	id: string;
	originalText: string;
	translatedText: string;
	sourceLanguage: string;
	targetLanguage: string;
	confidence: number;
	timestamp: number;
}

export interface RealtimeTranslationState {
	isActive: boolean;
	isSupported: boolean;
	sourceLanguage: string;
	targetLanguage: string;
	segments: TranslationSegment[];
	showSubtitles: boolean;
	subtitlePosition: "top" | "bottom" | "overlay";
	providers: TranslationProvider[];
	currentProvider: string;
}

export type TranslationProvider = "browser" | "google" | "microsoft" | "custom";

export const useRealtimeTranslation = () => {
	const state = reactive<RealtimeTranslationState>({
		isActive: false,
		isSupported: false,
		sourceLanguage: "th",
		targetLanguage: "en",
		segments: [],
		showSubtitles: true,
		subtitlePosition: "bottom",
		providers: ["browser"],
		currentProvider: "browser",
	});

	let speechRecognition: SpeechRecognition | null = null;
	let translator: Translator | null = null;

	interface Translator {
		translate: (text: string) => Promise<string>;
	}

	const checkSupport = (): boolean => {
		const hasSpeechRecognition = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
		const hasTranslatorAPI = "Translator" in window || "translation" in navigator;
		state.isSupported = hasSpeechRecognition || hasTranslatorAPI;
		return state.isSupported;
	};

	const createBrowserTranslator = (): Translator => {
		return {
			translate: async (text: string): Promise<string> => {
				try {
					if ("translation" in navigator && "createTranslator" in navigator.translation) {
						const translator = await navigator.translation.createTranslator({
							sourceLanguage: state.sourceLanguage,
							targetLanguage: state.targetLanguage,
						});
						return await translator.translate(text);
					}
					return text;
				} catch {
					return text;
				}
			},
		};
	};

	const initialize = async (sourceLang: string, targetLang: string) => {
		if (!checkSupport()) return false;

		state.sourceLanguage = sourceLang;
		state.targetLanguage = targetLang;

		switch (state.currentProvider) {
			case "browser":
				translator = createBrowserTranslator();
				break;
			default:
				translator = createBrowserTranslator();
			}

			return true;
	};

	const start = () => {
		if (!translator) return;

		const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognitionAPI) return;

		speechRecognition = new SpeechRecognitionAPI();
		speechRecognition.continuous = true;
		speechRecognition.interimResults = true;
		speechRecognition.lang = state.sourceLanguage;

		speechRecognition.onresult = async (event: SpeechRecognitionEvent) => {
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				const isFinal = event.results[i].isFinal;

				if (isFinal && translator) {
					const translatedText = await translator.translate(transcript);
					const segment: TranslationSegment = {
						id: `trans-${Date.now()}`,
						originalText: transcript,
						translatedText,
						sourceLanguage: state.sourceLanguage,
						targetLanguage: state.targetLanguage,
						confidence: event.results[i][0].confidence,
						timestamp: Date.now(),
					};
					state.segments.push(segment);
				}
			}
		};

		speechRecognition.start();
		state.isActive = true;
	};

	const stop = () => {
		speechRecognition?.stop();
		state.isActive = false;
	};

	const setLanguages = (source: string, target: string) => {
		state.sourceLanguage = source;
		state.targetLanguage = target;
		if (speechRecognition) {
			speechRecognition.lang = source;
		}
	};

	const toggleSubtitles = () => {
		state.showSubtitles = !state.showSubtitles;
	};

	const setSubtitlePosition = (position: "top" | "bottom" | "overlay") => {
		state.subtitlePosition = position;
	};

	const exportTranslations = (): string => {
		return JSON.stringify(state.segments, null, 2);
	};

	const getRecentTranslations = (count = 5): TranslationSegment[] => {
		return state.segments.slice(-count);
	};

	const clearTranslations = () => {
		state.segments = [];
	};

	onUnmounted(() => {
		stop();
	});

	return {
		state: readonly(state),
		isSupported: computed(() => state.isSupported),
		isActive: computed(() => state.isActive),
		checkSupport,
		initialize,
		start,
		stop,
		setLanguages,
		toggleSubtitles,
		setSubtitlePosition,
		exportTranslations,
		getRecentTranslations,
		clearTranslations,
	};
};
