import type { WorkOSWebhookConfig, WorkOSWebhookDelivery } from "../shared/types/webhooks"
import { generateWebhookId } from "../utils"

export type { WorkOSWebhookConfig, WorkOSWebhookDelivery }

export const useWorkOSWebhooks = () => {
	const createWebhook = async (
		config: Omit<WorkOSWebhookConfig, "id" | "createdAt" | "updatedAt">,
	): Promise<WorkOSWebhookConfig> => {
		return await $fetch("/api/workos/webhooks", {
			method: "POST",
			body: {
				...config,
				id: generateWebhookId(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const updateWebhook = async (
		id: string,
		updates: Partial<WorkOSWebhookConfig>,
	): Promise<WorkOSWebhookConfig> => {
		return await $fetch(`/api/workos/webhooks/${id}`, {
			method: "PUT",
			body: {
				...updates,
				updatedAt: new Date().toISOString(),
			},
		})
	}

	const deleteWebhook = async (id: string): Promise<void> => {
		await $fetch(`/api/workos/webhooks/${id}`, {
			method: "DELETE",
		})
	}

	const getWebhooks = async (organizationId?: string): Promise<WorkOSWebhookConfig[]> => {
		const query = organizationId ? `?organizationId=${organizationId}` : ""
		return await $fetch(`/api/workos/webhooks${query}`)
	}

	const getWebhook = async (id: string): Promise<WorkOSWebhookConfig> => {
		return await $fetch(`/api/workos/webhooks/${id}`)
	}

	const testWebhook = async (id: string, testEvent?: string): Promise<{
		success: boolean
		deliveryId: string
	}> => {
		return await $fetch(`/api/workos/webhooks/${id}/test`, {
			method: "POST",
			body: { testEvent },
		})
	}

	const getWebhookDeliveries = async (webhookId: string): Promise<WorkOSWebhookDelivery[]> => {
		return await $fetch(`/api/workos/webhooks/${webhookId}/deliveries`)
	}

	const retryWebhookDelivery = async (deliveryId: string): Promise<WorkOSWebhookDelivery> => {
		return await $fetch(`/api/workos/webhooks/deliveries/${deliveryId}/retry`, {
			method: "POST",
		})
	}

	const processWebhookEvent = async (event: Record<string, unknown>): Promise<void> => {
		await $fetch("/api/workos/webhooks/process", {
			method: "POST",
			body: event,
		})
	}

	return {
		createWebhook,
		updateWebhook,
		deleteWebhook,
		getWebhooks,
		getWebhook,
		testWebhook,
		getWebhookDeliveries,
		retryWebhookDelivery,
		processWebhookEvent,
	}
}
