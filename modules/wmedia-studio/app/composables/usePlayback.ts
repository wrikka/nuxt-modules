export const usePlayback = (videoStore: ReturnType<typeof useVideoStore>, currentTime: Ref<number>, isPlaying: Ref<boolean>, currentVideoProject: Ref<import("#shared/types").VideoProject | null>) => {
	let playbackInterval: ReturnType<typeof setInterval> | null = null;

	const startPlayback = () => {
		if (playbackInterval) return;
		videoStore.togglePlayback();
		playbackInterval = setInterval(() => {
			if (currentVideoProject.value) {
				const newTime = currentTime.value + 0.033;
				if (newTime >= currentVideoProject.value.duration) {
					stopPlayback();
					videoStore.setCurrentTime(0);
				} else {
					videoStore.setCurrentTime(newTime);
				}
			}
		}, 33);
	};

	const stopPlayback = () => {
		if (playbackInterval) {
			clearInterval(playbackInterval);
			playbackInterval = null;
		}
		if (isPlaying.value) videoStore.togglePlayback();
	};

	const togglePlayback = () => isPlaying.value ? stopPlayback() : startPlayback();
	const seekTo = (time: number) => videoStore.setCurrentTime(time);
	const seekToStart = () => videoStore.setCurrentTime(0);
	const seekToEnd = () => currentVideoProject.value && videoStore.setCurrentTime(currentVideoProject.value.duration);
	const stepForward = () => seekTo(currentTime.value + 0.033);
	const stepBackward = () => seekTo(Math.max(0, currentTime.value - 0.033));

	onUnmounted(() => {
		if (playbackInterval) clearInterval(playbackInterval);
	});

	return { startPlayback, stopPlayback, togglePlayback, seekTo, seekToStart, seekToEnd, stepForward, stepBackward };
};
