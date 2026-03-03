// d:/wshop/app/composables/useTheme.ts

import { computed, useFetch, watchEffect } from "#imports"

interface ThemeConfig {
	colors: {
		primary: string
		secondary: string
		accent: string
		background: string
		text: string
	}
	fonts: {
		heading: string
		body: string
	}
	spacing: {
		container: string
		section: string
	}
}

interface SettingsData {
	themeConfig?: ThemeConfig
	[key: string]: unknown
}

export const useTheme = () => {
	const { data: settings, pending, error } = useFetch<SettingsData>("/api/settings")

	const themeConfig = computed<ThemeConfig>(() => {
		const s = settings.value
		if (s && s.themeConfig) {
			return s.themeConfig as ThemeConfig
		}
		return {
			colors: {
				primary: "#000000",
				secondary: "#ffffff",
				accent: "#3b82f6",
				background: "#ffffff",
				text: "#000000",
			},
			fonts: {
				heading: "Inter",
				body: "Inter",
			},
			spacing: {
				container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
				section: "py-12",
			},
		}
	})

	// Apply theme config to CSS variables
	const applyTheme = () => {
		if (typeof document === "undefined") return

		const root = document.documentElement

		// Colors
		root.style.setProperty("--color-primary", themeConfig.value.colors.primary)
		root.style.setProperty("--color-secondary", themeConfig.value.colors.secondary)
		root.style.setProperty("--color-accent", themeConfig.value.colors.accent)
		root.style.setProperty("--color-background", themeConfig.value.colors.background)
		root.style.setProperty("--color-text", themeConfig.value.colors.text)

		// Fonts
		root.style.setProperty("--font-heading", themeConfig.value.fonts.heading)
		root.style.setProperty("--font-body", themeConfig.value.fonts.body)

		// Spacing
		root.style.setProperty("--spacing-container", themeConfig.value.spacing.container)
		root.style.setProperty("--spacing-section", themeConfig.value.spacing.section)
	}

	// Apply theme when settings are loaded
	watchEffect(() => {
		if (!pending.value && !error.value) {
			applyTheme()
		}
	})

	return {
		themeConfig,
		pending,
		error,
		applyTheme,
	}
}
