import { computed, ref } from "vue";

export interface ExportPreset {
	id: string;
	name: string;
	description?: string;
	formats: ExportFormatConfig[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ExportFormatConfig {
	format: "png" | "jpg" | "jpeg" | "svg" | "pdf";
	quality?: number;
	multiplier?: number;
	width?: number;
	height?: number;
	backgroundColor?: string;
	transparent?: boolean;
}

export function useExportPresets() {
	const presets = ref<ExportPreset[]>([]);
	const isLoading = ref(false);
	const selectedPresetId = ref<string | null>(null);

	const selectedPreset = computed(() => {
		return presets.value.find(p => p.id === selectedPresetId.value) || null;
	});

	const loadPresets = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ presets: ExportPreset[] }>("/api/export-presets");
			presets.value = data.presets || [];
		} catch (error) {
			console.error("Failed to load export presets:", error);
			presets.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const createPreset = async (name: string, description: string, formats: ExportFormatConfig[]) => {
		try {
			const result = await $fetch<{ preset: ExportPreset }>("/api/export-presets", {
				method: "POST",
				body: { name, description, formats },
			});

			presets.value.push(result.preset);
			return result.preset;
		} catch (error) {
			console.error("Failed to create export preset:", error);
			return null;
		}
	};

	const updatePreset = async (presetId: string, updates: Partial<ExportPreset>) => {
		try {
			const result = await $fetch<{ preset: ExportPreset }>(`/api/export-presets/${presetId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = presets.value.findIndex(p => p.id === presetId);
			if (index >= 0) {
				presets.value[index] = result.preset;
			}

			return result.preset;
		} catch (error) {
			console.error("Failed to update export preset:", error);
			return null;
		}
	};

	const deletePreset = async (presetId: string) => {
		try {
			await $fetch(`/api/export-presets/${presetId}`, {
				method: "DELETE",
			});

			presets.value = presets.value.filter(p => p.id !== presetId);

			if (selectedPresetId.value === presetId) {
				selectedPresetId.value = null;
			}

			return true;
		} catch (error) {
			console.error("Failed to delete export preset:", error);
			return false;
		}
	};

	const duplicatePreset = async (presetId: string) => {
		const preset = presets.value.find(p => p.id === presetId);
		if (!preset) return null;

		return createPreset(
			`${preset.name} (Copy)`,
			preset.description || "",
			preset.formats,
		);
	};

	const selectPreset = (presetId: string | null) => {
		selectedPresetId.value = presetId;
	};

	const getPresetById = (presetId: string) => {
		return presets.value.find(p => p.id === presetId);
	};

	const getPresetsByFormat = (format: ExportFormatConfig["format"]) => {
		return presets.value.filter(p => p.formats.some(f => f.format === format));
	};

	const applyPreset = async (presetId: string) => {
		const preset = getPresetById(presetId);
		if (!preset) return null;

		return preset.formats;
	};

	return {
		presets,
		selectedPreset,
		selectedPresetId,
		isLoading,
		loadPresets,
		createPreset,
		updatePreset,
		deletePreset,
		duplicatePreset,
		selectPreset,
		getPresetById,
		getPresetsByFormat,
		applyPreset,
	};
}
