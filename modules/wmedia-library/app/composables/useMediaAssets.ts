export const useMediaAssets = (
	videoStore: ReturnType<typeof useVideoStore>,
	currentVideoProject: Ref<import("#shared/types").VideoProject | null>
) => {
	const { readMediaMetadata } = useMediaBunny();

	const addMediaAssetToBin = async (file: File, type: "video" | "audio" | "image") => {
		if (!currentVideoProject.value) return;

		const formData = new FormData();
		formData.append("file", file);

		try {
			const uploadEndpoint = type === "video" ? "/api/video/upload" : "/api/assets/upload";
			const response = await $fetch<{ data: { url: string; thumbnailUrl?: string } }>(uploadEndpoint, {
				method: "POST", body: formData,
			});

			const metadata = await readMediaMetadata(file);
			videoStore.addMediaAsset({
				name: file.name, type, url: response.data.url, thumbnailUrl: response.data.thumbnailUrl,
				duration: metadata.duration, fileSize: file.size, tags: [],
			});
		} catch (error) {
			console.error("Failed to upload media asset:", error);
		}
	};

	const autoTagMediaAsset = async (assetId: string) => {
		if (!currentVideoProject.value) return;

		const asset = currentVideoProject.value.mediaAssets.find(a => a.id === assetId);
		if (!asset || asset.type === "audio") return;

		try {
			const fileResponse = await fetch(asset.url);
			const blob = await fileResponse.blob();
			const file = new File([blob], asset.name, { type: blob.type });

			const formData = new FormData();
			formData.append("file", file);

			const response = await $fetch<{ success: boolean; data: { tags: string[] } }>("/api/ai/auto-tag", {
				method: "POST", body: formData,
			});

			if (response.success) videoStore.updateMediaAsset(assetId, { tags: response.data.tags });
		} catch (error) {
			console.error("Failed to auto-tag asset:", error);
		}
	};

	return { addMediaAssetToBin, autoTagMediaAsset };
};
