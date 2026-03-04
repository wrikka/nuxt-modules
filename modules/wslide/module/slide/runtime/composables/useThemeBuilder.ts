import { ref, computed } from "vue";

export interface ThemeColor {
	name: string;
	primary: string;
	secondary: string;
	background: string;
	text: string;
	accent: string;
}

export interface CustomTheme {
	id: string;
	name: string;
	colors: ThemeColor;
	fonts: {
		heading: string;
		body: string;
	};
	spacing: {
		slidePadding: number;
		contentGap: number;
	};
	borderRadius: number;
	shadows: boolean;
	createdAt: Date;
}

const STORAGE_KEY = "wslide:custom-themes";

export function useThemeBuilder() {
	const themes = ref<CustomTheme[]>([]);
	const currentTheme = ref<CustomTheme | null>(null);
	const isEditing = ref(false);

	const defaultColors: ThemeColor = {
		name: "Default",
		primary: "#3b82f6",
		secondary: "#64748b",
		background: "#ffffff",
		text: "#1e293b",
		accent: "#f59e0b",
	};

	const colorPresets: ThemeColor[] = [
		defaultColors,
		{
			name: "Dark",
			primary: "#60a5fa",
			secondary: "#94a3b8",
			background: "#0f172a",
			text: "#f1f5f9",
			accent: "#fbbf24",
		},
		{
			name: "Warm",
			primary: "#ea580c",
			secondary: "#78716c",
			background: "#fff7ed",
			text: "#431407",
			accent: "#16a34a",
		},
		{
			name: "Cool",
			primary: "#0891b2",
			secondary: "="#64748b",
			background: "#ecfeff",
			text: "#164e63",
			accent: "#8b5cf6",
		},
	];

	const hasCustomThemes = computed(() => themes.value.length > 0);

	function loadThemes() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			themes.value = parsed.map((t: CustomTheme) => ({
				...t,
				createdAt: new Date(t.createdAt),
			}));
		}
	}

	function createTheme(name: string, baseColors?: ThemeColor): CustomTheme {
		const theme: CustomTheme = {
			id: `theme-${Date.now()}`,
			name,
			colors: baseColors || { ...defaultColors },
			fonts: {
				heading: "system-ui",
				body: "system-ui",
			},
			spacing: {
				slidePadding: 48,
				contentGap: 24,
			},
			borderRadius: 8,
			shadows: true,
			createdAt: new Date(),
		};
		
		themes.value.push(theme);
		persistThemes();
		return theme;
	}

	function updateTheme(themeId: string, updates: Partial<CustomTheme>) {
		const index = themes.value.findIndex(t => t.id === themeId);
		if (index > -1) {
			themes.value[index] = { ...themes.value[index], ...updates };
			persistThemes();
		}
	}

	function deleteTheme(themeId: string) {
		const index = themes.value.findIndex(t => t.id === themeId);
		if (index > -1) {
			themes.value.splice(index, 1);
			persistThemes();
		}
	}

	function persistThemes() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(themes.value));
	}

	function applyTheme(theme: CustomTheme) {
		currentTheme.value = theme;
		
		// Apply CSS variables
		const root = document.documentElement;
		root.style.setProperty("--slide-primary", theme.colors.primary);
		root.style.setProperty("--slide-secondary", theme.colors.secondary);
		root.style.setProperty("--slide-bg", theme.colors.background);
		root.style.setProperty("--slide-text", theme.colors.text);
		root.style.setProperty("--slide-accent", theme.colors.accent);
		root.style.setProperty("--slide-font-heading", theme.fonts.heading);
		root.style.setProperty("--slide-font-body", theme.fonts.body);
		root.style.setProperty("--slide-padding", `${theme.spacing.slidePadding}px`);
		root.style.setProperty("--slide-radius", `${theme.borderRadius}px`);
	}

	function generateCSS(theme: CustomTheme): string {
		return `
.wslide-theme-${theme.id} {
	--slide-primary: ${theme.colors.primary};
	--slide-secondary: ${theme.colors.secondary};
	--slide-bg: ${theme.colors.background};
	--slide-text: ${theme.colors.text};
	--slide-accent: ${theme.colors.accent};
	--slide-font-heading: ${theme.fonts.heading};
	--slide-font-body: ${theme.fonts.body};
	--slide-padding: ${theme.spacing.slidePadding}px;
	--slide-radius: ${theme.borderRadius}px;
	--slide-shadows: ${theme.shadows ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none"};
}
		`.trim();
	}

	function exportTheme(themeId: string): string | null {
		const theme = themes.value.find(t => t.id === themeId);
		return theme ? JSON.stringify(theme, null, 2) : null;
	}

	function importTheme(json: string): CustomTheme | null {
		try {
			const theme = JSON.parse(json);
			theme.id = `theme-${Date.now()}`;
			theme.createdAt = new Date();
			themes.value.push(theme);
			persistThemes();
			return theme;
		} catch {
			return null;
		}
	}

	function duplicateTheme(themeId: string): CustomTheme | null {
		const original = themes.value.find(t => t.id === themeId);
		if (!original) return null;
		
		const duplicate: CustomTheme = {
			...original,
			id: `theme-${Date.now()}`,
			name: `${original.name} (Copy)`,
			createdAt: new Date(),
		};
		
		themes.value.push(duplicate);
		persistThemes();
		return duplicate;
	}

	return {
		themes: readonly(themes),
		currentTheme: readonly(currentTheme),
		isEditing: readonly(isEditing),
		colorPresets,
		hasCustomThemes,
		loadThemes,
		createTheme,
		updateTheme,
		deleteTheme,
		applyTheme,
		generateCSS,
		exportTheme,
		importTheme,
		duplicateTheme,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
