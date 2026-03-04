import { ref, computed, onMounted } from "vue";

export interface AccessibilitySettings {
	highContrast: boolean;
	largeText: boolean;
	screenReader: boolean;
	reducedMotion: boolean;
	colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
	keyboardNavigation: boolean;
	captions: boolean;
	focusIndicator: boolean;
}

export function useAccessibility() {
	const settings = ref<AccessibilitySettings>({
		highContrast: false,
		largeText: false,
		screenReader: false,
		reducedMotion: false,
		colorBlindMode: "none",
		keyboardNavigation: true,
		captions: false,
		focusIndicator: true,
	});

	const isActive = ref(false);
	const announceMessage = ref("");

	const cssClasses = computed(() => {
		return {
			"a11y-high-contrast": settings.value.highContrast,
			"a11y-large-text": settings.value.largeText,
			"a11y-reduced-motion": settings.value.reducedMotion,
			[`a11y-color-blind-${settings.value.colorBlindMode}`]: settings.value.colorBlindMode !== "none",
			"a11y-keyboard-nav": settings.value.keyboardNavigation,
			"a11y-focus-indicator": settings.value.focusIndicator,
		};
	});

	const cssVariables = computed(() => {
		const vars: Record<string, string> = {};
		
		if (settings.value.largeText) {
			vars["--slide-font-size"] = "1.5rem";
			vars["--slide-heading-size"] = "3rem";
		}
		
		if (settings.value.highContrast) {
			vars["--slide-bg"] = "#000";
			vars["--slide-text"] = "#fff";
		}
		
		return vars;
	});

	onMounted(() => {
		loadSettings();
		checkPrefersReducedMotion();
	});

	function loadSettings() {
		if (typeof window === "undefined") return;
		
		const stored = localStorage.getItem("wslide:a11y");
		if (stored) {
			settings.value = { ...settings.value, ...JSON.parse(stored) };
		}
	}

	function saveSettings() {
		localStorage.setItem("wslide:a11y", JSON.stringify(settings.value));
	}

	function checkPrefersReducedMotion() {
		if (typeof window === "undefined") return;
		
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (mediaQuery.matches) {
			settings.value.reducedMotion = true;
		}
	}

	function toggleHighContrast() {
		settings.value.highContrast = !settings.value.highContrast;
		saveSettings();
	}

	function toggleLargeText() {
		settings.value.largeText = !settings.value.largeText;
		saveSettings();
	}

	function toggleScreenReader() {
		settings.value.screenReader = !settings.value.screenReader;
		saveSettings();
		if (settings.value.screenReader) {
			announce("Screen reader mode enabled");
		}
	}

	function toggleReducedMotion() {
		settings.value.reducedMotion = !settings.value.reducedMotion;
		saveSettings();
	}

	function setColorBlindMode(mode: AccessibilitySettings["colorBlindMode"]) {
		settings.value.colorBlindMode = mode;
		saveSettings();
	}

	function toggleKeyboardNavigation() {
		settings.value.keyboardNavigation = !settings.value.keyboardNavigation;
		saveSettings();
	}

	function toggleCaptions() {
		settings.value.captions = !settings.value.captions;
		saveSettings();
	}

	function announce(message: string) {
		announceMessage.value = message;
		setTimeout(() => {
			announceMessage.value = "";
		}, 1000);
	}

	function handleKeyNavigation(event: KeyboardEvent, callbacks: {
		next?: () => void;
		prev?: () => void;
		first?: () => void;
		last?: () => void;
	}) {
		if (!settings.value.keyboardNavigation) return;
		
		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
				event.preventDefault();
				callbacks.next?.();
				break;
			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault();
				callbacks.prev?.();
				break;
			case "Home":
				event.preventDefault();
				callbacks.first?.();
				break;
			case "End":
				event.preventDefault();
				callbacks.last?.();
				break;
		}
	}

	function reset() {
		settings.value = {
			highContrast: false,
			largeText: false,
			screenReader: false,
			reducedMotion: false,
			colorBlindMode: "none",
			keyboardNavigation: true,
			captions: false,
			focusIndicator: true,
		};
		saveSettings();
	}

	return {
		settings: readonly(settings),
		announceMessage: readonly(announceMessage),
		isActive: readonly(isActive),
		cssClasses,
		cssVariables,
		toggleHighContrast,
		toggleLargeText,
		toggleScreenReader,
		toggleReducedMotion,
		setColorBlindMode,
		toggleKeyboardNavigation,
		toggleCaptions,
		announce,
		handleKeyNavigation,
		reset,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
