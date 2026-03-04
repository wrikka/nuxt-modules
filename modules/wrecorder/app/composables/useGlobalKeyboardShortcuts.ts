export interface KeyboardShortcut {
	id: string;
	key: string;
	modifiers: string[];
	description: string;
	action: () => void;
	enabled: boolean;
	scope?: "global" | "local" | "recording";
	preventDefault?: boolean;
}

export interface ShortcutsState {
	shortcuts: KeyboardShortcut[];
	isEnabled: boolean;
	isRecording: boolean;
	lastPressed?: string;
}

const STORAGE_KEY = "wrecorder-keyboard-shortcuts";

export const useGlobalKeyboardShortcuts = () => {
	const state = reactive<ShortcutsState>({
		shortcuts: [],
		isEnabled: true,
		isRecording: false,
	});

	let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
	let enabledScopes: Set<string> = new Set(["global"]);

	const defaultShortcuts: Omit<KeyboardShortcut, "action">[] = [
		{ id: "start-recording", key: "r", modifiers: ["ctrl"], description: "Start recording", enabled: true, scope: "global", preventDefault: true },
		{ id: "stop-recording", key: "s", modifiers: ["ctrl"], description: "Stop recording", enabled: true, scope: "global", preventDefault: true },
		{ id: "pause-recording", key: "p", modifiers: ["ctrl"], description: "Pause/Resume recording", enabled: true, scope: "global", preventDefault: true },
		{ id: "toggle-mute", key: "m", modifiers: ["ctrl"], description: "Toggle mute", enabled: true, scope: "recording", preventDefault: true },
		{ id: "toggle-camera", key: "c", modifiers: ["ctrl"], description: "Toggle camera", enabled: true, scope: "recording", preventDefault: true },
		{ id: "add-marker", key: "b", modifiers: ["ctrl"], description: "Add chapter marker", enabled: true, scope: "recording", preventDefault: true },
		{ id: "toggle-annotations", key: "a", modifiers: ["ctrl"], description: "Toggle annotations", enabled: true, scope: "recording", preventDefault: true },
		{ id: "save-recording", key: "s", modifiers: ["ctrl", "shift"], description: "Save recording", enabled: true, scope: "global", preventDefault: true },
		{ id: "fullscreen", key: "f", modifiers: ["ctrl"], description: "Toggle fullscreen", enabled: true, scope: "global", preventDefault: true },
		{ id: "escape", key: "escape", modifiers: [], description: "Cancel/Escape", enabled: true, scope: "global", preventDefault: false },
	];

	const loadShortcuts = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				// Merge with defaults to ensure all shortcuts exist
				state.shortcuts = defaultShortcuts.map(def => {
					const saved = parsed.find((p: KeyboardShortcut) => p.id === def.id);
					return {
						...def,
						...saved,
						action: () => {}, // Will be set by registerAction
					};
				});
			} catch {
				resetToDefaults();
			}
		} else {
			resetToDefaults();
		}
	};

	const saveShortcuts = () => {
		if (typeof window === "undefined") return;
		const storable = state.shortcuts.map(s => ({
			id: s.id,
			key: s.key,
			modifiers: s.modifiers,
			description: s.description,
			enabled: s.enabled,
			scope: s.scope,
			preventDefault: s.preventDefault,
		}));
		localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
	};

	const resetToDefaults = () => {
		state.shortcuts = defaultShortcuts.map(def => ({
			...def,
			action: () => {},
		}));
		saveShortcuts();
	};

	const registerAction = (id: string, action: () => void) => {
		const shortcut = state.shortcuts.find(s => s.id === id);
		if (shortcut) {
			shortcut.action = action;
		}
	};

	const updateShortcut = (id: string, updates: Partial<KeyboardShortcut>) => {
		const index = state.shortcuts.findIndex(s => s.id === id);
		if (index !== -1) {
			state.shortcuts[index] = { ...state.shortcuts[index], ...updates };
			saveShortcuts();
		}
	};

	const enableShortcut = (id: string) => {
		updateShortcut(id, { enabled: true });
	};

	const disableShortcut = (id: string) => {
		updateShortcut(id, { enabled: false });
	};

	const setScope = (scope: "global" | "recording" | "local") => {
		enabledScopes.clear();
		enabledScopes.add(scope);
		if (scope === "recording") {
			enabledScopes.add("global");
		}
	};

	const formatShortcut = (shortcut: KeyboardShortcut): string => {
		const mods = shortcut.modifiers.map(m => {
			switch (m) {
				case "ctrl": return "Ctrl";
				case "alt": return "Alt";
				case "shift": return "Shift";
				case "meta": return "Cmd";
				default: return m;
			}
		});
		const key = shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key;
		return [...mods, key].join(" + ");
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (!state.isEnabled) return;

		const pressedKey = e.key.toLowerCase();
		const modifiers: string[] = [];

		if (e.ctrlKey) modifiers.push("ctrl");
		if (e.altKey) modifiers.push("alt");
		if (e.shiftKey) modifiers.push("shift");
		if (e.metaKey) modifiers.push("meta");

		// Find matching shortcut
		const matched = state.shortcuts.find(s => {
			if (!s.enabled) return false;
			if (s.scope && !enabledScopes.has(s.scope)) return false;
			
			const keyMatch = s.key.toLowerCase() === pressedKey;
			const modifiersMatch = 
				s.modifiers.length === modifiers.length &&
				s.modifiers.every(m => modifiers.includes(m));

			return keyMatch && modifiersMatch;
		});

		if (matched) {
			if (matched.preventDefault) {
				e.preventDefault();
			}
			state.lastPressed = matched.id;
			matched.action();
		}
	};

	const startListening = () => {
		if (keydownHandler) return;
		
		keydownHandler = handleKeydown;
		document.addEventListener("keydown", keydownHandler);
	};

	const stopListening = () => {
		if (keydownHandler) {
			document.removeEventListener("keydown", keydownHandler);
			keydownHandler = null;
		}
	};

	const enable = () => {
		state.isEnabled = true;
		startListening();
	};

	const disable = () => {
		state.isEnabled = false;
		stopListening();
	};

	const setRecordingState = (isRecording: boolean) => {
		state.isRecording = isRecording;
		setScope(isRecording ? "recording" : "global");
	};

	const getShortcutById = (id: string): KeyboardShortcut | undefined => {
		return state.shortcuts.find(s => s.id === id);
	};

	const getEnabledShortcuts = (): KeyboardShortcut[] => {
		return state.shortcuts.filter(s => s.enabled);
	};

	// Helper to register common recording actions
	const registerRecordingActions = (actions: {
		startRecording: () => void;
		stopRecording: () => void;
		pauseRecording: () => void;
		toggleMute: () => void;
		toggleCamera: () => void;
		addMarker: () => void;
		toggleAnnotations: () => void;
		saveRecording: () => void;
		toggleFullscreen: () => void;
		escape: () => void;
	}) => {
		registerAction("start-recording", actions.startRecording);
		registerAction("stop-recording", actions.stopRecording);
		registerAction("pause-recording", actions.pauseRecording);
		registerAction("toggle-mute", actions.toggleMute);
		registerAction("toggle-camera", actions.toggleCamera);
		registerAction("add-marker", actions.addMarker);
		registerAction("toggle-annotations", actions.toggleAnnotations);
		registerAction("save-recording", actions.saveRecording);
		registerAction("fullscreen", actions.toggleFullscreen);
		registerAction("escape", actions.escape);
	};

	onMounted(() => {
		loadShortcuts();
		startListening();
	});

	onUnmounted(() => {
		stopListening();
	});

	return {
		state: readonly(state),
		shortcuts: computed(() => state.shortcuts),
		enabledShortcuts: computed(() => getEnabledShortcuts()),
		lastPressed: computed(() => state.lastPressed),
		registerAction,
		registerRecordingActions,
		updateShortcut,
		enableShortcut,
		disableShortcut,
		setScope,
		formatShortcut,
		enable,
		disable,
		setRecordingState,
		getShortcutById,
		resetToDefaults,
		loadShortcuts,
		saveShortcuts,
		startListening,
		stopListening,
	};
};
