import { useStorage } from "@vueuse/core";

export function useReadingProgress(contentPath: string) {
	const progress = useStorage(`reading-progress-${contentPath}`, 0);
	const lastPosition = useStorage(`reading-position-${contentPath}`, 0);

	const updateProgress = (position: number, total: number) => {
		const percentage = Math.min(100, Math.round((position / total) * 100));
		progress.value = percentage;
		lastPosition.value = position;
	};

	const resetProgress = () => {
		progress.value = 0;
		lastPosition.value = 0;
	};

	return {
		progress,
		lastPosition,
		updateProgress,
		resetProgress,
	};
}
