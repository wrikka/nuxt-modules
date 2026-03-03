import { computed, ref } from "vue";

export interface RecentItem {
	id: string;
	type: "project" | "asset" | "template";
	itemId: string;
	title: string;
	thumbnail?: string;
	url: string;
	accessedAt: Date;
}

export function useRecentItems() {
	const recentItems = ref<RecentItem[]>([]);
	const isLoading = ref(false);

	const recentProjects = computed(() => recentItems.value.filter(i => i.type === "project"));
	const recentAssets = computed(() => recentItems.value.filter(i => i.type === "asset"));
	const recentTemplates = computed(() => recentItems.value.filter(i => i.type === "template"));

	const loadRecentItems = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ items: RecentItem[] }>("/api/recent-items");
			recentItems.value = data.items || [];
		} catch (error) {
			console.error("Failed to load recent items:", error);
			recentItems.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const addRecentItem = async (
		type: RecentItem["type"],
		itemId: string,
		title: string,
		thumbnail?: string,
		url?: string,
	) => {
		try {
			const data = await $fetch<{ item: RecentItem }>("/api/recent-items", {
				method: "POST",
				body: { type, itemId, title, thumbnail, url },
			});

			const existingIndex = recentItems.value.findIndex(i => i.itemId === itemId && i.type === type);
			if (existingIndex >= 0) {
				recentItems.value.splice(existingIndex, 1);
			}

			recentItems.value.unshift(data.item);

			if (recentItems.value.length > 50) {
				recentItems.value.pop();
			}

			return data.item;
		} catch (error) {
			console.error("Failed to add recent item:", error);
			return null;
		}
	};

	const removeRecentItem = async (itemId: string) => {
		try {
			await $fetch(`/api/recent-items/${itemId}`, {
				method: "DELETE",
			});

			recentItems.value = recentItems.value.filter(i => i.id !== itemId);
			return true;
		} catch (error) {
			console.error("Failed to remove recent item:", error);
			return false;
		}
	};

	const clearRecentItems = async () => {
		try {
			await $fetch("/api/recent-items", {
				method: "DELETE",
			});

			recentItems.value = [];
			return true;
		} catch (error) {
			console.error("Failed to clear recent items:", error);
			return false;
		}
	};

	const getRecentItemsByType = (type: RecentItem["type"], limit: number = 10) => {
		return recentItems.value
			.filter(i => i.type === type)
			.slice(0, limit);
	};

	const getRecentItemsByDateRange = (startDate: Date, endDate: Date) => {
		return recentItems.value.filter(i => i.accessedAt >= startDate && i.accessedAt <= endDate);
	};

	return {
		recentItems,
		recentProjects,
		recentAssets,
		recentTemplates,
		isLoading,
		loadRecentItems,
		addRecentItem,
		removeRecentItem,
		clearRecentItems,
		getRecentItemsByType,
		getRecentItemsByDateRange,
	};
}
