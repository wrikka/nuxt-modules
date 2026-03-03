import type { DesignToken } from "#shared/types/element";
import { computed, ref } from "vue";

export interface DesignerCommand {
	id: string;
	label: string;
	shortcut?: string;
	action: () => void;
}

export interface UseDesignerCommandsOptions {
	onUndo?: () => void;
	onRedo?: () => void;
	onSave?: () => void;
	onDuplicate?: () => void;
	onDelete?: () => void;
	onZoomIn?: () => void;
	onZoomOut?: () => void;
	onResetZoom?: () => void;
	onToggleFullscreen?: () => void;
	onToggleTokens?: () => void;
	onAddText?: () => void;
	onAddRectangle?: () => void;
	onAddCircle?: () => void;
	onOpenCommandPalette?: () => void;
}

export const useDesignerCommands = (options: UseDesignerCommandsOptions) => {
	const commandPaletteRef = ref<{ openPalette: () => void } | null>(null);

	const commands = computed<DesignerCommand[]>(() => [
		{ id: "undo", label: "Undo", shortcut: "Ctrl+Z", action: () => options.onUndo?.() },
		{ id: "redo", label: "Redo", shortcut: "Ctrl+Y", action: () => options.onRedo?.() },
		{ id: "save", label: "Save Project", shortcut: "Ctrl+S", action: () => options.onSave?.() },
		{ id: "duplicate", label: "Duplicate Selected", shortcut: "Ctrl+D", action: () => options.onDuplicate?.() },
		{ id: "delete", label: "Delete Selected", shortcut: "Delete", action: () => options.onDelete?.() },
		{ id: "zoom-in", label: "Zoom In", shortcut: "Ctrl++", action: () => options.onZoomIn?.() },
		{ id: "zoom-out", label: "Zoom Out", shortcut: "Ctrl+-", action: () => options.onZoomOut?.() },
		{ id: "reset-zoom", label: "Reset Zoom", shortcut: "Ctrl+0", action: () => options.onResetZoom?.() },
		{ id: "toggle-fullscreen", label: "Toggle Fullscreen", shortcut: "F11", action: () => options.onToggleFullscreen?.() },
		{ id: "toggle-tokens", label: "Toggle Design Tokens", action: () => options.onToggleTokens?.() },
		{ id: "add-text", label: "Add Text", action: () => options.onAddText?.() },
		{ id: "add-rectangle", label: "Add Rectangle", action: () => options.onAddRectangle?.() },
		{ id: "add-circle", label: "Add Circle", action: () => options.onAddCircle?.() },
	]);

	const openCommandPalette = () => {
		commandPaletteRef.value?.openPalette();
	};

	const handleKeydown = (e: KeyboardEvent) => {
		const isEditableTarget = (target: EventTarget | null) => {
			const el = target as HTMLElement | null;
			if (!el) return false;
			const tag = el.tagName?.toLowerCase();
			if (tag === "input" || tag === "textarea" || tag === "select") return true;
			return el.isContentEditable === true;
		};

		if (isEditableTarget(e.target)) return;

		const mod = e.ctrlKey || e.metaKey;
		if (mod && (e.key === "z" || e.key === "Z") && !e.shiftKey) {
			e.preventDefault();
			options.onUndo?.();
			return;
		}
		if (mod && ((e.key === "y" || e.key === "Y") || (e.shiftKey && (e.key === "z" || e.key === "Z")))) {
			e.preventDefault();
			options.onRedo?.();
			return;
		}
		if (mod && (e.key === "s" || e.key === "S")) {
			e.preventDefault();
			options.onSave?.();
			return;
		}
		if (mod && (e.key === "d" || e.key === "D")) {
			e.preventDefault();
			options.onDuplicate?.();
			return;
		}
		if (mod && (e.key === "+" || e.key === "=")) {
			e.preventDefault();
			options.onZoomIn?.();
			return;
		}
		if (mod && e.key === "-") {
			e.preventDefault();
			options.onZoomOut?.();
			return;
		}
		if (mod && e.key === "0") {
			e.preventDefault();
			options.onResetZoom?.();
			return;
		}
		if (e.key === "Delete" || e.key === "Backspace") {
			e.preventDefault();
			options.onDelete?.();
			return;
		}
		if (mod && e.key === "k") {
			e.preventDefault();
			openCommandPalette();
			return;
		}
	};

	return {
		commands,
		commandPaletteRef,
		openCommandPalette,
		handleKeydown,
	};
};
