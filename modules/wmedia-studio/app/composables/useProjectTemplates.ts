import type * as fabric from "fabric";
import { computed, ref } from "vue";
import type { Ref } from "vue";

export interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	thumbnail: string;
	category: string;
	tags: string[];
	data: any;
	width: number;
	height: number;
	createdBy: string;
	createdAt: Date;
	usageCount: number;
}

export function useProjectTemplates(canvas: Ref<fabric.Canvas | null>) {
	const templates = ref<ProjectTemplate[]>([]);
	const isLoading = ref(false);
	const selectedCategory = ref<string>("all");

	const filteredTemplates = computed(() => {
		if (selectedCategory.value === "all") {
			return templates.value;
		}
		return templates.value.filter(t => t.category === selectedCategory.value);
	});

	const categories = computed(() => {
		const cats = new Set(templates.value.map(t => t.category));
		return Array.from(cats);
	});

	const loadTemplates = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ templates: ProjectTemplate[] }>("/api/templates");
			templates.value = data.templates || [];
		} catch (error) {
			console.error("Failed to load templates:", error);
			templates.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const createTemplate = async (
		projectData: any,
		name: string,
		description: string,
		category: string,
		tags: string[] = [],
	) => {
		if (!canvas.value) return null;

		try {
			const thumbnail = canvas.value.toDataURL({
				format: "png",
				quality: 0.8,
				multiplier: 0.2,
			});

			const template: Omit<ProjectTemplate, "id" | "createdBy" | "createdAt" | "usageCount"> = {
				name,
				description,
				thumbnail,
				category,
				tags,
				data: projectData,
				width: canvas.value.width!,
				height: canvas.value.height!,
			};

			const result = await $fetch<{ template: ProjectTemplate }>("/api/templates", {
				method: "POST",
				body: template,
			});

			templates.value.push(result.template);
			return result.template;
		} catch (error) {
			console.error("Failed to create template:", error);
			return null;
		}
	};

	const applyTemplate = async (templateId: string) => {
		if (!canvas.value) return false;

		const template = templates.value.find(t => t.id === templateId);
		if (!template) return false;

		try {
			void canvas.value.loadFromJSON(template.data, () => {
				canvas.value?.renderAll();
			});

			await incrementTemplateUsage(templateId);
			return true;
		} catch (error) {
			console.error("Failed to apply template:", error);
			return false;
		}
	};

	const incrementTemplateUsage = async (templateId: string) => {
		try {
			await $fetch(`/api/templates/${templateId}/usage`, {
				method: "POST",
			});

			const template = templates.value.find(t => t.id === templateId);
			if (template) {
				template.usageCount++;
			}
		} catch (error) {
			console.error("Failed to increment template usage:", error);
		}
	};

	const deleteTemplate = async (templateId: string) => {
		try {
			await $fetch(`/api/templates/${templateId}`, {
				method: "DELETE",
			});

			templates.value = templates.value.filter(t => t.id !== templateId);
			return true;
		} catch (error) {
			console.error("Failed to delete template:", error);
			return false;
		}
	};

	const updateTemplate = async (templateId: string, updates: Partial<ProjectTemplate>) => {
		try {
			const result = await $fetch<{ template: ProjectTemplate }>(`/api/templates/${templateId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = templates.value.findIndex(t => t.id === templateId);
			if (index >= 0) {
				templates.value[index] = result.template;
			}

			return result.template;
		} catch (error) {
			console.error("Failed to update template:", error);
			return null;
		}
	};

	const duplicateTemplate = async (templateId: string) => {
		const template = templates.value.find(t => t.id === templateId);
		if (!template) return null;

		return createTemplate(
			template.data,
			`${template.name} (Copy)`,
			template.description,
			template.category,
			template.tags,
		);
	};

	const searchTemplates = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return templates.value.filter(t =>
			t.name.toLowerCase().includes(lowerQuery)
			|| t.description.toLowerCase().includes(lowerQuery)
			|| t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
		);
	};

	const getTemplatesByTag = (tag: string) => {
		return templates.value.filter(t => t.tags.includes(tag));
	};

	const getPopularTemplates = (limit: number = 10) => {
		return [...templates.value]
			.sort((a, b) => b.usageCount - a.usageCount)
			.slice(0, limit);
	};

	const getRecentTemplates = (limit: number = 10) => {
		return [...templates.value]
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, limit);
	};

	const setCategory = (category: string) => {
		selectedCategory.value = category;
	};

	return {
		templates,
		filteredTemplates,
		categories,
		selectedCategory,
		isLoading,
		loadTemplates,
		createTemplate,
		applyTemplate,
		deleteTemplate,
		updateTemplate,
		duplicateTemplate,
		searchTemplates,
		getTemplatesByTag,
		getPopularTemplates,
		getRecentTemplates,
		setCategory,
	};
}
