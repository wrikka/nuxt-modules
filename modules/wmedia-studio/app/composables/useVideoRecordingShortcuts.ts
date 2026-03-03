import { onKeyStroke } from "@vueuse/core";

export interface VideoRecordingShortcuts {
	start: () => void;
	stop: () => void;
	pause: () => void;
	resume: () => void;
}

export interface UseVideoRecordingShortcutsOptions {
	onStart?: () => void;
	onStop?: () => void;
	onPause?: () => void;
	onResume?: () => void;
	onTogglePause?: () => void;
	enabled?: Ref<boolean>;
}

export const useVideoRecordingShortcuts = (options: UseVideoRecordingShortcutsOptions = {}) => {
	const { onStart, onStop, onPause, onResume, onTogglePause, enabled = ref(true) } = options;

	// R - Start recording (with countdown)
	onKeyStroke("r", (e) => {
		if (!enabled.value) return;
		e.preventDefault();
		onStart?.();
	});

	// S - Stop recording
	onKeyStroke("s", (e) => {
		if (!enabled.value) return;
		e.preventDefault();
		onStop?.();
	});

	// P - Pause/Resume
	onKeyStroke("p", (e) => {
		if (!enabled.value) return;
		e.preventDefault();
		onTogglePause?.();
	});

	// Space - Pause/Resume (alternative)
	onKeyStroke(" ", (e) => {
		if (!enabled.value) return;
		e.preventDefault();
		onTogglePause?.();
	});

	return {
		enabled,
	};
};
