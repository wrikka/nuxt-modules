import { ref, computed, onMounted, onUnmounted } from "vue";

export type VoiceCommand = 
	| "next" 
	| "previous" 
	| "first" 
	| "last" 
	| "zoomIn" 
	| "zoomOut" 
	| "fullscreen"
	| "presenterMode"
	| "overview"
	| "pause";

export interface VoiceCommandConfig {
	command: VoiceCommand;
	phrases: string[];
	action: () => void;
}

export function useVoiceCommands(
	onCommand?: (command: VoiceCommand) => void,
) {
	const isListening = ref(false);
	const isSupported = ref(false);
	const transcript = ref("");
	const confidence = ref(0);
	const recognition = ref<SpeechRecognition | null>(null);

	const defaultCommands: VoiceCommandConfig[] = [
		{
			command: "next",
			phrases: ["next slide", "forward", "continue", "next"],
			action: () => onCommand?.("next"),
		},
		{
			command: "previous",
			phrases: ["previous slide", "back", "go back", "previous"],
			action: () => onCommand?.("previous"),
		},
		{
			command: "first",
			phrases: ["first slide", "go to start", "beginning"],
			action: () => onCommand?.("first"),
		},
		{
			command: "last",
			phrases: ["last slide", "go to end", "ending"],
			action: () => onCommand?.("last"),
		},
		{
			command: "zoomIn",
			phrases: ["zoom in", "closer", "magnify"],
			action: () => onCommand?.("zoomIn"),
		},
		{
			command: "zoomOut",
			phrases: ["zoom out", "further", "shrink"],
			action: () => onCommand?.("zoomOut"),
		},
		{
			command: "fullscreen",
			phrases: ["full screen", "fullscreen", "maximize"],
			action: () => onCommand?.("fullscreen"),
		},
		{
			command: "presenterMode",
			phrases: ["presenter mode", "presenter view", "speaker view"],
			action: () => onCommand?.("presenterMode"),
		},
		{
			command: "overview",
			phrases: ["show overview", "overview", "see all slides"],
			action: () => onCommand?.("overview"),
		},
		{
			command: "pause",
			phrases: ["pause", "stop", "wait"],
			action: () => onCommand?.("pause"),
		},
	];

	function init() {
		if (typeof window === "undefined") return;
		
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		isSupported.value = !!SpeechRecognition;
		
		if (SpeechRecognition) {
			recognition.value = new SpeechRecognition();
			recognition.value.continuous = true;
			recognition.value.interimResults = true;
			recognition.value.lang = "en-US";
			
			recognition.value.onresult = handleResult;
			recognition.value.onerror = handleError;
			recognition.value.onend = handleEnd;
		}
	}

	function handleResult(event: SpeechRecognitionEvent) {
		const results = event.results;
		const lastResult = results[results.length - 1];
		
		transcript.value = lastResult[0].transcript.toLowerCase().trim();
		confidence.value = lastResult[0].confidence;
		
		if (lastResult.isFinal) {
			processCommand(transcript.value);
		}
	}

	function processCommand(text: string) {
		for (const config of defaultCommands) {
			const matched = config.phrases.some(phrase => 
				text.includes(phrase.toLowerCase())
			);
			
			if (matched) {
				config.action();
				break;
			}
		}
	}

	function handleError(event: SpeechRecognitionErrorEvent) {
		console.error("Speech recognition error:", event.error);
		isListening.value = false;
	}

	function handleEnd() {
		if (isListening.value) {
			recognition.value?.start();
		}
	}

	function startListening() {
		if (!recognition.value) {
			init();
		}
		
		recognition.value?.start();
		isListening.value = true;
	}

	function stopListening() {
		recognition.value?.stop();
		isListening.value = false;
	}

	function toggleListening() {
		if (isListening.value) {
			stopListening();
		} else {
			startListening();
		}
	}

	function setLanguage(lang: string) {
		if (recognition.value) {
			recognition.value.lang = lang;
		}
	}

	function addCustomCommand(
		command: VoiceCommand,
		phrases: string[],
		action: () => void,
	) {
		defaultCommands.push({ command, phrases, action });
	}

	onMounted(() => {
		init();
	});

	onUnmounted(() => {
		stopListening();
	});

	return {
		isListening: readonly(isListening),
		isSupported: readonly(isSupported),
		transcript: readonly(transcript),
		confidence: readonly(confidence),
		startListening,
		stopListening,
		toggleListening,
		setLanguage,
		addCustomCommand,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
