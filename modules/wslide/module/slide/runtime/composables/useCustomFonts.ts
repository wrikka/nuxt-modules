import { ref, computed } from "vue";

export interface CustomFont {
	id: string;
	name: string;
	family: string;
	url: string;
	format: "woff2" | "woff" | "ttf" | "otf";
	isActive: boolean;
	uploadedAt: Date;
}

const STORAGE_KEY = "wslide:custom-fonts";

export function useCustomFonts() {
	const fonts = ref<CustomFont[]>([]);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const activeFonts = computed(() => 
		fonts.value.filter(f => f.isActive)
	);

	const fontFamilies = computed(() => 
		activeFonts.value.map(f => f.family)
	);

	function loadFonts() {
		isLoading.value = true;
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				fonts.value = parsed.map((f: CustomFont) => ({
					...f,
					uploadedAt: new Date(f.uploadedAt),
				}));
				injectFonts();
			}
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load fonts";
		} finally {
			isLoading.value = false;
		}
	}

	async function uploadFont(file: File, name: string): Promise<CustomFont | null> {
		isLoading.value = true;
		error.value = null;
		
		try {
			// Validate file
			const validFormats = ["woff2", "woff", "ttf", "otf"];
			const format = file.name.split(".").pop()?.toLowerCase() as CustomFont["format"];
			
			if (!validFormats.includes(format)) {
				throw new Error("Invalid font format. Use woff2, woff, ttf, or otf.");
			}
			
			if (file.size > 5 * 1024 * 1024) {
				throw new Error("Font file too large. Max 5MB.");
			}
			
			// Convert to base64
			const base64 = await fileToBase64(file);
			const family = `custom-${name.toLowerCase().replace(/\s+/g, "-")}`;
			
			const font: CustomFont = {
				id: `font-${Date.now()}`,
				name,
				family,
				url: base64,
				format,
				isActive: true,
				uploadedAt: new Date(),
			};
			
			fonts.value.push(font);
			persistFonts();
			injectFont(font);
			
			return font;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Upload failed";
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function injectFont(font: CustomFont) {
		const styleId = `font-${font.id}`;
		let style = document.getElementById(styleId) as HTMLStyleElement;
		
		if (!style) {
			style = document.createElement("style");
			style.id = styleId;
			document.head.appendChild(style);
		}
		
		style.textContent = `
			@font-face {
				font-family: "${font.family}";
				src: url("${font.url}") format("${font.format}");
				font-display: swap;
			}
		`;
	}

	function injectFonts() {
		for (const font of activeFonts.value) {
			injectFont(font);
		}
	}

	function persistFonts() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fonts.value));
	}

	function toggleFont(fontId: string) {
		const font = fonts.value.find(f => f.id === fontId);
		if (font) {
			font.isActive = !font.isActive;
			persistFonts();
			
			if (font.isActive) {
				injectFont(font);
			} else {
				document.getElementById(`font-${font.id}`)?.remove();
			}
		}
	}

	function deleteFont(fontId: string) {
		const index = fonts.value.findIndex(f => f.id === fontId);
		if (index > -1) {
			document.getElementById(`font-${fontId}`)?.remove();
			fonts.value.splice(index, 1);
			persistFonts();
		}
	}

	function applyFontToElement(element: HTMLElement, fontFamily: string) {
		element.style.fontFamily = `"${fontFamily}", sans-serif`;
	}

	function getFontCssVariable(font: CustomFont): string {
		return `var(--font-${font.family})`;
	}

	return {
		fonts: readonly(fonts),
		isLoading: readonly(isLoading),
		error: readonly(error),
		activeFonts,
		fontFamilies,
		loadFonts,
		uploadFont,
		toggleFont,
		deleteFont,
		applyFontToElement,
		getFontCssVariable,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
