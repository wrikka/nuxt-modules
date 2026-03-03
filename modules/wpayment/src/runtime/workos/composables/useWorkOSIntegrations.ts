import type { Integration } from "../shared/types/advanced"

export const useWorkOSIntegrations = () => {
	const getIntegrations = async (category?: string): Promise<Integration[]> => {
		const query = category ? `?category=${category}` : ""
		return await $fetch(`/api/workos/integrations${query}`)
	}

	const installIntegration = async (
		integrationId: string,
		config: Record<string, unknown>,
	): Promise<{
		installationId: string
		status: string
	}> => {
		return await $fetch(`/api/workos/integrations/${integrationId}/install`, {
			method: "POST",
			body: config,
		})
	}

	const uninstallIntegration = async (installationId: string): Promise<void> => {
		await $fetch(`/api/workos/integrations/${installationId}`, {
			method: "DELETE",
		})
	}

	const getInstalledIntegrations = async (organizationId?: string): Promise<
		Array<
			Integration & {
				installationId: string
				config: Record<string, unknown>
				installedAt: string
			}
		>
	> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/integrations/installed${query}`)
	}

	return {
		getIntegrations,
		installIntegration,
		uninstallIntegration,
		getInstalledIntegrations,
	}
}
