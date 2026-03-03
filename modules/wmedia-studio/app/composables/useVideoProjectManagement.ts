export const useVideoProjectManagement = () => {
	const videoStore = useVideoStore();
	const { currentVideoProject, loading } = storeToRefs(videoStore);

	const autoSaveInterval = ref<NodeJS.Timeout | null>(null);
	const lastSavedTime = ref<Date | null>(null);
	const hasUnsavedChanges = ref(false);

	const saveProject = async () => {
		if (!currentVideoProject.value) return;

		try {
			await videoStore.saveProject();
			lastSavedTime.value = new Date();
			hasUnsavedChanges.value = false;
		} catch (error) {
			console.error("Failed to save project:", error);
			throw error;
		}
	};

	const enableAutoSave = (intervalMs: number = 30000) => {
		disableAutoSave();

		autoSaveInterval.value = setInterval(async () => {
			if (hasUnsavedChanges.value && currentVideoProject.value) {
				try {
					await saveProject();
				} catch (error) {
					console.error("Auto-save failed:", error);
				}
			}
		}, intervalMs);
	};

	const disableAutoSave = () => {
		if (autoSaveInterval.value) {
			clearInterval(autoSaveInterval.value);
			autoSaveInterval.value = null;
		}
	};

	const markAsUnsaved = () => {
		hasUnsavedChanges.value = true;
	};

	const createNewProject = async (data: {
		name: string;
		description?: string;
		width: number;
		height: number;
		fps?: number;
	}) => {
		try {
			const projectId = await videoStore.createVideoProject(data);
			await videoStore.loadProject(projectId);
			lastSavedTime.value = new Date();
			hasUnsavedChanges.value = false;
			return projectId;
		} catch (error) {
			console.error("Failed to create project:", error);
			throw error;
		}
	};

	const loadProject = async (projectId: string) => {
		try {
			await videoStore.loadProject(projectId);
			lastSavedTime.value = new Date();
			hasUnsavedChanges.value = false;
		} catch (error) {
			console.error("Failed to load project:", error);
			throw error;
		}
	};

	const duplicateProject = async () => {
		if (!currentVideoProject.value) return;

		try {
			const newProjectId = await createNewProject({
				name: `${currentVideoProject.value.name} (Copy)`,
				description: currentVideoProject.value.description,
				width: currentVideoProject.value.width,
				height: currentVideoProject.value.height,
				fps: currentVideoProject.value.fps,
			});

			if (newProjectId) {
				await loadProject(newProjectId);
			}

			return newProjectId;
		} catch (error) {
			console.error("Failed to duplicate project:", error);
			throw error;
		}
	};

	const exportProject = async (options: {
		resolution: string;
		quality: string;
		format: string;
		fps: number;
	}) => {
		if (!currentVideoProject.value) return;

		try {
			const response = await $fetch<{ data: { url: string; config: any } }>(
				`/api/video-projects/${currentVideoProject.value.id}/export`,
				{
					method: "POST",
					body: options,
				},
			);

			return response.data;
		} catch (error) {
			console.error("Failed to export project:", error);
			throw error;
		}
	};

	const getProjectInfo = computed(() => {
		if (!currentVideoProject.value) return null;

		return {
			id: currentVideoProject.value.id,
			name: currentVideoProject.value.name,
			description: currentVideoProject.value.description,
			width: currentVideoProject.value.width,
			height: currentVideoProject.value.height,
			fps: currentVideoProject.value.fps,
			duration: currentVideoProject.value.duration,
			clipsCount: currentVideoProject.value.clips.length,
			tracksCount: currentVideoProject.value.tracks.length,
			createdAt: currentVideoProject.value.createdAt,
			updatedAt: currentVideoProject.value.updatedAt,
			lastSaved: lastSavedTime.value,
			hasUnsavedChanges: hasUnsavedChanges.value,
		};
	});

	onUnmounted(() => {
		disableAutoSave();
	});

	watch(
		() => currentVideoProject.value,
		() => {
			if (currentVideoProject.value) {
				markAsUnsaved();
			}
		},
		{ deep: true },
	);

	return {
		currentVideoProject,
		loading,
		lastSavedTime,
		hasUnsavedChanges,
		getProjectInfo,
		saveProject,
		enableAutoSave,
		disableAutoSave,
		markAsUnsaved,
		createNewProject,
		loadProject,
		duplicateProject,
		exportProject,
	};
};
