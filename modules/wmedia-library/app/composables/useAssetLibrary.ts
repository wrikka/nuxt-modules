import type { Asset as SharedAsset } from "#shared/types/template";

interface LibraryAsset extends Omit<SharedAsset, "type"> {
	type: "image" | "video" | "font" | "icon" | "other";
	thumbnail: string;
	mimeType: string;
	size: number;
	width?: number;
	height?: number;
	duration?: number;
	folderId?: string;
	ownerId: string;
	metadata?: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
}

export type { LibraryAsset };

export interface UploadProgress {
	assetId: string;
	fileName: string;
	progress: number;
	status: "uploading" | "processing" | "completed" | "error";
	error?: string;
}

export function useAssetLibrary() {
	const assets = ref<LibraryAsset[]>([]);
	const isLoading = ref(false);
	const uploadQueue = ref<UploadProgress[]>([]);
	const selectedAssets = ref<Set<string>>(new Set());

	const images = computed(() => assets.value.filter(a => a.type === "image"));
	const videos = computed(() => assets.value.filter(a => a.type === "video"));
	const fonts = computed(() => assets.value.filter(a => a.type === "font"));
	const icons = computed(() => assets.value.filter(a => a.type === "icon"));
	const others = computed(() => assets.value.filter(a => a.type === "other"));

	const hasAssets = computed(() => assets.value.length > 0);
	const selectedCount = computed(() => selectedAssets.value.size);

	const loadAssets = async (folderId?: string) => {
		isLoading.value = true;
		try {
			const params = folderId ? { folderId } : {};
			const data = await $fetch<{ assets: LibraryAsset[] }>("/api/assets", { params });
			assets.value = data.assets || [];
		} catch (error) {
			console.error("Failed to load assets:", error);
			assets.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const uploadAsset = async (
		file: File,
		folderId?: string,
		onProgress?: (progress: number) => void,
	): Promise<LibraryAsset | null> => {
		const assetId = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const uploadProgress: UploadProgress = {
			assetId,
			fileName: file.name,
			progress: 0,
			status: "uploading",
		};
		uploadQueue.value.push(uploadProgress);

		try {
			const formData = new FormData();
			formData.append("file", file);
			if (folderId) {
				formData.append("folderId", folderId);
			}

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener("progress", (e) => {
				if (e.lengthComputable) {
					const progress = Math.round((e.loaded / e.total) * 100);
					uploadProgress.progress = progress;
					if (onProgress) {
						onProgress(progress);
					}
				}
			});

			xhr.addEventListener("load", () => {
				if (xhr.status === 200) {
					uploadProgress.progress = 100;
					uploadProgress.status = "processing";
				} else {
					uploadProgress.status = "error";
					uploadProgress.error = "Upload failed";
				}
			});

			xhr.addEventListener("error", () => {
				uploadProgress.status = "error";
				uploadProgress.error = "Network error";
			});

			xhr.open("POST", "/api/assets/upload");
			xhr.send(formData);

			const response = await new Promise<{ asset: LibraryAsset }>((resolve, reject) => {
				xhr.addEventListener("load", () => {
					if (xhr.status === 200) {
						try {
							resolve(JSON.parse(xhr.responseText));
						} catch (e) {
							reject(e);
						}
					} else {
						reject(new Error("Upload failed"));
					}
				});
				xhr.addEventListener("error", () => {
					reject(new Error("Network error"));
				});
			});

			uploadProgress.status = "completed";
			assets.value.push(response.asset);

			return response.asset;
		} catch (error) {
			console.error("Failed to upload asset:", error);
			uploadProgress.status = "error";
			uploadProgress.error = error instanceof Error ? error.message : "Upload failed";
			return null;
		} finally {
			setTimeout(() => {
				uploadQueue.value = uploadQueue.value.filter(p => p.assetId !== assetId);
			}, 3000);
		}
	};

	const uploadMultipleAssets = async (
		files: File[],
		folderId?: string,
		onProgress?: (progress: number, fileName: string) => void,
	) => {
		const uploadPromises = files.map(file =>
			uploadAsset(file, folderId, (progress) => {
				if (onProgress) {
					onProgress(progress, file.name);
				}
			})
		);

		return Promise.all(uploadPromises);
	};

	const deleteAsset = async (assetId: string) => {
		try {
			await $fetch(`/api/assets/${assetId}`, {
				method: "DELETE",
			});

			assets.value = assets.value.filter(a => a.id !== assetId);
			selectedAssets.value.delete(assetId);
			return true;
		} catch (error) {
			console.error("Failed to delete asset:", error);
			return false;
		}
	};

	const deleteSelectedAssets = async () => {
		const promises = Array.from(selectedAssets.value).map(id => deleteAsset(id));
		await Promise.all(promises);
		selectedAssets.value.clear();
	};

	const updateAsset = async (assetId: string, updates: Partial<LibraryAsset>) => {
		try {
			const result = await $fetch<{ asset: LibraryAsset }>(`/api/assets/${assetId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = assets.value.findIndex(a => a.id === assetId);
			if (index >= 0) {
				assets.value[index] = result.asset;
			}

			return result.asset;
		} catch (error) {
			console.error("Failed to update asset:", error);
			return null;
		}
	};

	const duplicateAsset = async (assetId: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		if (!asset) return null;

		try {
			const result = await $fetch<{ asset: LibraryAsset }>(`/api/assets/${assetId}/duplicate`, {
				method: "POST",
			});

			assets.value.push(result.asset);
			return result.asset;
		} catch (error) {
			console.error("Failed to duplicate asset:", error);
			return null;
		}
	};

	const moveAsset = async (assetId: string, folderId?: string) => {
		return updateAsset(assetId, { folderId });
	};

	const renameAsset = async (assetId: string, name: string) => {
		return updateAsset(assetId, { name });
	};

	const addTag = async (assetId: string, tag: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		if (!asset || asset.tags.includes(tag)) return null;

		return updateAsset(assetId, { tags: [...asset.tags, tag] });
	};

	const removeTag = async (assetId: string, tag: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		if (!asset) return null;

		return updateAsset(assetId, { tags: asset.tags.filter(t => t !== tag) });
	};

	const selectAsset = (assetId: string) => {
		selectedAssets.value.add(assetId);
	};

	const deselectAsset = (assetId: string) => {
		selectedAssets.value.delete(assetId);
	};

	const toggleAssetSelection = (assetId: string) => {
		if (selectedAssets.value.has(assetId)) {
			selectedAssets.value.delete(assetId);
		} else {
			selectedAssets.value.add(assetId);
		}
	};

	const selectAllAssets = () => {
		assets.value.forEach(asset => selectedAssets.value.add(asset.id));
	};

	const deselectAllAssets = () => {
		selectedAssets.value.clear();
	};

	const getAssetById = (assetId: string) => {
		return assets.value.find(a => a.id === assetId);
	};

	const getAssetsByType = (type: LibraryAsset["type"]) => {
		return assets.value.filter(a => a.type === type);
	};

	const getAssetsByTag = (tag: string) => {
		return assets.value.filter(a => a.tags.includes(tag));
	};

	const getAssetsByFolder = (folderId: string) => {
		return assets.value.filter(a => a.folderId === folderId);
	};

	const searchAssets = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return assets.value.filter(asset =>
			asset.name.toLowerCase().includes(lowerQuery)
			|| asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
		);
	};

	const getAssetUrl = (assetId: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		return asset?.url || "";
	};

	const getThumbnailUrl = (assetId: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		return asset?.thumbnail || asset?.url || "";
	};

	const cancelUpload = (assetId: string) => {
		uploadQueue.value = uploadQueue.value.filter(p => p.assetId !== assetId);
	};

	const clearUploadQueue = () => {
		uploadQueue.value = [];
	};

	return {
		assets,
		images,
		videos,
		fonts,
		icons,
		others,
		isLoading,
		uploadQueue,
		selectedAssets,
		hasAssets,
		selectedCount,
		loadAssets,
		uploadAsset,
		uploadMultipleAssets,
		deleteAsset,
		deleteSelectedAssets,
		updateAsset,
		duplicateAsset,
		moveAsset,
		renameAsset,
		addTag,
		removeTag,
		selectAsset,
		deselectAsset,
		toggleAssetSelection,
		selectAllAssets,
		deselectAllAssets,
		getAssetById,
		getAssetsByType,
		getAssetsByTag,
		getAssetsByFolder,
		searchAssets,
		getAssetUrl,
		getThumbnailUrl,
		cancelUpload,
		clearUploadQueue,
	};
}
