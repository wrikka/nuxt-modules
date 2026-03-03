export interface AssetFolder {
	id: string;
	name: string;
	parentId?: string;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
	assetCount?: number;
}

export function useAssetFolders() {
	const folders = ref<AssetFolder[]>([]);
	const isLoading = ref(false);
	const selectedFolderId = ref<string | null>(null);

	const rootFolders = computed(() => {
		return folders.value.filter(f => !f.parentId);
	});

	const selectedFolder = computed(() => {
		return folders.value.find(f => f.id === selectedFolderId.value) || null;
	});

	const folderTree = computed(() => {
		const buildTree = (parentId?: string): AssetFolder[] => {
			return folders.value
				.filter(f => f.parentId === parentId)
				.map(folder => ({
					...folder,
					children: buildTree(folder.id),
				}));
		};
		return buildTree();
	});

	const getFolderPath = (folderId: string): string[] => {
		const path: string[] = [];
		let currentFolder = folders.value.find(f => f.id === folderId);

		while (currentFolder) {
			path.unshift(currentFolder.name);
			currentFolder = folders.value.find(f => f.id === currentFolder?.parentId);
		}

		return path;
	};

	const getSubfolders = (folderId?: string) => {
		return folders.value.filter(f => f.parentId === folderId);
	};

	const loadFolders = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ folders: AssetFolder[] }>("/api/assets/folders");
			folders.value = data.folders || [];
		} catch (error) {
			console.error("Failed to load folders:", error);
			folders.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const createFolder = async (name: string, parentId?: string) => {
		try {
			const result = await $fetch<{ folder: AssetFolder }>("/api/assets/folders", {
				method: "POST",
				body: { name, parentId },
			});

			folders.value.push(result.folder);
			return result.folder;
		} catch (error) {
			console.error("Failed to create folder:", error);
			return null;
		}
	};

	const updateFolder = async (folderId: string, updates: Partial<AssetFolder>) => {
		try {
			const result = await $fetch<{ folder: AssetFolder }>(`/api/assets/folders/${folderId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = folders.value.findIndex(f => f.id === folderId);
			if (index >= 0) {
				folders.value[index] = result.folder;
			}

			return result.folder;
		} catch (error) {
			console.error("Failed to update folder:", error);
			return null;
		}
	};

	const deleteFolder = async (folderId: string) => {
		try {
			await $fetch(`/api/assets/folders/${folderId}`, {
				method: "DELETE",
			});

			const deleteRecursive = (id: string) => {
				const children = getSubfolders(id);
				children.forEach(child => deleteRecursive(child.id));
				folders.value = folders.value.filter(f => f.id !== id);
			};

			deleteRecursive(folderId);

			if (selectedFolderId.value === folderId) {
				selectedFolderId.value = null;
			}

			return true;
		} catch (error) {
			console.error("Failed to delete folder:", error);
			return false;
		}
	};

	const moveFolder = async (folderId: string, newParentId?: string) => {
		return updateFolder(folderId, { parentId: newParentId });
	};

	const renameFolder = async (folderId: string, name: string) => {
		return updateFolder(folderId, { name });
	};

	const selectFolder = (folderId: string | null) => {
		selectedFolderId.value = folderId;
	};

	const getFolderById = (folderId: string) => {
		return folders.value.find(f => f.id === folderId);
	};

	const getParentFolder = (folderId: string) => {
		const folder = folders.value.find(f => f.id === folderId);
		if (!folder || !folder.parentId) return null;
		return folders.value.find(f => f.id === folder.parentId);
	};

	const getFolderBreadcrumbs = (folderId: string) => {
		const breadcrumbs: AssetFolder[] = [];
		let currentFolder = folders.value.find(f => f.id === folderId);

		while (currentFolder) {
			breadcrumbs.unshift(currentFolder);
			currentFolder = folders.value.find(f => f.id === currentFolder?.parentId);
		}

		return breadcrumbs;
	};

	const searchFolders = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return folders.value.filter(f => f.name.toLowerCase().includes(lowerQuery));
	};

	const duplicateFolder = async (folderId: string) => {
		const folder = folders.value.find(f => f.id === folderId);
		if (!folder) return null;

		try {
			const result = await $fetch<{ folder: AssetFolder }>(`/api/assets/folders/${folderId}/duplicate`, {
				method: "POST",
			});

			folders.value.push(result.folder);
			return result.folder;
		} catch (error) {
			console.error("Failed to duplicate folder:", error);
			return null;
		}
	};

	return {
		folders,
		rootFolders,
		selectedFolder,
		selectedFolderId,
		folderTree,
		isLoading,
		loadFolders,
		createFolder,
		updateFolder,
		deleteFolder,
		moveFolder,
		renameFolder,
		selectFolder,
		getFolderById,
		getParentFolder,
		getSubfolders,
		getFolderPath,
		getFolderBreadcrumbs,
		searchFolders,
		duplicateFolder,
	};
}
