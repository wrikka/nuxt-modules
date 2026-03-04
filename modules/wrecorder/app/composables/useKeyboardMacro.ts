import { reactive, readonly, computed } from "vue";

export interface MacroAction {
	type: "keydown" | "keyup" | "click" | "wait" | "scroll";
	key?: string;
	modifiers?: string[];
	x?: number;
	y?: number;
	delay?: number;
	duration?: number;
}

export interface KeyboardMacro {
	id: string;
	name: string;
	actions: MacroAction[];
	createdAt: number;
	isRecording: boolean;
	loop: boolean;
	playbackSpeed: number;
}

export interface KeyboardMacroState {
	macros: KeyboardMacro[];
	isRecording: boolean;
	currentMacro?: KeyboardMacro;
	isPlaying: boolean;
}

const STORAGE_KEY = "wrecorder-keyboard-macros";

export const useKeyboardMacro = () => {
	const state = reactive<KeyboardMacroState>({
		macros: [],
		isRecording: false,
		isPlaying: false,
	});

	let recordedActions: MacroAction[] = [];
	let recordingStartTime = 0;
	let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
	let keyupHandler: ((e: KeyboardEvent) => void) | null = null;
	let clickHandler: ((e: MouseEvent) => void) | null = null;

	const loadMacros = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				state.macros = JSON.parse(stored).map((m: KeyboardMacro) => ({
					...m,
					isRecording: false,
				}));
			} catch {
				state.macros = [];
			}
		}
	};

	const saveMacros = () => {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.macros.map(m => ({
			id: m.id,
			name: m.name,
			actions: m.actions,
			createdAt: m.createdAt,
			loop: m.loop,
			playbackSpeed: m.playbackSpeed,
		}))));
	};

	const createMacro = (name: string): string => {
		const id = `macro-${Date.now()}`;
		const macro: KeyboardMacro = {
			id,
			name,
			actions: [],
			createdAt: Date.now(),
			isRecording: false,
			loop: false,
			playbackSpeed: 1,
		};
		state.macros.push(macro);
		return id;
	};

	const startRecording = (macroId: string): boolean => {
		const macro = state.macros.find(m => m.id === macroId);
		if (!macro || state.isRecording) return false;

		state.isRecording = true;
		state.currentMacro = macro;
		macro.isRecording = true;
		recordedActions = [];
		recordingStartTime = Date.now();

		// Setup event listeners
		keydownHandler = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				stopRecording();
				return;
			}

			const action: MacroAction = {
				type: "keydown",
				key: e.key,
				modifiers: [],
				delay: Date.now() - recordingStartTime,
			};

			if (e.ctrlKey) action.modifiers?.push("ctrl");
			if (e.altKey) action.modifiers?.push("alt");
			if (e.shiftKey) action.modifiers?.push("shift");
			if (e.metaKey) action.modifiers?.push("meta");

			recordedActions.push(action);
		};

		keyupHandler = (e: KeyboardEvent) => {
			const action: MacroAction = {
				type: "keyup",
				key: e.key,
				delay: Date.now() - recordingStartTime,
			};
			recordedActions.push(action);
		};

		clickHandler = (e: MouseEvent) => {
			const action: MacroAction = {
				type: "click",
				x: e.clientX,
				y: e.clientY,
				delay: Date.now() - recordingStartTime,
			};
			recordedActions.push(action);
		};

		document.addEventListener("keydown", keydownHandler);
		document.addEventListener("keyup", keyupHandler);
		document.addEventListener("click", clickHandler);

		return true;
	};

	const stopRecording = () => {
		if (!state.isRecording || !state.currentMacro) return;

		// Remove listeners
		if (keydownHandler) document.removeEventListener("keydown", keydownHandler);
		if (keyupHandler) document.removeEventListener("keyup", keyupHandler);
		if (clickHandler) document.removeEventListener("click", clickHandler);

		state.currentMacro.actions = recordedActions;
		state.currentMacro.isRecording = false;
		state.isRecording = false;

		saveMacros();
	};

	const playMacro = async (macroId: string): Promise<boolean> => {
		const macro = state.macros.find(m => m.id === macroId);
		if (!macro || state.isPlaying) return false;

		state.isPlaying = true;

		try {
			for (const action of macro.actions) {
				if (!state.isPlaying) break;

				const delay = (action.delay || 0) / macro.playbackSpeed;
				await new Promise(resolve => setTimeout(resolve, delay));

				switch (action.type) {
					case "keydown":
						// Simulate keydown
						console.log(`Key down: ${action.key}`);
						break;
					case "keyup":
						console.log(`Key up: ${action.key}`);
						break;
					case "click":
						console.log(`Click at: ${action.x}, ${action.y}`);
						break;
				}
			}

			return true;
		} finally {
			state.isPlaying = false;
		}
	};

	const stopPlayback = () => {
		state.isPlaying = false;
	};

	const deleteMacro = (macroId: string) => {
		state.macros = state.macros.filter(m => m.id !== macroId);
		if (state.currentMacro?.id === macroId) {
			state.currentMacro = undefined;
		}
		saveMacros();
	};

	const setMacroLoop = (macroId: string, loop: boolean) => {
		const macro = state.macros.find(m => m.id === macroId);
		if (macro) {
			macro.loop = loop;
			saveMacros();
		}
	};

	const setMacroSpeed = (macroId: string, speed: number) => {
		const macro = state.macros.find(m => m.id === macroId);
		if (macro) {
			macro.playbackSpeed = Math.max(0.1, Math.min(3, speed));
			saveMacros();
		}
	};

	onMounted(() => {
		loadMacros();
	});

	return {
		state: readonly(state),
		createMacro,
		startRecording,
		stopRecording,
		playMacro,
		stopPlayback,
		deleteMacro,
		setMacroLoop,
		setMacroSpeed,
	};
};
