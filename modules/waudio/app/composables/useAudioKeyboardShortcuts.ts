import { onMounted, onUnmounted } from "vue";

export const useAudioKeyboardShortcuts = () => {
	const handleKeyDown = (event: KeyboardEvent) => {
		const {
			isPlaying,
			play,
			pause,
			stop,
			undo,
			redo,
			copyClip,
			pasteClip,
			cutClip,
			deleteClip,
			selectedClipId,
			selectedTrackId,
		} = useAudioEditor();

		if (event.ctrlKey || event.metaKey) {
			switch (event.key.toLowerCase()) {
				case "z":
					event.preventDefault();
					if (event.shiftKey) {
						redo();
					} else {
						undo();
					}
					break;
				case "y":
					event.preventDefault();
					redo();
					break;
				case "c":
					if (selectedClipId.value && selectedTrackId.value) {
						event.preventDefault();
						copyClip(selectedClipId.value, selectedTrackId.value);
					}
					break;
				case "x":
					if (selectedClipId.value && selectedTrackId.value) {
						event.preventDefault();
						cutClip(selectedClipId.value, selectedTrackId.value);
					}
					break;
				case "v":
					if (selectedTrackId.value) {
						event.preventDefault();
						pasteClip(selectedTrackId.value);
					}
					break;
				case "s":
					event.preventDefault();
					const { saveProject } = useAudioEditor();
					saveProject();
					break;
			}
		} else {
			switch (event.key.toLowerCase()) {
				case " ":
					event.preventDefault();
					if (isPlaying.value) {
						pause();
					} else {
						void play();
					}
					break;
				case "escape":
					event.preventDefault();
					stop();
					break;
				case "delete":
				case "backspace":
					if (selectedClipId.value && selectedTrackId.value) {
						event.preventDefault();
						deleteClip(selectedClipId.value, selectedTrackId.value);
					}
					break;
				case "home":
					event.preventDefault();
					const { seek } = useAudioEditor();
					seek(0);
					break;
				case "end":
					event.preventDefault();
					const { duration, seek: seekEnd } = useAudioEditor();
					seekEnd(duration.value);
					break;
				case "arrowleft":
					event.preventDefault();
					const { currentTime: ct1, seek: seekLeft } = useAudioEditor();
					seekLeft(Math.max(0, ct1.value - 1));
					break;
				case "arrowright":
					event.preventDefault();
					const { currentTime: ct2, duration: dur, seek: seekRight } = useAudioEditor();
					seekRight(Math.min(dur.value, ct2.value + 1));
					break;
			}
		}
	};

	onMounted(() => {
		window.addEventListener("keydown", handleKeyDown);
	});

	onUnmounted(() => {
		window.removeEventListener("keydown", handleKeyDown);
	});

	return {
		handleKeyDown,
	};
};
