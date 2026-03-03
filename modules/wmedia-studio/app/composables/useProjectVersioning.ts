import type * as fabric from "fabric";

export interface ProjectVersion {
	id: string;
	version: number;
	data: any;
	description: string;
	createdBy: string;
	createdAt: Date;
	thumbnail?: string;
}

export interface VersionConfig {
	autoSave: boolean;
	autoSaveInterval: number;
	maxVersions: number;
	saveOnChanges: boolean;
	createSnapshot: boolean;
}

export const DEFAULT_VERSION_CONFIG: VersionConfig = {
	autoSave: true,
	autoSaveInterval: 30000,
	maxVersions: 50,
	saveOnChanges: true,
	createSnapshot: true,
};

export function useProjectVersioning(
	canvas: Ref<fabric.Canvas | null>,
	projectId: Ref<string>,
	config: Partial<VersionConfig> = {},
) {
	const settings = ref<VersionConfig>({ ...DEFAULT_VERSION_CONFIG, ...config });
	const versions = ref<ProjectVersion[]>([]);
	const currentVersionIndex = ref(-1);
	const isSaving = ref(false);
	const autoSaveTimer = ref<NodeJS.Timeout | null>(null);

	const currentVersion = computed(() => {
		if (currentVersionIndex.value >= 0 && currentVersionIndex.value < versions.value.length) {
			return versions.value[currentVersionIndex.value];
		}
		return null;
	});

	const hasVersions = computed(() => versions.value.length > 0);
	const canUndoVersion = computed(() => currentVersionIndex.value > 0);
	const canRedoVersion = computed(() => currentVersionIndex.value < versions.value.length - 1);

	const createVersion = async (description: string = "", createSnapshot: boolean = true) => {
		if (!canvas.value || isSaving.value) return null;

		isSaving.value = true;

		try {
			const canvasData = canvas.value.toJSON();
			const versionNumber = versions.value.length + 1;
			const versionId = `version-${Date.now()}-${versionNumber}`;

			let thumbnail: string | undefined;

			if (createSnapshot && settings.value.createSnapshot) {
				thumbnail = await createThumbnail();
			}

			const newVersion: ProjectVersion = {
				id: versionId,
				version: versionNumber,
				data: canvasData,
				description,
				createdBy: "current-user",
				createdAt: new Date(),
				thumbnail,
			};

			if (currentVersionIndex.value < versions.value.length - 1) {
				versions.value = versions.value.slice(0, currentVersionIndex.value + 1);
			}

			versions.value.push(newVersion);

			if (versions.value.length > settings.value.maxVersions) {
				versions.value.shift();
			} else {
				currentVersionIndex.value++;
			}

			await saveVersionToDatabase(newVersion);

			return newVersion;
		} finally {
			isSaving.value = false;
		}
	};

	const createThumbnail = async (): Promise<string | undefined> => {
		if (!canvas.value) return undefined;

		try {
			const dataUrl = canvas.value.toDataURL({
				format: "png",
				quality: 0.8,
				multiplier: 0.2,
			});
			return dataUrl;
		} catch (error) {
			console.error("Failed to create thumbnail:", error);
			return undefined;
		}
	};

	const saveVersionToDatabase = async (version: ProjectVersion) => {
		try {
			await $fetch(`/api/projects/${projectId.value}/versions`, {
				method: "POST",
				body: {
					version: version.version,
					data: version.data,
					description: version.description,
					thumbnail: version.thumbnail,
				},
			});
		} catch (error) {
			console.error("Failed to save version to database:", error);
		}
	};

	const loadVersion = async (versionId: string) => {
		if (!canvas.value) return false;

		const version = versions.value.find(v => v.id === versionId);
		if (!version) return false;

		try {
			void canvas.value.loadFromJSON(version.data, () => {
				canvas.value?.renderAll();
			});

			const index = versions.value.findIndex(v => v.id === versionId);
			currentVersionIndex.value = index;

			return true;
		} catch (error) {
			console.error("Failed to load version:", error);
			return false;
		}
	};

	const restoreVersion = async (versionId: string) => {
		const success = await loadVersion(versionId);
		if (success) {
			await createVersion(`Restored from version ${versions.value.find(v => v.id === versionId)?.version}`);
		}
		return success;
	};

	const undoVersion = async () => {
		if (!canUndoVersion.value || !canvas.value) return false;

		const prevIndex = currentVersionIndex.value - 1;
		const prevVersion = versions.value[prevIndex];

		if (prevVersion) {
			try {
				void canvas.value.loadFromJSON(prevVersion.data, () => {
					canvas.value?.renderAll();
				});

				currentVersionIndex.value = prevIndex;
				return true;
			} catch (error) {
				console.error("Failed to undo version:", error);
				return false;
			}
		}

		return false;
	};

	const redoVersion = async () => {
		if (!canRedoVersion.value || !canvas.value) return false;

		const nextIndex = currentVersionIndex.value + 1;
		const nextVersion = versions.value[nextIndex];

		if (nextVersion) {
			try {
				void canvas.value.loadFromJSON(nextVersion.data, () => {
					canvas.value?.renderAll();
				});

				currentVersionIndex.value = nextIndex;
				return true;
			} catch (error) {
				console.error("Failed to redo version:", error);
				return false;
			}
		}

		return false;
	};

	const deleteVersion = async (versionId: string) => {
		const index = versions.value.findIndex(v => v.id === versionId);
		if (index === -1) return false;

		try {
			await $fetch(`/api/projects/${projectId.value}/versions/${versionId}`, {
				method: "DELETE",
			});

			versions.value.splice(index, 1);

			if (currentVersionIndex.value >= index) {
				currentVersionIndex.value = Math.max(0, currentVersionIndex.value - 1);
			}

			return true;
		} catch (error) {
			console.error("Failed to delete version:", error);
			return false;
		}
	};

	const updateVersionDescription = async (versionId: string, description: string) => {
		const version = versions.value.find(v => v.id === versionId);
		if (!version) return false;

		try {
			await $fetch(`/api/projects/${projectId.value}/versions/${versionId}`, {
				method: "PATCH",
				body: { description },
			});

			version.description = description;
			return true;
		} catch (error) {
			console.error("Failed to update version description:", error);
			return false;
		}
	};

	const loadVersionsFromDatabase = async () => {
		try {
			const data = await $fetch<{ versions: ProjectVersion[] }>(`/api/projects/${projectId.value}/versions`);
			versions.value = data.versions || [];
			currentVersionIndex.value = versions.value.length - 1;
		} catch (error) {
			console.error("Failed to load versions from database:", error);
			versions.value = [];
			currentVersionIndex.value = -1;
		}
	};

	const compareVersions = (versionId1: string, versionId2: string) => {
		const version1 = versions.value.find(v => v.id === versionId1);
		const version2 = versions.value.find(v => v.id === versionId2);

		if (!version1 || !version2) return null;

		const diff = {
			added: [] as string[],
			removed: [] as string[],
			modified: [] as string[],
		};

		const objects1 = version1.data.objects || [];
		const objects2 = version2.data.objects || [];

		const ids1 = new Set(objects1.map((o: any) => o.id));
		const ids2 = new Set(objects2.map((o: any) => o.id));

		objects2.forEach((obj: any) => {
			if (!ids1.has(obj.id)) {
				diff.added.push(obj.id);
			}
		});

		objects1.forEach((obj: any) => {
			if (!ids2.has(obj.id)) {
				diff.removed.push(obj.id);
			}
		});

		objects1.forEach((obj1: any) => {
			if (ids2.has(obj1.id)) {
				const obj2 = objects2.find((o: any) => o.id === obj1.id);
				if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
					diff.modified.push(obj1.id);
				}
			}
		});

		return diff;
	};

	const startAutoSave = () => {
		if (!settings.value.autoSave) return;

		stopAutoSave();

		autoSaveTimer.value = setInterval(() => {
			void createVersion("Auto-save");
		}, settings.value.autoSaveInterval);
	};

	const stopAutoSave = () => {
		if (autoSaveTimer.value) {
			clearInterval(autoSaveTimer.value);
			autoSaveTimer.value = null;
		}
	};

	const updateConfig = (newConfig: Partial<VersionConfig>) => {
		const oldAutoSave = settings.value.autoSave;
		const oldInterval = settings.value.autoSaveInterval;

		settings.value = { ...settings.value, ...newConfig };

		if (settings.value.autoSave !== oldAutoSave || settings.value.autoSaveInterval !== oldInterval) {
			if (settings.value.autoSave) {
				startAutoSave();
			} else {
				stopAutoSave();
			}
		}
	};

	const clearVersions = () => {
		versions.value = [];
		currentVersionIndex.value = -1;
	};

	const getVersionCount = () => {
		return versions.value.length;
	};

	const getVersionHistory = () => {
		return versions.value.map(v => ({
			id: v.id,
			version: v.version,
			description: v.description,
			createdBy: v.createdBy,
			createdAt: v.createdAt,
			thumbnail: v.thumbnail,
		}));
	};

	return {
		versions,
		currentVersion,
		currentVersionIndex,
		hasVersions,
		canUndoVersion,
		canRedoVersion,
		isSaving,
		settings,
		createVersion,
		loadVersion,
		restoreVersion,
		undoVersion,
		redoVersion,
		deleteVersion,
		updateVersionDescription,
		loadVersionsFromDatabase,
		compareVersions,
		startAutoSave,
		stopAutoSave,
		updateConfig,
		clearVersions,
		getVersionCount,
		getVersionHistory,
	};
}
