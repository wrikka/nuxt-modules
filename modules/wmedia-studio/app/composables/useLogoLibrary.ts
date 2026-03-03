import type { BrandLogo as SharedBrandLogo } from "#shared/types/template";
import { computed, ref } from "vue";

interface LibraryBrandLogo extends Omit<SharedBrandLogo, "url" | "thumbnail"> {
	brandKitId: string;
	url: string;
	thumbnail: string;
	variant: "primary" | "secondary" | "icon" | "wordmark" | "custom";
	format: "svg" | "png" | "jpg" | "webp";
	width: number;
	height: number;
	backgroundColor?: string;
	isTransparent: boolean;
	createdAt: Date;
}

export function useLogoLibrary(brandKitId: Ref<string>) {
	const logos = ref<LibraryBrandLogo[]>([]);
	const isLoading = ref(false);

	const primaryLogos = computed(() => logos.value.filter(l => l.variant === "primary"));
	const secondaryLogos = computed(() => logos.value.filter(l => l.variant === "secondary"));
	const iconLogos = computed(() => logos.value.filter(l => l.variant === "icon"));
	const wordmarkLogos = computed(() => logos.value.filter(l => l.variant === "wordmark"));

	const loadLogos = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ logos: LibraryBrandLogo[] }>(`/api/brand-kits/${brandKitId.value}/logos`);
			logos.value = data.logos || [];
		} catch (error) {
			console.error("Failed to load logos:", error);
			logos.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const uploadLogo = async (file: File, variant: LibraryBrandLogo["variant"], name?: string) => {
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("variant", variant);
			if (name) {
				formData.append("name", name);
			}

			const result = await $fetch<{ logo: LibraryBrandLogo }>(`/api/brand-kits/${brandKitId.value}/logos`, {
				method: "POST",
				body: formData,
			});

			logos.value.push(result.logo);
			return result.logo;
		} catch (error) {
			console.error("Failed to upload logo:", error);
			return null;
		}
	};

	const updateLogo = async (logoId: string, updates: Partial<LibraryBrandLogo>) => {
		try {
			const result = await $fetch<{ logo: LibraryBrandLogo }>(`/api/brand-kits/${brandKitId.value}/logos/${logoId}`, {
				method: "PATCH",
				body: updates,
			});

			const index = logos.value.findIndex(l => l.id === logoId);
			if (index >= 0) {
				logos.value[index] = result.logo;
			}

			return result.logo;
		} catch (error) {
			console.error("Failed to update logo:", error);
			return null;
		}
	};

	const deleteLogo = async (logoId: string) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/logos/${logoId}`, {
				method: "DELETE",
			});

			logos.value = logos.value.filter(l => l.id !== logoId);
			return true;
		} catch (error) {
			console.error("Failed to delete logo:", error);
			return false;
		}
	};

	const setPrimaryLogo = (logoId: string) => {
		return updateLogo(logoId, { variant: "primary" });
	};

	const setSecondaryLogo = (logoId: string) => {
		return updateLogo(logoId, { variant: "secondary" });
	};

	const setIconLogo = (logoId: string) => {
		return updateLogo(logoId, { variant: "icon" });
	};

	const setWordmarkLogo = (logoId: string) => {
		return updateLogo(logoId, { variant: "wordmark" });
	};

	const getLogoById = (logoId: string) => {
		return logos.value.find(l => l.id === logoId);
	};

	const getLogosByVariant = (variant: LibraryBrandLogo["variant"]) => {
		return logos.value.filter(l => l.variant === variant);
	};

	const getLogosByFormat = (format: LibraryBrandLogo["format"]) => {
		return logos.value.filter(l => l.format === format);
	};

	const getPrimaryLogo = () => {
		return primaryLogos.value[0] || null;
	};

	const getIconLogo = () => {
		return iconLogos.value[0] || null;
	};

	return {
		logos,
		primaryLogos,
		secondaryLogos,
		iconLogos,
		wordmarkLogos,
		isLoading,
		loadLogos,
		uploadLogo,
		updateLogo,
		deleteLogo,
		setPrimaryLogo,
		setSecondaryLogo,
		setIconLogo,
		setWordmarkLogo,
		getLogoById,
		getLogosByVariant,
		getLogosByFormat,
		getPrimaryLogo,
		getIconLogo,
	};
}
