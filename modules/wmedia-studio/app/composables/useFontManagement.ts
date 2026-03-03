import type { BrandFont as SharedBrandFont } from "#shared/types/template";
import { computed, ref } from "vue";

interface LibraryBrandFont extends Omit<SharedBrandFont, "family"> {
	brandKitId: string;
	family: string;
	variant: string;
	weight: number;
	style: "normal" | "italic";
	sourceUrl: string;
	previewUrl?: string;
	isUploaded: boolean;
	createdAt: Date;
}

export function useFontManagement(brandKitId: Ref<string>) {
	const fonts = ref<LibraryBrandFont[]>([]);
	const isLoading = ref(false);

	const primaryFonts = computed(() => fonts.value.filter(f => f.variant === "primary"));
	const secondaryFonts = computed(() => fonts.value.filter(f => f.variant === "secondary"));
	const accentFonts = computed(() => fonts.value.filter(f => f.variant === "accent"));

	const loadFonts = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ fonts: LibraryBrandFont[] }>(`/api/brand-kits/${brandKitId.value}/fonts`);
			fonts.value = data.fonts || [];
		} catch (error) {
			console.error("Failed to load fonts:", error);
			fonts.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const uploadFont = async (file: File, variant: string) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("variant", variant);

			const result = await $fetch<{ font: LibraryBrandFont }>(`/api/brand-kits/${brandKitId.value}/fonts`, {
				method: "POST",
				body: formData,
			});

			fonts.value.push(result.font);
			return result.font;
		} catch (error) {
			console.error("Failed to upload font:", error);
			return null;
		}
	};

	const addGoogleFont = async (
		family: string,
		variant: string,
		weight: number,
		style: "normal" | "italic" = "normal",
	) => {
		try {
			const result = await $fetch<{ font: LibraryBrandFont }>(`/api/brand-kits/${brandKitId.value}/fonts/google`, {
				method: "POST",
				body: { family, variant, weight, style },
			});

			fonts.value.push(result.font);
			return result.font;
		} catch (error) {
			console.error("Failed to add Google font:", error);
			return null;
		}
	};

	const updateFont = async (fontId: string, updates: Partial<LibraryBrandFont>) => {
		try {
			const result = await $fetch<{ font: LibraryBrandFont }>(`/api/brand-kits/${brandKitId.value}/fonts/${fontId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = fonts.value.findIndex(f => f.id === fontId);
			if (index >= 0) {
				fonts.value[index] = result.font;
			}

			return result.font;
		} catch (error) {
			console.error("Failed to update font:", error);
			return null;
		}
	};

	const deleteFont = async (fontId: string) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/fonts/${fontId}`, {
				method: "DELETE",
			});

			fonts.value = fonts.value.filter(f => f.id !== fontId);
			return true;
		} catch (error) {
			console.error("Failed to delete font:", error);
			return false;
		}
	};

	const setPrimaryFont = (fontId: string) => {
		return updateFont(fontId, { variant: "primary" });
	};

	const setSecondaryFont = (fontId: string) => {
		return updateFont(fontId, { variant: "secondary" });
	};

	const setAccentFont = (fontId: string) => {
		return updateFont(fontId, { variant: "accent" });
	};

	const getFontById = (fontId: string) => {
		return fonts.value.find(f => f.id === fontId);
	};

	const getFontsByVariant = (variant: string) => {
		return fonts.value.filter(f => f.variant === variant);
	};

	const searchGoogleFonts = async (query: string) => {
		try {
			const data = await $fetch<{ fonts: Array<{ family: string; variants: string[] }> }>("/api/fonts/google/search", {
				params: { query },
			});
			return data.fonts || [];
		} catch (error) {
			console.error("Failed to search Google fonts:", error);
			return [];
		}
	};

	return {
		fonts,
		primaryFonts,
		secondaryFonts,
		accentFonts,
		isLoading,
		loadFonts,
		uploadFont,
		addGoogleFont,
		updateFont,
		deleteFont,
		setPrimaryFont,
		setSecondaryFont,
		setAccentFont,
		getFontById,
		getFontsByVariant,
		searchGoogleFonts,
	};
}
