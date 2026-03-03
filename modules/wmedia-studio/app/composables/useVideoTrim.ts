export const useVideoTrim = () => {
	const isTrimming = ref(false);
	const trimStart = ref(0);
	const trimEnd = ref(0);
	const videoDuration = ref(0);
	const progress = ref(0);
	const error = ref<string | null>(null);

	const loadVideo = async (blob: Blob): Promise<HTMLVideoElement> => {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video");
			video.preload = "metadata";

			video.onloadedmetadata = () => {
				videoDuration.value = video.duration;
				trimEnd.value = video.duration;
				resolve(video);
			};

			video.onerror = () => {
				reject(new Error("Failed to load video"));
			};

			video.src = URL.createObjectURL(blob);
		});
	};

	const trimVideo = async (
		inputBlob: Blob,
		startTime: number,
		endTime: number,
		onProgress?: (progress: number) => void,
	): Promise<Blob> => {
		isTrimming.value = true;
		progress.value = 0;
		error.value = null;

		try {
			const video = await loadVideo(inputBlob);

			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				throw new Error("Failed to get canvas context");
			}

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const fps = 30;
			const totalFrames = Math.floor((endTime - startTime) * fps);
			const trimmedFrames: Blob[] = [];

			for (let frame = 0; frame < totalFrames; frame++) {
				const currentTime = startTime + frame / fps;
				video.currentTime = currentTime;

				await new Promise<void>((resolve) => {
					video.onseeked = () => {
						ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
						canvas.toBlob((blob) => {
							if (blob) {
								trimmedFrames.push(blob);
							}
							resolve();
						}, "image/webp");
					};
				});

				progress.value = Math.round((frame / totalFrames) * 100);
				if (onProgress) {
					onProgress(progress.value);
				}
			}

			const trimmedBlob = new Blob(trimmedFrames, { type: "video/webm" });

			isTrimming.value = false;
			return trimmedBlob;
		} catch (err) {
			error.value = "Failed to trim video";
			console.error("Error trimming video:", err);
			isTrimming.value = false;
			throw err;
		}
	};

	return {
		isTrimming,
		trimStart,
		trimEnd,
		videoDuration,
		progress,
		error,
		loadVideo,
		trimVideo,
	};
};
