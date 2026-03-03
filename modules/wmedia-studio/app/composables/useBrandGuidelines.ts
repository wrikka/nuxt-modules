import { ref } from "vue";

export interface BrandGuidelines {
	id: string;
	brandKitId: string;
	title: string;
	description: string;
	content: string;
	sections: BrandGuidelineSection[];
	createdAt: Date;
	updatedAt: Date;
}

export interface BrandGuidelineSection {
	id: string;
	title: string;
	content: string;
	order: number;
}

export function useBrandGuidelines(brandKitId: Ref<string>) {
	const guidelines = ref<BrandGuidelines | null>(null);
	const isLoading = ref(false);

	const loadGuidelines = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ guidelines: BrandGuidelines }>(`/api/brand-kits/${brandKitId.value}/guidelines`);
			guidelines.value = data.guidelines;
		} catch (error) {
			console.error("Failed to load brand guidelines:", error);
			guidelines.value = null;
		} finally {
			isLoading.value = false;
		}
	};

	const updateGuidelines = async (updates: Partial<BrandGuidelines>) => {
		try {
			const result = await $fetch<{ guidelines: BrandGuidelines }>(`/api/brand-kits/${brandKitId.value}/guidelines`, {
				method: "PATCH",
				body: updates,
			});

			guidelines.value = result.guidelines;
			return true;
		} catch (error) {
			console.error("Failed to update brand guidelines:", error);
			return false;
		}
	};

	const addSection = async (title: string, content: string, order: number) => {
		try {
			const result = await $fetch<{ section: BrandGuidelineSection }>(
				`/api/brand-kits/${brandKitId.value}/guidelines/sections`,
				{
					method: "POST",
					body: { title, content, order },
				},
			);

			if (guidelines.value) {
				guidelines.value.sections.push(result.section);
			}

			return result.section;
		} catch (error) {
			console.error("Failed to add section:", error);
			return null;
		}
	};

	const updateSection = async (sectionId: string, updates: Partial<BrandGuidelineSection>) => {
		try {
			const result = await $fetch<{ section: BrandGuidelineSection }>(
				`/api/brand-kits/${brandKitId.value}/guidelines/sections/${sectionId}`,
				{
					method: "PATCH",
					body: updates,
				},
			);

			if (guidelines.value) {
				const index = guidelines.value.sections.findIndex(s => s.id === sectionId);
				if (index >= 0) {
					guidelines.value.sections[index] = result.section;
				}
			}

			return result.section;
		} catch (error) {
			console.error("Failed to update section:", error);
			return null;
		}
	};

	const deleteSection = async (sectionId: string) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/guidelines/sections/${sectionId}`, {
				method: "DELETE",
			});

			if (guidelines.value) {
				guidelines.value.sections = guidelines.value.sections.filter(s => s.id !== sectionId);
			}

			return true;
		} catch (error) {
			console.error("Failed to delete section:", error);
			return false;
		}
	};

	const reorderSections = async (sectionIds: string[]) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/guidelines/sections/reorder`, {
				method: "POST",
				body: { sectionIds },
			});

			if (guidelines.value) {
				guidelines.value.sections = sectionIds
					.map((id, index) => {
						const section = guidelines.value?.sections.find(s => s.id === id);
						return section ? { ...section, order: index } : null;
					})
					.filter(Boolean) as BrandGuidelineSection[];
			}

			return true;
		} catch (error) {
			console.error("Failed to reorder sections:", error);
			return false;
		}
	};

	return {
		guidelines,
		isLoading,
		loadGuidelines,
		updateGuidelines,
		addSection,
		updateSection,
		deleteSection,
		reorderSections,
	};
}
