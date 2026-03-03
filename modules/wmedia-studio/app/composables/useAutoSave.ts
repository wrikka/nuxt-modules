export interface Version {
	id: string;
	timestamp: Date;
	description: string;
	projectData: any;
}

export const useAutoSave = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject } = storeToRefs(videoStore);

	const autoSaveEnabled = ref(true);
	const autoSaveInterval = ref(30000);
	const lastSaveTime = ref<Date | null>(null);
	const isSaving = ref(false);
	const saveError = ref<string | null>(null);

	const versions = ref<Version[]>([]);
	const maxVersions = 10;

	let saveTimer: ReturnType<typeof setInterval> | null = null;

	const saveProject = async (description: string = "Auto-save") => {
		if (!currentVideoProject.value || isSaving.value) return;

		isSaving.value = true;
		saveError.value = null;

		try {
			await videoStore.saveProject();

			const version: Version = {
				id: `version-${Date.now()}`,
				timestamp: new Date(),
				description,
				projectData: JSON.parse(JSON.stringify(currentVideoProject.value)),
			};

			versions.value.unshift(version);

			if (versions.value.length > maxVersions) {
				versions.value = versions.value.slice(0, maxVersions);
			}

			lastSaveTime.value = new Date();
		} catch (error) {
			saveError.value = error instanceof Error ? error.message : "Save failed";
			throw error;
		} finally {
			isSaving.value = false;
		}
	};

	const enableAutoSave = (interval?: number) => {
		if (interval) {
			autoSaveInterval.value = interval;
		}

		autoSaveEnabled.value = true;
		startAutoSave();
	};

	const disableAutoSave = () => {
		autoSaveEnabled.value = false;
		stopAutoSave();
	};

	const startAutoSave = () => {
		stopAutoSave();

		if (autoSaveEnabled.value) {
			saveTimer = setInterval(() => {
				void saveProject();
			}, autoSaveInterval.value);
		}
	};

	const stopAutoSave = () => {
		if (saveTimer) {
			clearInterval(saveTimer);
			saveTimer = null;
		}
	};

	const manualSave = async (description: string = "Manual save") => {
		return saveProject(description);
	};

	const restoreVersion = (versionId: string) => {
		const version = versions.value.find((v) => v.id === versionId);
		if (version && currentVideoProject.value) {
			Object.assign(currentVideoProject.value, version.projectData);
		}
	};

	const deleteVersion = (versionId: string) => {
		versions.value = versions.value.filter((v) => v.id !== versionId);
	};

	const clearVersions = () => {
		versions.value = [];
	};

	const getTimeSinceLastSave = (): number | null => {
		if (!lastSaveTime.value) return null;
		return Date.now() - lastSaveTime.value.getTime();
	};

	const formatTimeSinceLastSave = (): string => {
		const ms = getTimeSinceLastSave();
		if (ms === null) return "Never";

		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		if (seconds > 0) return `${seconds}s ago`;
		return "Just now";
	};

	onMounted(() => {
		startAutoSave();
	});

	onUnmounted(() => {
		stopAutoSave();
	});

	watch(currentVideoProject, () => {
		if (currentVideoProject.value) {
			void saveProject("Project loaded");
		}
	});

	return {
		autoSaveEnabled,
		autoSaveInterval,
		lastSaveTime,
		isSaving,
		saveError,
		versions,
		saveProject,
		enableAutoSave,
		disableAutoSave,
		manualSave,
		restoreVersion,
		deleteVersion,
		clearVersions,
		getTimeSinceLastSave,
		formatTimeSinceLastSave,
	};
};
