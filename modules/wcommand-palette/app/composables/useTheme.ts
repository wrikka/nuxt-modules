import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { ThemePreset } from '../types'

const STORAGE_KEY = 'palette-theme'

export interface UseThemeReturn {
	/** Current theme */
	theme: Ref<ThemePreset>
	/** Available themes */
	themes: ThemePreset[]
	/** Set theme */
	setTheme: (preset: ThemePreset) => void
	/** Apply theme to document */
	applyTheme: () => void
	/** Theme CSS variables */
	themeVars: Ref<Record<string, string>>
	/** Whether dark mode is active */
	isDark: Ref<boolean>
	/** Toggle dark/light */
	toggleDark: () => void
	/** Cycle through themes */
	cycleTheme: () => void
}

const themeVars: Record<ThemePreset, Record<string, string>> = {
	dark: {
		'--palette-bg': '#1a1a1a',
		'--palette-bg-overlay': 'rgba(0, 0, 0, 0.8)',
		'--palette-surface': '#2d2d2d',
		'--palette-border': '#404040',
		'--palette-text': '#ffffff',
		'--palette-text-secondary': '#a0a0a0',
		'--palette-text-muted': '#666666',
		'--palette-accent': '#3b82f6',
		'--palette-accent-hover': '#2563eb',
		'--palette-selected': '#3b82f620',
		'--palette-hover': '#404040',
		'--palette-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
		'--palette-radius': '12px',
		'--palette-transition': 'all 0.2s ease',
	},
	light: {
		'--palette-bg': '#ffffff',
		'--palette-bg-overlay': 'rgba(0, 0, 0, 0.5)',
		'--palette-surface': '#ffffff',
		'--palette-border': '#e5e7eb',
		'--palette-text': '#111827',
		'--palette-text-secondary': '#6b7280',
		'--palette-text-muted': '#9ca3af',
		'--palette-accent': '#3b82f6',
		'--palette-accent-hover': '#2563eb',
		'--palette-selected': '#eff6ff',
		'--palette-hover': '#f3f4f6',
		'--palette-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		'--palette-radius': '12px',
		'--palette-transition': 'all 0.2s ease',
	},
	'high-contrast': {
		'--palette-bg': '#000000',
		'--palette-bg-overlay': 'rgba(0, 0, 0, 0.95)',
		'--palette-surface': '#000000',
		'--palette-border': '#ffffff',
		'--palette-text': '#ffffff',
		'--palette-text-secondary': '#ffffff',
		'--palette-text-muted': '#cccccc',
		'--palette-accent': '#ffff00',
		'--palette-accent-hover': '#cccc00',
		'--palette-selected': '#ffff0020',
		'--palette-hover': '#333333',
		'--palette-shadow': '0 0 0 2px #ffffff',
		'--palette-radius': '0px',
		'--palette-transition': 'none',
	},
	auto: {}, // Uses system preference
}

export function useTheme(): UseThemeReturn {
	const theme = ref<ThemePreset>('dark')
	const themes: ThemePreset[] = ['dark', 'light', 'high-contrast', 'auto']

	const loadTheme = () => {
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored && themes.includes(stored as ThemePreset)) {
				theme.value = stored as ThemePreset
			}
		}
	}

	const saveTheme = () => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, theme.value)
		}
	}

	const setTheme = (preset: ThemePreset) => {
		theme.value = preset
		saveTheme()
		applyTheme()
	}

	const getSystemTheme = (): 'dark' | 'light' => {
		if (typeof window !== 'undefined' && window.matchMedia) {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
		}
		return 'dark'
	}

	const applyTheme = () => {
		if (typeof document === 'undefined') return

		const effectiveTheme = theme.value === 'auto'
			? getSystemTheme()
			: theme.value

		const vars = themeVars[effectiveTheme]
		const root = document.documentElement

		for (const [key, value] of Object.entries(vars)) {
			root.style.setProperty(key, value)
		}

		// Add theme class
		document.body.classList.remove('palette-theme-dark', 'palette-theme-light', 'palette-theme-high-contrast')
		document.body.classList.add(`palette-theme-${effectiveTheme}`)
	}

	const isDark = computed(() => {
		if (theme.value === 'auto') {
			return getSystemTheme() === 'dark'
		}
		return theme.value === 'dark' || theme.value === 'high-contrast'
	})

	const toggleDark = () => {
		if (theme.value === 'dark') {
			setTheme('light')
		} else if (theme.value === 'light') {
			setTheme('dark')
		} else if (theme.value === 'auto') {
			setTheme(getSystemTheme() === 'dark' ? 'light' : 'dark')
		}
	}

	const cycleTheme = () => {
		const currentIndex = themes.indexOf(theme.value)
		const nextIndex = (currentIndex + 1) % themes.length
		setTheme(themes[nextIndex])
	}

	const currentVars = computed(() => {
		const effectiveTheme = theme.value === 'auto'
			? getSystemTheme()
			: theme.value
		return themeVars[effectiveTheme]
	})

	// Load and apply on init
	loadTheme()
	applyTheme()

	// Watch for system changes in auto mode
	if (typeof window !== 'undefined') {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
			if (theme.value === 'auto') {
				applyTheme()
			}
		})
	}

	return {
		theme,
		themes,
		setTheme,
		applyTheme,
		themeVars: currentVars,
		isDark,
		toggleDark,
		cycleTheme,
	}
}
