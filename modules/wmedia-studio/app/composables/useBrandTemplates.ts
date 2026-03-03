import { computed, ref } from "vue";

export interface BrandTemplate {
	id: string;
	brandKitId: string;
	name: string;
	description: string;
	thumbnail: string;
	data: any;
	category: string;
	tags: string[];
	width: number;
	height: number;
	createdAt: Date;
	updatedAt: Date;
}

export function useBrandTemplates(brandKitId: Ref<string>) {
	const templates = ref<BrandTemplate[]>([]);
	const isLoading = ref(false);

	const templatesByCategory = computed(() => {
		const grouped = new Map<string, BrandTemplate[]>();
		templates.value.forEach(template => {
			if (!grouped.has(template.category)) {
				grouped.set(template.category, []);
			}
			grouped.get(template.category)!.push(template);
		});
		return grouped;
	});

	const loadTemplates = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ templates: BrandTemplate[] }>(`/api/brand-kits/${brandKitId.value}/templates`);
			templates.value = data.templates || [];
		} catch (error) {
			console.error("Failed to load brand templates:", error);
			templates.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const createTemplate = async (
		name: string,
		description: string,
		data: any,
		category: string,
		tags: string[] = [],
	) => {
		try {
			const result = await $fetch<{ template: BrandTemplate }>(`/api/brand-kits/${brandKitId.value}/templates`, {
				method: "POST",
				body: { name, description, data, category, tags },
			});

			templates.value.push(result.template);
			return result.template;
		} catch (error) {
			console.error("Failed to create brand template:", error);
			return null;
		}
	};

	const updateTemplate = async (templateId: string, updates: Partial<BrandTemplate>) => {
		try {
			const result = await $fetch<{ template: BrandTemplate }>(
				`/api/brand-kits/${brandKitId.value}/templates/${templateId}`,
				{
					method: "PATCH",
					body: updates,
				},
			);

			const index = templates.value.findIndex(t => t.id === templateId);
			if (index >= 0) {
				templates.value[index] = result.template;
			}

			return result.template;
		} catch (error) {
			console.error("Failed to update brand template:", error);
			return null;
		}
	};

	const deleteTemplate = async (templateId: string) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/templates/${templateId}`, {
				method: "DELETE",
			});

			templates.value = templates.value.filter(t => t.id !== templateId);
			return true;
		} catch (error) {
			console.error("Failed to delete brand template:", error);
			return false;
		}
	};

	const duplicateTemplate = async (templateId: string) => {
		const template = templates.value.find(t => t.id === templateId);
		if (!template) return null;

		return createTemplate(
			`${template.name} (Copy)`,
			template.description,
			template.data,
			template.category,
			template.tags,
		);
	};

	const getTemplateById = (templateId: string) => {
		return templates.value.find(t => t.id === templateId);
	};

	const getTemplatesByCategory = (category: string) => {
		return templates.value.filter(t => t.category === category);
	};

	const getTemplatesByTag = (tag: string) => {
		return templates.value.filter(t => t.tags.includes(tag));
	};

	const searchTemplates = (query: string) => {
		const lowerQuery = query.toLowerCase();
		return templates.value.filter(t =>
			t.name.toLowerCase().includes(lowerQuery)
			|| t.description.toLowerCase().includes(lowerQuery)
			|| t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
		);
	};

	return {
		templates,
		templatesByCategory,
		isLoading,
		loadTemplates,
		createTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,
		getTemplateById,
		getTemplatesByCategory,
		getTemplatesByTag,
		searchTemplates,
	};
}
