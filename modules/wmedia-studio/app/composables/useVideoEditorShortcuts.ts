interface Shortcut {
	id: string;
	action: string;
	keys: string[];
	description: string;
	category: string;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
	{ id: "play", action: "Play/Pause", keys: ["Space"], description: "Toggle playback", category: "playback" },
	{
		id: "step-back",
		action: "Step Backward",
		keys: ["Shift", "ArrowLeft"],
		description: "Step backward 1 frame",
		category: "playback",
	},
	{
		id: "step-forward",
		action: "Step Forward",
		keys: ["Shift", "ArrowRight"],
		description: "Step forward 1 frame",
		category: "playback",
	},
	{
		id: "seek-back",
		action: "Seek Backward",
		keys: ["ArrowLeft"],
		description: "Seek backward",
		category: "navigation",
	},
	{
		id: "seek-forward",
		action: "Seek Forward",
		keys: ["ArrowRight"],
		description: "Seek forward",
		category: "navigation",
	},
	{ id: "start", action: "Go to Start", keys: ["Home"], description: "Go to start", category: "navigation" },
	{ id: "end", action: "Go to End", keys: ["End"], description: "Go to end", category: "navigation" },
	{ id: "delete", action: "Delete Clip", keys: ["Delete"], description: "Delete selected clip", category: "editing" },
	{ id: "save", action: "Save Project", keys: ["Ctrl", "S"], description: "Save project", category: "editing" },
	{
		id: "duplicate",
		action: "Duplicate",
		keys: ["Ctrl", "D"],
		description: "Duplicate selected clip",
		category: "editing",
	},
	{ id: "split", action: "Split Clip", keys: ["K"], description: "Split clip at playhead", category: "editing" },
	{ id: "deselect", action: "Deselect All", keys: ["Escape"], description: "Deselect all", category: "editing" },
];

export const useVideoEditorShortcuts = () => {
	const { registerShortcut } = useKeyboardShortcuts();
	const videoStore = useVideoStore();
	const {
		togglePlayback,
		seekTo,
		seekToStart,
		seekToEnd,
		deleteSelectedClip,
		splitSelectedClip,
		duplicateSelectedClip,
	} = useVideoEditor();

	const shortcuts = ref<Shortcut[]>([...DEFAULT_SHORTCUTS]);
	const isRecording = ref(false);
	const recordingKey = ref<string | null>(null);

	const setupShortcuts = () => {
		registerShortcut({
			key: " ",
			handler: togglePlayback,
			description: "Play/Pause",
			category: "edit",
		});

		registerShortcut({
			key: "ArrowLeft",
			shift: true,
			handler: () => seekTo(videoStore.currentTime - 1),
			description: "Step backward",
			category: "edit",
		});

		registerShortcut({
			key: "ArrowRight",
			shift: true,
			handler: () => seekTo(videoStore.currentTime + 1),
			description: "Step forward",
			category: "edit",
		});

		registerShortcut({
			key: "ArrowLeft",
			handler: () => seekTo(videoStore.currentTime - 0.1),
			description: "Seek backward (small)",
			category: "edit",
		});

		registerShortcut({
			key: "ArrowRight",
			handler: () => seekTo(videoStore.currentTime + 0.1),
			description: "Seek forward (small)",
			category: "edit",
		});

		registerShortcut({
			key: "Home",
			handler: seekToStart,
			description: "Go to start",
			category: "edit",
		});

		registerShortcut({
			key: "End",
			handler: seekToEnd,
			description: "Go to end",
			category: "edit",
		});

		registerShortcut({
			key: "Delete",
			handler: deleteSelectedClip,
			description: "Delete selected clip",
			category: "edit",
		});

		registerShortcut({
			key: "Backspace",
			handler: deleteSelectedClip,
			description: "Delete selected clip",
			category: "edit",
		});

		registerShortcut({
			key: "s",
			ctrl: true,
			handler: async () => {
				try {
					await videoStore.saveProject();
				} catch (error) {
					console.error("Failed to save project:", error);
				}
			},
			description: "Save project",
			category: "export",
		});

		registerShortcut({
			key: "d",
			ctrl: true,
			handler: duplicateSelectedClip,
			description: "Duplicate selected clip",
			category: "edit",
		});

		registerShortcut({
			key: "k",
			handler: splitSelectedClip,
			description: "Split clip at playhead",
			category: "edit",
		});

		registerShortcut({
			key: "Escape",
			handler: () => {
				videoStore.selectClip(null);
				videoStore.selectTrack(null);
			},
			description: "Deselect all",
			category: "edit",
		});

		registerShortcut({
			key: "+",
			ctrl: true,
			handler: () => {
			},
			description: "Zoom in",
			category: "view",
		});

		registerShortcut({
			key: "-",
			ctrl: true,
			handler: () => {
			},
			description: "Zoom out",
			category: "view",
		});

		registerShortcut({
			key: "0",
			ctrl: true,
			handler: () => {
			},
			description: "Reset zoom",
			category: "view",
		});
	};

	const updateShortcut = (shortcutId: string, newKeys: string[]) => {
		const shortcut = shortcuts.value.find(s => s.id === shortcutId);
		if (shortcut) {
			shortcut.keys = newKeys;
		}
	};

	const resetToDefaults = () => {
		shortcuts.value = [...DEFAULT_SHORTCUTS];
	};

	const startRecording = (shortcutId: string) => {
		isRecording.value = true;
		recordingKey.value = shortcutId;
	};

	const stopRecording = () => {
		isRecording.value = false;
		recordingKey.value = null;
	};

	return {
		shortcuts,
		updateShortcut,
		resetToDefaults,
		isRecording,
		startRecording,
		stopRecording,
		setupShortcuts,
	};
};
