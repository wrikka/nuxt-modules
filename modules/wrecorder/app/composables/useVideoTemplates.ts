import { reactive, readonly, computed } from "vue";

export interface VideoTemplate {
	id: string;
	name: string;
	category: "tutorial" | "presentation" | "gaming" | "vlog" | "custom";
	settings: {
		resolution: { width: number; height: number };
		frameRate: number;
		layout: "single" | "split" | "pip" | "overlay";
		introDuration: number;
		outroDuration: number;
		transitions: string[];
		lowerThirds: boolean;
		watermark: boolean;
	};
	previewUrl?: string;
}

export interface VideoTemplatesState {
	templates: VideoTemplate[];
	selectedTemplate?: VideoTemplate;
	categories: string[];
}

const DEFAULT_TEMPLATES: VideoTemplate[] = [
	{
		id: "tutorial-basic",
		name: "Tutorial - Basic",
		category: "tutorial",
		settings: {
			resolution: { width: 1920, height: 1080 },
			frameRate: 30,
			layout: "pip",
			introDuration: 5,
			outroDuration: 3,
			transitions: ["fade", "slide"],
			lowerThirds: true,
			watermark: true,
		},
	},
	{
		id: "presentation-slides",
		name: "Presentation - Slides",
		category: "presentation",
		settings: {
			resolution: { width: 1920, height: 1080 },
			frameRate: 30,
			layout: "split",
			introDuration: 3,
			outroDuration: 5,
			transitions: ["fade"],
			lowerThirds: true,
			watermark: false,
		},
	},
	{
		id: "gaming-highlight",
		name: "Gaming - Highlight",
		category: "gaming",
		settings: {
			resolution: { width: 2560, height: 1440 },
			frameRate: 60,
			layout: "single",
			introDuration: 0,
			outroDuration: 0,
			transitions: ["cut", "fade"],
			lowerThirds: false,
			watermark: true,
		},
	},
	{
		id: "vlog-daily",
		name: "Vlog - Daily",
		category: "vlog",
		settings: {
			resolution: { width: 1080, height: 1920 },
			frameRate: 30,
			layout: "single",
			introDuration: 2,
			outroDuration: 2,
			transitions: ["slide", "zoom"],
			lowerThirds: false,
			watermark: false,
		},
	},
];

export const useVideoTemplates = () => {
	const state = reactive<VideoTemplatesState>({
		templates: [...DEFAULT_TEMPLATES],
		categories: ["tutorial", "presentation", "gaming", "vlog", "custom"],
	});

	const createTemplate = (
		name: string,
		category: VideoTemplate["category"],
		settings: Partial<VideoTemplate["settings"]>
	): string => {
		const id = `template-${Date.now()}`;
		const template: VideoTemplate = {
			id,
			name,
			category,
			settings: {
				resolution: { width: 1920, height: 1080 },
				frameRate: 30,
				layout: "single",
				introDuration: 0,
				outroDuration: 0,
				transitions: [],
				lowerThirds: false,
				watermark: false,
				...settings,
			},
		};
		state.templates.push(template);
		return id;
	};

	const selectTemplate = (id: string) => {
		state.selectedTemplate = state.templates.find(t => t.id === id);
	};

	const deleteTemplate = (id: string) => {
		state.templates = state.templates.filter(t => t.id !== id);
		if (state.selectedTemplate?.id === id) {
			state.selectedTemplate = undefined;
		}
	};

	const applyTemplate = (id: string): VideoTemplate["settings"] | null => {
		const template = state.templates.find(t => t.id === id);
		if (!template) return null;

		state.selectedTemplate = template;
		return template.settings;
	};

	const updateTemplateSettings = (id: string, settings: Partial<VideoTemplate["settings"]>) => {
		const template = state.templates.find(t => t.id === id);
		if (template) {
			template.settings = { ...template.settings, ...settings };
		}
	};

	const getTemplatesByCategory = (category: string): VideoTemplate[] => {
		return state.templates.filter(t => t.category === category);
	};

	const duplicateTemplate = (id: string): string | null => {
		const template = state.templates.find(t => t.id === id);
		if (!template) return null;

		const newId = `template-${Date.now()}`;
		const duplicated = {
			...template,
			id: newId,
			name: `${template.name} (Copy)`,
		};
		state.templates.push(duplicated);
		return newId;
	};

	return {
		state: readonly(state),
		templates: computed(() => state.templates),
		selectedTemplate: computed(() => state.selectedTemplate),
		createTemplate,
		selectTemplate,
		deleteTemplate,
		applyTemplate,
		updateTemplateSettings,
		getTemplatesByCategory,
		duplicateTemplate,
	};
};
