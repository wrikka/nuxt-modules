import { computed, ref } from "vue";

export interface FavoriteItem {
	id: string;
	type: "project" | "asset" | "template" | "brand_kit";
	itemId: string;
	title: string;
	thumbnail?: string;
	url: string;
	createdAt: Date;
}

export function useFavorites() {
	const favorites = ref<FavoriteItem[]>([]);
	const isLoading = ref(false);

	const favoriteProjects = computed(() => favorites.value.filter(i => i.type === "project"));
	const favoriteAssets = computed(() => favorites.value.filter(i => i.type === "asset"));
	const favoriteTemplates = computed(() => favorites.value.filter(i => i.type === "template"));
	const favoriteBrandKits = computed(() => favorites.value.filter(i => i.type === "brand_kit"));

	const loadFavorites = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ items: FavoriteItem[] }>("/api/favorites");
			favorites.value = data.items || [];
		} catch (error) {
			console.error("Failed to load favorites:", error);
			favorites.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const addFavorite = async (
		type: FavoriteItem["type"],
		itemId: string,
		title: string,
		thumbnail?: string,
		url?: string,
	) => {
		try {
			const data = await $fetch<{ item: FavoriteItem }>("/api/favorites", {
				method: "POST",
				body: { type, itemId, title, thumbnail, url },
			});

			favorites.value.push(data.item);
			return data.item;
		} catch (error) {
			console.error("Failed to add favorite:", error);
			return null;
		}
	};

	const removeFavorite = async (itemId: string) => {
		try {
			await $fetch(`/api/favorites/${itemId}`, {
				method: "DELETE",
			});

			favorites.value = favorites.value.filter(i => i.id !== itemId);
			return true;
		} catch (error) {
			console.error("Failed to remove favorite:", error);
			return false;
		}
	};

	const toggleFavorite = async (
		type: FavoriteItem["type"],
		itemId: string,
		title: string,
		thumbnail?: string,
		url?: string,
	) => {
		const existing = favorites.value.find(i => i.itemId === itemId && i.type === type);
		if (existing) {
			return removeFavorite(existing.id);
		} else {
			return addFavorite(type, itemId, title, thumbnail, url);
		}
	};

	const isFavorite = (type: FavoriteItem["type"], itemId: string) => {
		return favorites.value.some(i => i.itemId === itemId && i.type === type);
	};

	const getFavoritesByType = (type: FavoriteItem["type"]) => {
		return favorites.value.filter(i => i.type === type);
	};

	const clearAllFavorites = async () => {
		try {
			await $fetch("/api/favorites", {
				method: "DELETE",
			});

			favorites.value = [];
			return true;
		} catch (error) {
			console.error("Failed to clear favorites:", error);
			return false;
		}
	};

	const getFavoritesByDateRange = (startDate: Date, endDate: Date) => {
		return favorites.value.filter(i => i.createdAt >= startDate && i.createdAt <= endDate);
	};

	return {
		favorites,
		favoriteProjects,
		favoriteAssets,
		favoriteTemplates,
		favoriteBrandKits,
		isLoading,
		loadFavorites,
		addFavorite,
		removeFavorite,
		toggleFavorite,
		isFavorite,
		getFavoritesByType,
		clearAllFavorites,
		getFavoritesByDateRange,
	};
}
