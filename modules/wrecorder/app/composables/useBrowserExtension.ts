export interface ExtensionConfig {
	enabled: boolean;
	shortcutKey: string;
	showInToolbar: boolean;
	startOnClick: boolean;
	captureMode: "screen" | "tab" | "area";
}

export interface ExtensionState {
	isInstalled: boolean;
	isSupported: boolean;
	config: ExtensionConfig;
	lastError?: string;
}

const STORAGE_KEY = "wrecorder-extension-config";
const EXTENSION_ID = "wrecorder-extension";

export const useBrowserExtension = () => {
	const defaultConfig: ExtensionConfig = {
		enabled: true,
		shortcutKey: "Ctrl+Shift+R",
		showInToolbar: true,
		startOnClick: true,
		captureMode: "screen",
	};

	const state = reactive<ExtensionState>({
		isInstalled: false,
		isSupported: typeof chrome !== "undefined" && !!chrome.runtime,
		config: { ...defaultConfig },
	});

	const loadConfig = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				state.config = { ...defaultConfig, ...JSON.parse(stored) };
			} catch {
				state.config = { ...defaultConfig };
			}
		}
	};

	const saveConfig = () => {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
		
		// ส่ง message ไปยัง extension
		sendMessageToExtension({ type: "UPDATE_CONFIG", config: state.config });
	};

	const checkInstallation = (): boolean => {
		if (typeof chrome === "undefined" || !chrome.runtime) {
			state.isSupported = false;
			return false;
		}

		try {
			chrome.runtime.sendMessage(EXTENSION_ID, { type: "PING" }, (response) => {
				state.isInstalled = !!response;
			});
		} catch {
			state.isInstalled = false;
		}

		return state.isInstalled;
	};

	const sendMessageToExtension = (message: Record<string, unknown>) => {
		if (!state.isSupported || !state.isInstalled) return;

		try {
			chrome.runtime.sendMessage(EXTENSION_ID, message);
		} catch (error) {
			state.lastError = error instanceof Error ? error.message : "Failed to send message";
		}
	};

	const setConfig = (config: Partial<ExtensionConfig>) => {
		Object.assign(state.config, config);
		saveConfig();
	};

	const enable = () => {
		state.config.enabled = true;
		saveConfig();
	};

	const disable = () => {
		state.config.enabled = false;
		saveConfig();
	};

	const triggerRecording = () => {
		sendMessageToExtension({
			type: "START_RECORDING",
			mode: state.config.captureMode,
		});
	};

	const stopRecording = () => {
		sendMessageToExtension({ type: "STOP_RECORDING" });
	};

	const installExtension = () => {
		// เปิด Chrome Web Store หรือแสดงคำแนะนำการติดตั้ง
		if (typeof window !== "undefined") {
			window.open("https://chrome.google.com/webstore", "_blank");
		}
	};

	// รับ message จาก extension
	const setupMessageListener = () => {
		if (typeof chrome === "undefined" || !chrome.runtime) return;

		chrome.runtime.onMessageExternal?.addListener((message, sender, sendResponse) => {
			if (sender.id !== EXTENSION_ID) return;

			switch (message.type) {
				case "EXTENSION_INSTALLED":
					state.isInstalled = true;
					sendResponse({ success: true });
					break;
				case "RECORDING_STARTED":
					// Handle recording started
					console.log("Extension recording started");
					break;
				case "RECORDING_STOPPED":
					// Handle recording stopped
					console.log("Extension recording stopped", message.data);
					break;
			}
		});
	};

	// สร้าง manifest สำหรับ extension
	const generateExtensionManifest = (): string => {
		return JSON.stringify({
			manifest_version: 3,
			name: "WRecorder Extension",
			version: "1.0.0",
			description: "Quick screen recording from browser toolbar",
			permissions: ["activeTab", "desktopCapture", "storage"],
			action: {
				default_popup: "popup.html",
				default_icon: {
					"16": "icons/icon16.png",
					"48": "icons/icon48.png",
					"128": "icons/icon128.png",
				},
			},
			background: {
				service_worker: "background.js",
			},
			icons: {
				"16": "icons/icon16.png",
				"48": "icons/icon48.png",
				"128": "icons/icon128.png",
			},
			commands: {
				_start_recording: {
					suggested_key: {
						default: state.config.shortcutKey,
					},
					description: "Start screen recording",
				},
			},
			externally_connectable: {
				matches: ["*://localhost/*", "*://*.wrikka.com/*"],
			},
		}, null, 2);
	};

	// สร้าง background script สำหรับ extension
	const generateBackgroundScript = (): string => {
		return `
chrome.action.onClicked.addListener(async (tab) => {
  chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_RECORDING" });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "_start_recording") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "START_RECORDING" });
    });
  }
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.type === "PING") {
    sendResponse({ installed: true });
  } else if (request.type === "UPDATE_CONFIG") {
    chrome.storage.local.set({ config: request.config });
    sendResponse({ success: true });
  }
  return true;
});
		`.trim();
	};

	const downloadExtensionFiles = () => {
		const files = [
			{ name: "manifest.json", content: generateExtensionManifest() },
			{ name: "background.js", content: generateBackgroundScript() },
		];

		files.forEach(file => {
			const blob = new Blob([file.content], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = file.name;
			a.click();
			URL.revokeObjectURL(url);
		});
	};

	onMounted(() => {
		loadConfig();
		setupMessageListener();
		checkInstallation();
	});

	return {
		state: readonly(state),
		config: computed(() => state.config),
		isInstalled: computed(() => state.isInstalled),
		isSupported: computed(() => state.isSupported),
		setConfig,
		enable,
		disable,
		triggerRecording,
		stopRecording,
		installExtension,
		checkInstallation,
		generateExtensionManifest,
		generateBackgroundScript,
		downloadExtensionFiles,
	};
};
