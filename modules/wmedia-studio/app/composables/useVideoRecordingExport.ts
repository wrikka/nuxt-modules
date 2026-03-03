import type { Recording } from "../components/video-recording/types";
import type { RecordingExportOptions } from "./useVideoExport";

export interface UseVideoRecordingExportOptions {
	onExportStart?: () => void;
	onExportComplete?: (blob: Blob) => void;
	onExportError?: (error: Error) => void;
}

export const useVideoRecordingExport = (options: UseVideoRecordingExportOptions = {}) => {
	const { exportRecording } = useVideoExport();
	const { initDB, saveRecording, loadRecordings, deleteRecording: deleteFromDB } = useIndexedDB();

	const recordings = ref<Recording[]>([]);
	const selectedRecording = ref<Recording | null>(null);
	const showExportDialog = ref(false);
	const showTrimEditor = ref(false);

	// Load recordings on mount
	const loadAllRecordings = async (): Promise<void> => {
		try {
			await initDB();
			const saved = await loadRecordings();
			recordings.value = saved;
		} catch (error) {
			console.error("Failed to load recordings:", error);
		}
	};

	const addRecording = async (recording: Recording, mimeType: string): Promise<void> => {
		recordings.value.unshift(recording);
		try {
			await saveRecording(recording, mimeType);
		} catch (error) {
			console.error("Failed to save recording:", error);
		}
	};

	const deleteRecording = async (recording: Recording): Promise<void> => {
		const index = recordings.value.findIndex((r) => r.id === recording.id);
		if (index > -1) {
			URL.revokeObjectURL(recording.url);
			recordings.value.splice(index, 1);
			try {
				await deleteFromDB(recording.id);
			} catch (error) {
				console.error("Failed to delete recording:", error);
			}
		}
	};

	const downloadRecording = (recording: Recording): void => {
		const a = document.createElement("a");
		a.href = recording.url;
		a.download = `${recording.name}.webm`;
		a.click();
	};

	const previewRecording = (recording: Recording): void => {
		window.open(recording.url, "_blank");
	};

	const uploadRecording = async (recording: Recording): Promise<void> => {
		try {
			const formData = new FormData();
			formData.append("file", recording.blob, `${recording.name}.webm`);

			const response = await $fetch("/api/video/upload", {
				method: "POST",
				body: formData,
			});

			console.log("Upload response:", response);
		} catch (error) {
			console.error("Error uploading video:", error);
			throw error;
		}
	};

	const openExportDialog = (recording: Recording): void => {
		selectedRecording.value = recording;
		showExportDialog.value = true;
	};

	const openTrimEditor = (recording: Recording): void => {
		selectedRecording.value = recording;
		showTrimEditor.value = true;
	};

	const handleExport = async (
		recording: Recording,
		options: RecordingExportOptions,
	): Promise<void> => {
		try {
			options.onExportStart?.();
			const exportedBlob = await exportRecording(
				recording.blob,
				options,
				(progress) => {
					console.log(`Export progress: ${progress.percentage}%`);
				},
			);

			// Download the exported file
			const url = URL.createObjectURL(exportedBlob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${recording.name}.${options.format}`;
			a.click();
			URL.revokeObjectURL(url);

			options.onExportComplete?.(exportedBlob);
		} catch (error) {
			console.error("Export failed:", error);
			options.onExportError?.(error as Error);
			throw error;
		}
	};

	const handleTrimSave = async (blob: Blob, name: string): Promise<Recording> => {
		const recording: Recording = {
			id: crypto.randomUUID(),
			blob,
			url: URL.createObjectURL(blob),
			duration: 0,
			timestamp: Date.now(),
			name,
		};
		recordings.value.unshift(recording);
		await saveRecording(recording, blob.type);
		showTrimEditor.value = false;
		return recording;
	};

	const cleanup = (): void => {
		recordings.value.forEach((recording) => {
			URL.revokeObjectURL(recording.url);
		});
	};

	onUnmounted(() => {
		cleanup();
	});

	return {
		// State
		recordings,
		selectedRecording,
		showExportDialog,
		showTrimEditor,
		// Actions
		loadAllRecordings,
		addRecording,
		deleteRecording,
		downloadRecording,
		previewRecording,
		uploadRecording,
		openExportDialog,
		openTrimEditor,
		handleExport,
		handleTrimSave,
		cleanup,
	};
};
