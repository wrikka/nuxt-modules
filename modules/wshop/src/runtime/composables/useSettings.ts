import { ref } from "#imports"

export function useSettings() {
	const settings = ref({
		currency: "THB",
		locale: "th",
		dateFormat: "DD/MM/YYYY",
		timeFormat: "24h",
	})

	const updateSettings = (newSettings: Partial<typeof settings.value>) => {
		settings.value = { ...settings.value, ...newSettings }
	}

	return {
		settings,
		updateSettings,
	}
}
