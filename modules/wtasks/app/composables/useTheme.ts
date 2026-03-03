/**
 * Composable for Dark Mode and Custom Themes
 */
export const useTheme = () => {
	const { $toast } = useNuxtApp()

	const currentTheme = useState<string>("current-theme", () => "light")
	const isDark = computed(() => currentTheme.value === "dark")
	const accentColor = useState<string>("accent-color", () => "#6366f1")

	const availableThemes = [
		{ id: "light", name: "Light", colors: { bg: "#ffffff", text: "#1f2937" } },
		{ id: "dark", name: "Dark", colors: { bg: "#111827", text: "#f9fafb" } },
		{ id: "midnight", name: "Midnight", colors: { bg: "#0f172a", text: "#e2e8f0" } },
		{ id: "forest", name: "Forest", colors: { bg: "#064e3b", text: "#d1fae5" } },
		{ id: "ocean", name: "Ocean", colors: { bg: "#1e3a8a", text: "#dbeafe" } },
		{ id: "sunset", name: "Sunset", colors: { bg: "#7c2d12", text: "#ffedd5" } },
	]

	const accentColors = [
		{ name: "Indigo", value: "#6366f1" },
		{ name: "Blue", value: "#3b82f6" },
		{ name: "Green", value: "#22c55e" },
		{ name: "Red", value: "#ef4444" },
		{ name: "Purple", value: "#8b5cf6" },
		{ name: "Orange", value: "#f97316" },
		{ name: "Pink", value: "#ec4899" },
		{ name: "Teal", value: "#14b8a6" },
	]

	/**
	 * Set theme
	 */
	const setTheme = (themeId: string) => {
		currentTheme.value = themeId
		document.documentElement.classList.remove("light", "dark", "midnight", "forest", "ocean", "sunset")
		document.documentElement.classList.add(themeId)
		document.documentElement.setAttribute("data-theme", themeId)

		// Save preference
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("theme", themeId)
		}
	}

	/**
	 * Toggle dark/light
	 */
	const toggleDarkMode = () => {
		const newTheme = isDark.value ? "light" : "dark"
		setTheme(newTheme)
	}

	/**
	 * Set accent color
	 */
	const setAccentColor = (color: string) => {
		accentColor.value = color
		document.documentElement.style.setProperty("--accent-color", color)

		if (typeof localStorage !== "undefined") {
			localStorage.setItem("accent-color", color)
		}
	}

	/**
	 * Initialize theme from localStorage
	 */
	const initTheme = () => {
		if (typeof localStorage === "undefined") return

		const saved = localStorage.getItem("theme")
		if (saved && availableThemes.find(t => t.id === saved)) {
			setTheme(saved)
		} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setTheme("dark")
		}

		const savedAccent = localStorage.getItem("accent-color")
		if (savedAccent) setAccentColor(savedAccent)
	}

	/**
	 * Get contrast color (black or white) based on background
	 */
	const getContrastColor = (bgColor: string): string => {
		// Convert hex to RGB
		const hex = bgColor.replace("#", "")
		const r = Number.parseInt(hex.substr(0, 2), 16)
		const g = Number.parseInt(hex.substr(2, 2), 16)
		const b = Number.parseInt(hex.substr(4, 2), 16)

		// Calculate luminance
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

		return luminance > 0.5 ? "#1f2937" : "#ffffff"
	}

	/**
	 * High contrast mode toggle
	 */
	const highContrast = useState<boolean>("high-contrast", () => false)

	const toggleHighContrast = () => {
		highContrast.value = !highContrast.value
		document.documentElement.classList.toggle("high-contrast", highContrast.value)

		if (highContrast.value) {
			$toast.success("High contrast mode enabled")
		}
	}

	return {
		currentTheme,
		isDark,
		accentColor,
		availableThemes,
		accentColors,
		highContrast,
		setTheme,
		toggleDarkMode,
		setAccentColor,
		initTheme,
		getContrastColor,
		toggleHighContrast,
	}
}
