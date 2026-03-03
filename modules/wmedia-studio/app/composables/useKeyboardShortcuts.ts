import { useMagicKeys } from "@vueuse/core";
import { onMounted } from "vue";

export interface ShortcutConfig {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	meta?: boolean;
	handler: () => void;
	description: string;
	category?: "edit" | "view" | "tools" | "layers" | "export";
}

export const DEFAULT_SHORTCUTS: ShortcutConfig[] = [
	{ key: "z", ctrl: true, handler: () => {}, description: "Undo", category: "edit" },
	{ key: "z", ctrl: true, shift: true, handler: () => {}, description: "Redo", category: "edit" },
	{ key: "c", ctrl: true, handler: () => {}, description: "Copy", category: "edit" },
	{ key: "v", ctrl: true, handler: () => {}, description: "Paste", category: "edit" },
	{ key: "x", ctrl: true, handler: () => {}, description: "Cut", category: "edit" },
	{ key: "a", ctrl: true, handler: () => {}, description: "Select All", category: "edit" },
	{ key: "d", ctrl: true, handler: () => {}, description: "Duplicate", category: "edit" },
	{ key: "Delete", handler: () => {}, description: "Delete", category: "edit" },
	{ key: "Backspace", handler: () => {}, description: "Delete", category: "edit" },
	{ key: "Escape", handler: () => {}, description: "Deselect", category: "edit" },
	{ key: "ArrowUp", handler: () => {}, description: "Move Up", category: "edit" },
	{ key: "ArrowDown", handler: () => {}, description: "Move Down", category: "edit" },
	{ key: "ArrowLeft", handler: () => {}, description: "Move Left", category: "edit" },
	{ key: "ArrowRight", handler: () => {}, description: "Move Right", category: "edit" },
	{ key: "ArrowUp", shift: true, handler: () => {}, description: "Nudge Up", category: "edit" },
	{ key: "ArrowDown", shift: true, handler: () => {}, description: "Nudge Down", category: "edit" },
	{ key: "ArrowLeft", shift: true, handler: () => {}, description: "Nudge Left", category: "edit" },
	{ key: "ArrowRight", shift: true, handler: () => {}, description: "Nudge Right", category: "edit" },
	{ key: "+", handler: () => {}, description: "Zoom In", category: "view" },
	{ key: "-", handler: () => {}, description: "Zoom Out", category: "view" },
	{ key: "0", handler: () => {}, description: "Reset Zoom", category: "view" },
	{ key: "1", handler: () => {}, description: "Fit to Screen", category: "view" },
	{ key: "g", ctrl: true, handler: () => {}, description: "Toggle Grid", category: "view" },
	{ key: "r", ctrl: true, handler: () => {}, description: "Toggle Rulers", category: "view" },
	{ key: "h", ctrl: true, handler: () => {}, description: "Toggle Guides", category: "view" },
	{ key: "l", ctrl: true, handler: () => {}, description: "Toggle Layers", category: "layers" },
	{ key: "p", ctrl: true, handler: () => {}, description: "Toggle Properties", category: "layers" },
	{ key: "[", handler: () => {}, description: "Layer Down", category: "layers" },
	{ key: "]", handler: () => {}, description: "Layer Up", category: "layers" },
	{ key: "[", shift: true, handler: () => {}, description: "Layer to Bottom", category: "layers" },
	{ key: "]", shift: true, handler: () => {}, description: "Layer to Top", category: "layers" },
	{ key: "s", ctrl: true, handler: () => {}, description: "Save", category: "export" },
	{ key: "e", ctrl: true, handler: () => {}, description: "Export", category: "export" },
	{ key: "t", ctrl: true, handler: () => {}, description: "Add Text", category: "tools" },
	{ key: "i", ctrl: true, handler: () => {}, description: "Add Image", category: "tools" },
	{ key: "r", handler: () => {}, description: "Rectangle Tool", category: "tools" },
	{ key: "c", handler: () => {}, description: "Circle Tool", category: "tools" },
	{ key: "l", handler: () => {}, description: "Line Tool", category: "tools" },
	{ key: "f", ctrl: true, handler: () => {}, description: "Find", category: "edit" },
];

export function useKeyboardShortcuts(customShortcuts?: ShortcutConfig[]) {
	const shortcuts = ref<ShortcutConfig[]>(customShortcuts || DEFAULT_SHORTCUTS);
	const keys = useMagicKeys();

	const registerShortcut = (shortcut: ShortcutConfig) => {
		const index = shortcuts.value.findIndex(s =>
			s.key === shortcut.key && s.ctrl === shortcut.ctrl && s.shift === shortcut.shift
		);
		if (index >= 0) {
			shortcuts.value[index] = shortcut;
		} else {
			shortcuts.value.push(shortcut);
		}
	};

	const unregisterShortcut = (key: string, ctrl?: boolean, shift?: boolean) => {
		shortcuts.value = shortcuts.value.filter(
			s => !(s.key === key && s.ctrl === ctrl && s.shift === shift),
		);
	};

	const getShortcutByAction = (description: string): ShortcutConfig | undefined => {
		return shortcuts.value.find(s => s.description === description);
	};

	const getShortcutsByCategory = (category: string): ShortcutConfig[] => {
		return shortcuts.value.filter(s => s.category === category);
	};

	const formatShortcut = (shortcut: ShortcutConfig): string => {
		const parts: string[] = [];
		if (shortcut.ctrl) parts.push("Ctrl");
		if (shortcut.shift) parts.push("Shift");
		if (shortcut.alt) parts.push("Alt");
		if (shortcut.meta) parts.push("Cmd");
		parts.push(shortcut.key);
		return parts.join(" + ");
	};

	const executeShortcut = (shortcut: ShortcutConfig) => {
		shortcut.handler();
	};

	onMounted(() => {
		shortcuts.value.forEach((shortcut) => {
			const keyCombo = [
				shortcut.ctrl && "ctrl",
				shortcut.shift && "shift",
				shortcut.alt && "alt",
				shortcut.meta && "meta",
				shortcut.key.toLowerCase(),
			].filter(Boolean).join("_");

			const keyWatcher = keys[keyCombo as keyof typeof keys];
			if (keyWatcher) {
				watch(keyWatcher, (pressed) => {
					if (pressed) {
						shortcut.handler();
					}
				});
			}
		});
	});

	return {
		shortcuts,
		registerShortcut,
		unregisterShortcut,
		getShortcutByAction,
		getShortcutsByCategory,
		formatShortcut,
		executeShortcut,
	};
}
