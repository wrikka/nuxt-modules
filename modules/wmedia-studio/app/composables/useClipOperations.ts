export const useClipOperations = (
	videoStore: ReturnType<typeof useVideoStore>,
	currentVideoProject: Ref<import("#shared/types").VideoProject | null>,
	selectedClipId: Ref<string | null>,
	currentTime: Ref<number>
) => {
	const { readMediaMetadata } = useMediaBunny();

	const addVideoTrack = () => videoStore.addTrack("video");
	const addAudioTrack = () => videoStore.addTrack("audio");
	const addTextTrack = () => videoStore.addTrack("text");

	const addVideoClip = async (file: File, trackId: string, startTime: number) => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await $fetch<{ data: { url: string; thumbnailUrl: string } }>("/api/video/upload", { method: "POST", body: formData });
		const metadata = await readMediaMetadata(file);
		videoStore.addClip({
			trackId, startTime, endTime: startTime + metadata.duration, duration: metadata.duration,
			sourceUrl: response.data.url, type: "video", name: file.name, thumbnailUrl: response.data.thumbnailUrl,
		});
	};

	const addImageClip = async (file: File, trackId: string, startTime: number, duration = 5) => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await $fetch<{ data: { url: string } }>("/api/assets/upload", { method: "POST", body: formData });
		videoStore.addClip({
			trackId, startTime, endTime: startTime + duration, duration,
			sourceUrl: response.data.url, type: "image", name: file.name,
		});
	};

	const addAudioClip = async (file: File, trackId: string, startTime: number) => {
		const formData = new FormData();
		formData.append("file", file);
		const response = await $fetch<{ data: { url: string } }>("/api/audio/upload", { method: "POST", body: formData });
		const metadata = await readMediaMetadata(file);
		videoStore.addClip({
			trackId, startTime, endTime: startTime + metadata.duration, duration: metadata.duration,
			sourceUrl: response.data.url, type: "audio", name: file.name,
		});
	};

	const addTextClip = (trackId: string, startTime: number, text: string, duration = 5) => {
		videoStore.addClip({ trackId, startTime, endTime: startTime + duration, duration, sourceUrl: "", type: "text", name: "Text" });
	};

	const deleteSelectedClip = () => {
		if (selectedClipId.value) {
			videoStore.removeClip(selectedClipId.value);
			videoStore.selectClip(null);
		}
	};

	const splitSelectedClip = () => selectedClipId.value && videoStore.splitClip(selectedClipId.value, currentTime.value);

	const trimSelectedClip = (clipId: string, { startTime, endTime }: { startTime: number; endTime: number }) => {
		clipId && videoStore.trimClip(clipId, startTime, endTime);
	};

	const mergeSelectedClips = () => {
		if (!selectedClipId.value || !currentVideoProject.value) return;
		const selectedClip = currentVideoProject.value.clips.find(c => c.id === selectedClipId.value);
		if (!selectedClip) return;
		const trackClips = currentVideoProject.value.clips.filter(c => c.trackId === selectedClip.trackId && c.id !== selectedClipId.value);
		for (const clip of trackClips) {
			if (clip.startTime <= selectedClip.endTime && clip.endTime >= selectedClip.startTime) {
				videoStore.mergeClips(selectedClipId.value, clip.id);
				return;
			}
		}
	};

	const duplicateSelectedClip = () => {
		if (selectedClipId.value && currentVideoProject.value) {
			const clip = videoStore.getClipById(selectedClipId.value);
			if (clip) videoStore.addClip({ ...clip, startTime: clip.endTime, endTime: clip.endTime + clip.duration });
		}
	};

	const getClipsByTrack = (trackId: string): import("#shared/types").VideoClip[] => {
		return currentVideoProject.value?.clips.filter(c => c.trackId === trackId) || [];
	};

	const selectClip = (clipId: string | null) => videoStore.selectClip(clipId);
	const selectTrack = (trackId: string | null) => videoStore.selectTrack(trackId);

	return {
		addVideoTrack, addAudioTrack, addTextTrack, addVideoClip, addImageClip, addAudioClip, addTextClip,
		deleteSelectedClip, splitSelectedClip, trimSelectedClip, mergeSelectedClips, duplicateSelectedClip,
		getClipsByTrack, selectClip, selectTrack,
	};
};
