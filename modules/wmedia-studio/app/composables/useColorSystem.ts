import type { BrandColor as SharedBrandColor } from "#shared/types/template";
import { computed, ref } from "vue";

interface LibraryBrandColor extends Omit<SharedBrandColor, "hex"> {
	brandKitId: string;
	hex: string;
	rgb: { r: number; g: number; b: number };
	variant: "primary" | "secondary" | "accent" | "neutral" | "custom";
	shades: ColorShade[];
	createdAt: Date;
}

export interface ColorShade {
	weight: number;
	hex: string;
	rgb: { r: number; g: number; b: number };
}

export function useColorSystem(brandKitId: Ref<string>) {
	const colors = ref<LibraryBrandColor[]>([]);
	const isLoading = ref(false);

	const primaryColors = computed(() => colors.value.filter(c => c.variant === "primary"));
	const secondaryColors = computed(() => colors.value.filter(c => c.variant === "secondary"));
	const accentColors = computed(() => colors.value.filter(c => c.variant === "accent"));
	const neutralColors = computed(() => colors.value.filter(c => c.variant === "neutral"));

	const loadColors = async () => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ colors: LibraryBrandColor[] }>(`/api/brand-kits/${brandKitId.value}/colors`);
			colors.value = data.colors || [];
		} catch (error) {
			console.error("Failed to load colors:", error);
			colors.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const addColor = async (name: string, hex: string, variant: LibraryBrandColor["variant"]) => {
		try {
			const rgb = hexToRgb(hex);
			const shades = generateShades(rgb);

			const result = await $fetch<{ color: LibraryBrandColor }>(`/api/brand-kits/${brandKitId.value}/colors`, {
				method: "POST",
				body: { name, hex, rgb, variant, shades },
			});

			colors.value.push(result.color);
			return result.color;
		} catch (error) {
			console.error("Failed to add color:", error);
			return null;
		}
	};

	const updateColor = async (colorId: string, updates: Partial<LibraryBrandColor>) => {
		try {
			const result = await $fetch<{ color: LibraryBrandColor }>(
				`/api/brand-kits/${brandKitId.value}/colors/${colorId}`,
				{
					method: "PATCH",
					body: updates,
				},
			);

			const index = colors.value.findIndex(c => c.id === colorId);
			if (index >= 0) {
				colors.value[index] = result.color;
			}

			return result.color;
		} catch (error) {
			console.error("Failed to update color:", error);
			return null;
		}
	};

	const deleteColor = async (colorId: string) => {
		try {
			await $fetch(`/api/brand-kits/${brandKitId.value}/colors/${colorId}`, {
				method: "DELETE",
			});

			colors.value = colors.value.filter(c => c.id !== colorId);
			return true;
		} catch (error) {
			console.error("Failed to delete color:", error);
			return false;
		}
	};

	const generateColorPalette = async (baseColorHex: string, count: number = 5) => {
		try {
			const data = await $fetch<{ colors: LibraryBrandColor[] }>(
				`/api/brand-kits/${brandKitId.value}/colors/generate`,
				{
					method: "POST",
					body: { baseColor: baseColorHex, count },
				},
			);

			data.colors.forEach(color => {
				colors.value.push(color);
			});

			return data.colors;
		} catch (error) {
			console.error("Failed to generate color palette:", error);
			return [];
		}
	};

	const getColorById = (colorId: string) => {
		return colors.value.find(c => c.id === colorId);
	};

	const getColorsByVariant = (variant: LibraryBrandColor["variant"]) => {
		return colors.value.filter(c => c.variant === variant);
	};

	const getShade = (colorId: string, weight: number) => {
		const color = getColorById(colorId);
		return color?.shades.find(s => s.weight === weight);
	};

	const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!result) return { r: 0, g: 0, b: 0 };
		return {
			r: Number.parseInt(result[1] || "00", 16),
			g: Number.parseInt(result[2] || "00", 16),
			b: Number.parseInt(result[3] || "00", 16),
		};
	};

	const rgbToHex = (r: number, g: number, b: number): string => {
		return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`;
	};

	const generateShades = (rgb: { r: number; g: number; b: number }): ColorShade[] => {
		const shades: ColorShade[] = [];
		const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

		weights.forEach((weight) => {
			const factor = weight < 500
				? 1 - (weight / 1000)
				: 1 - ((weight - 500) / 500);

			const shadeRgb = {
				r: Math.round(rgb.r * factor),
				g: Math.round(rgb.g * factor),
				b: Math.round(rgb.b * factor),
			};

			shades.push({
				weight,
				hex: rgbToHex(shadeRgb.r, shadeRgb.g, shadeRgb.b),
				rgb: shadeRgb,
			});
		});

		return shades;
	};

	return {
		colors,
		primaryColors,
		secondaryColors,
		accentColors,
		neutralColors,
		isLoading,
		loadColors,
		addColor,
		updateColor,
		deleteColor,
		generateColorPalette,
		getColorById,
		getColorsByVariant,
		getShade,
		hexToRgb,
		rgbToHex,
		generateShades,
	};
}
