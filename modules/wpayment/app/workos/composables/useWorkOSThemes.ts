import type { ThemeConfig } from "../shared/types/advanced"
import { generateId } from "../utils"

export const useWorkOSThemes = () => {
	const createTheme = async (
		theme: Omit<ThemeConfig, "id" | "createdAt" | "updatedAt">,
	): Promise<ThemeConfig> => {
		return await $fetch("/api/workos/themes", {
			method: "POST",
			body: {
				...theme,
				id: generateId(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const getThemes = async (organizationId?: string): Promise<ThemeConfig[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/themes${query}`)
	}

	const applyTheme = async (themeId: string): Promise<void> => {
		await $fetch(`/api/workos/themes/${themeId}/apply`, {
			method: "POST",
		})
	}

	return {
		createTheme,
		getThemes,
		applyTheme,
	}
}
