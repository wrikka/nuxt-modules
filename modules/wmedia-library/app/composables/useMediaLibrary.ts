import type { UploadResponse } from "#shared/types/api";

interface LibraryMediaAsset {
	id: string;
	name: string;
	type: "video" | "audio" | "image";
	url: string;
	thumbnailUrl?: string;
	duration?: number;
	width?: number;
	height?: number;
	size: number;
	mimeType: string;
	createdAt: Date;
	updatedAt: Date;
	uploadedBy: string;
	folderId?: string;
	tags: string[];
}

interface LibraryMediaFolder {
	id: string;
	name: string;
	parentId?: string;
	createdAt: Date;
}

export type { LibraryMediaFolder };

export const useMediaLibrary = () => {
	const assets = ref<LibraryMediaAsset[]>([]);
	const folders = ref<LibraryMediaFolder[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);
	const selectedFolderId = ref<string | null>(null);
	const searchQuery = ref("");
	const selectedAssets = ref<Set<string>>(new Set());

	const loadAssets = async (folderId?: string) => {
		loading.value = true;
		error.value = null;

		try {
			const params = folderId ? { folderId } : {};
			const response = await $fetch<{ data: LibraryMediaAsset[] }>("/api/assets", { params });
			assets.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load assets";
		} finally {
			loading.value = false;
		}
	};

	const loadFolders = async () => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: LibraryMediaFolder[] }>("/api/folders");
			folders.value = response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load folders";
		} finally {
			loading.value = false;
		}
	};

	const uploadFile = async (file: File, folderId?: string): Promise<LibraryMediaAsset> => {
		loading.value = true;
		error.value = null;

		try {
			const formData = new FormData();
			formData.append("file", file);
			if (folderId) {
				formData.append("folderId", folderId);
			}

			const response = await $fetch<{ data: UploadResponse & { duration?: number; width?: number; height?: number } }>(
				"/api/upload",
				{
					method: "POST",
					body: formData,
				},
			);

			const asset: LibraryMediaAsset = {
				id: response.data.id,
				name: response.data.filename,
				type: getMediaType(file.type),
				url: response.data.url,
				duration: response.data.duration,
				width: response.data.width,
				height: response.data.height,
				size: response.data.size,
				mimeType: response.data.mimeType,
				createdAt: new Date(),
				updatedAt: new Date(),
				uploadedBy: "user",
				folderId,
				tags: [],
			};

			assets.value.push(asset);

			return asset;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to upload file";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const uploadMultipleFiles = async (files: File[], folderId?: string): Promise<MediaAsset[]> => {
		const uploadedAssets: MediaAsset[] = [];

		for (const file of files) {
			try {
				const asset = await uploadFile(file, folderId);
				uploadedAssets.push(asset);
			} catch (err) {
				console.error(`Failed to upload ${file.name}:`, err);
			}
		}

		return uploadedAssets;
	};

	const deleteAsset = async (assetId: string) => {
		loading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/assets/${assetId}`, { method: "DELETE" });
			assets.value = assets.value.filter((a) => a.id !== assetId);
			selectedAssets.value.delete(assetId);
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete asset";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const deleteMultipleAssets = async (assetIds: string[]) => {
		for (const assetId of assetIds) {
			try {
				await deleteAsset(assetId);
			} catch (err) {
				console.error(`Failed to delete asset ${assetId}:`, err);
			}
		}
	};

	const createFolder = async (name: string, parentId?: string): Promise<LibraryMediaFolder> => {
		loading.value = true;
		error.value = null;

		try {
			const response = await $fetch<{ data: LibraryMediaFolder }>("/api/folders", {
				method: "POST",
				body: { name, parentId },
			});

			folders.value.push(response.data);

			return response.data;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create folder";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const deleteFolder = async (folderId: string) => {
		loading.value = true;
		error.value = null;

		try {
			await $fetch(`/api/folders/${folderId}`, { method: "DELETE" });
			folders.value = folders.value.filter((f) => f.id !== folderId);

			if (selectedFolderId.value === folderId) {
				selectedFolderId.value = null;
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete folder";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const selectAsset = (assetId: string, addToSelection = false) => {
		if (addToSelection) {
			if (selectedAssets.value.has(assetId)) {
				selectedAssets.value.delete(assetId);
			} else {
				selectedAssets.value.add(assetId);
			}
		} else {
			selectedAssets.value.clear();
			selectedAssets.value.add(assetId);
		}
	};

	const selectAllAssets = () => {
		selectedAssets.value = new Set(filteredAssets.value.map((a) => a.id));
	};

	const deselectAllAssets = () => {
		selectedAssets.value.clear();
	};

	const getSelectedAssets = (): LibraryMediaAsset[] => {
		return Array.from(selectedAssets.value)
			.map((id) => assets.value.find((a) => a.id === id))
			.filter((a): a is LibraryMediaAsset => a !== undefined);
	};

	const getMediaMetadata = async (file: File): Promise<Partial<LibraryMediaAsset>> => {
		const metadata: Partial<LibraryMediaAsset> = {
			size: file.size,
			mimeType: file.type,
		};

		if (file.type.startsWith("video/")) {
			const video = document.createElement("video");
			video.src = URL.createObjectURL(file);

			await new Promise((resolve) => {
				video.onloadedmetadata = resolve;
			});

			metadata.duration = video.duration;
			metadata.width = video.videoWidth;
			metadata.height = video.videoHeight;
			metadata.type = "video";

			URL.revokeObjectURL(video.src);
		} else if (file.type.startsWith("audio/")) {
			const audio = document.createElement("audio");
			audio.src = URL.createObjectURL(file);

			await new Promise((resolve) => {
				audio.onloadedmetadata = resolve;
			});

			metadata.duration = audio.duration;
			metadata.type = "audio";

			URL.revokeObjectURL(audio.src);
		} else if (file.type.startsWith("image/")) {
			const image = new Image();
			image.src = URL.createObjectURL(file);

			await new Promise((resolve) => {
				image.onload = resolve;
			});

			metadata.width = image.width;
			metadata.height = image.height;
			metadata.type = "image";

			URL.revokeObjectURL(image.src);
		}

		return metadata;
	};

	const filteredAssets = computed(() => {
		let filtered = assets.value;

		if (selectedFolderId.value) {
			filtered = filtered.filter((a) => a.folderId === selectedFolderId.value);
		}

		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			filtered = filtered.filter(
				(a) =>
					a.name.toLowerCase().includes(query)
					|| a.tags?.some((tag) => tag.toLowerCase().includes(query)),
			);
		}

		return filtered;
	});

	const assetsByType = computed(() => {
		return {
			video: filteredAssets.value.filter((a) => a.type === "video"),
			audio: filteredAssets.value.filter((a) => a.type === "audio"),
			image: filteredAssets.value.filter((a) => a.type === "image"),
		};
	});

	const getMediaType = (mimeType: string): "video" | "audio" | "image" => {
		if (mimeType.startsWith("video/")) return "video";
		if (mimeType.startsWith("audio/")) return "audio";
		if (mimeType.startsWith("image/")) return "image";
		return "image";
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	const formatDuration = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const checkDuplicate = async (file: File): Promise<LibraryMediaAsset | null> => {
		const existingAsset = assets.value.find((a) => a.name === file.name && a.size === file.size);
		return existingAsset || null;
	};

	const uploadFileWithDuplicateCheck = async (
		file: File,
		folderId?: string,
		skipDuplicateCheck = false,
	): Promise<LibraryMediaAsset> => {
		if (!skipDuplicateCheck) {
			const duplicate = await checkDuplicate(file);
			if (duplicate) {
				throw new Error(`Duplicate file found: ${file.name} (already exists)`);
			}
		}
		return uploadFile(file, folderId);
	};

	return {
		assets,
		folders,
		loading,
		error,
		selectedFolderId,
		searchQuery,
		selectedAssets,
		filteredAssets,
		assetsByType,
		loadAssets,
		loadFolders,
		uploadFile,
		uploadMultipleFiles,
		uploadFileWithDuplicateCheck,
		deleteAsset,
		deleteMultipleAssets,
		createFolder,
		deleteFolder,
		selectAsset,
		selectAllAssets,
		deselectAllAssets,
		getSelectedAssets,
		getMediaMetadata,
		checkDuplicate,
		formatFileSize,
		formatDuration,
	};
};
