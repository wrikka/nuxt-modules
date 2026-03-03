import { ref } from "vue";

export interface ExportQualityPreset {
	id: string;
	name: string;
	format: "png" | "jpg" | "jpeg" | "svg" | "pdf";
	quality: number;
	multiplier: number;
	backgroundColor?: string;
	transparent?: boolean;
	description?: string;
}

export const DEFAULT_QUALITY_PRESETS: ExportQualityPreset[] = [
	{
		id: "high-quality-png",
		name: "High Quality PNG",
		format: "png",
		quality: 1,
		multiplier: 2,
		transparent: true,
		description: "Best quality for web and print",
	},
	{
		id: "web-png",
		name: "Web PNG",
		format: "png",
		quality: 0.9,
		multiplier: 1,
		transparent: true,
		description: "Optimized for web use",
	},
	{
		id: "high-quality-jpg",
		name: "High Quality JPG",
		format: "jpg",
		quality: 0.95,
		multiplier: 2,
		backgroundColor: "#FFFFFF",
		description: "Best quality for photos",
	},
	{
		id: "web-jpg",
		name: "Web JPG",
		format: "jpg",
		quality: 0.85,
		multiplier: 1,
		backgroundColor: "#FFFFFF",
		description: "Optimized for web use",
	},
	{
		id: "print-pdf",
		name: "Print PDF",
		format: "pdf",
		quality: 1,
		multiplier: 3,
		description: "High resolution for printing",
	},
	{
		id: "web-pdf",
		name: "Web PDF",
		format: "pdf",
		quality: 0.9,
		multiplier: 1,
		description: "Optimized for web sharing",
	},
	{
		id: "vector-svg",
		name: "Vector SVG",
		format: "svg",
		quality: 1,
		multiplier: 1,
		description: "Scalable vector format",
	},
];

export function useExportQuality() {
	const presets = ref<ExportQualityPreset[]>([...DEFAULT_QUALITY_PRESETS]);
	const selectedPreset = ref<ExportQualityPreset | null>(null);
	const customSettings = ref<Partial<ExportQualityPreset>>({});

	const selectPreset = (presetId: string) => {
		const preset = presets.value.find(p => p.id === presetId);
		if (preset) {
			selectedPreset.value = preset;
			customSettings.value = { ...preset };
		}
	};

	const updateCustomSetting = (key: keyof ExportQualityPreset, value: any) => {
		customSettings.value = { ...customSettings.value, [key]: value };
	};

	const addPreset = (preset: Omit<ExportQualityPreset, "id">) => {
		const newPreset: ExportQualityPreset = {
			...preset,
			id: `preset-${Date.now()}`,
		};
		presets.value.push(newPreset);
		return newPreset;
	};

	const removePreset = (presetId: string) => {
		presets.value = presets.value.filter(p => p.id !== presetId);
		if (selectedPreset.value?.id === presetId) {
			selectedPreset.value = null;
		}
	};

	const getPresetsByFormat = (format: ExportQualityPreset["format"]) => {
		return presets.value.filter(p => p.format === format);
	};

	const resetToDefaults = () => {
		presets.value = [...DEFAULT_QUALITY_PRESETS];
		selectedPreset.value = null;
		customSettings.value = {};
	};

	return {
		presets,
		selectedPreset,
		customSettings,
		selectPreset,
		updateCustomSetting,
		addPreset,
		removePreset,
		getPresetsByFormat,
		resetToDefaults,
	};
}
