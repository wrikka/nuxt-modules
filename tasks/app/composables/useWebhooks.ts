import type { WebhookConfig, WebhookProvider, List } from "~/shared/types"
import { readonly, ref } from "vue"

export function useWebhooks() {
	const webhooks = ref<WebhookConfig[]>([])
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	async function fetchWebhooks(): Promise<void> {
		isLoading.value = true
		try {
			const response = await $fetch<WebhookConfig[]>(`/api/integrations/webhooks`)
			webhooks.value = response
		}
		catch (e) {
			error.value = e as Error
		}
		finally {
			isLoading.value = false
		}
	}

	async function createWebhook(config: Omit<WebhookConfig, "id" | "createdAt">): Promise<WebhookConfig> {
		const response = await $fetch<WebhookConfig>(`/api/integrations/webhooks`, {
			method: "POST",
			body: config,
		})
		webhooks.value.push(response)
		return response
	}

	async function updateWebhook(id: string, updates: Partial<WebhookConfig>): Promise<void> {
		const response = await $fetch<WebhookConfig>(`/api/integrations/webhooks/${id}`, {
			method: "PATCH",
			body: updates,
		})
		const index = webhooks.value.findIndex(w => w.id === id)
		if (index !== -1) {
			webhooks.value[index] = response
		}
	}

	async function deleteWebhook(id: string): Promise<void> {
		await $fetch(`/api/integrations/webhooks/${id}`, {
			method: "DELETE",
		})
		webhooks.value = webhooks.value.filter(w => w.id !== id)
	}

	async function testWebhook(id: string): Promise<{ success: boolean, message: string }> {
		return await $fetch(`/api/integrations/webhooks/${id}/test`, {
			method: "POST",
		})
	}

	function getProviderIcon(provider: WebhookProvider): string {
		const icons: Record<WebhookProvider, string> = {
			slack: "i-simple-icons-slack",
			discord: "i-simple-icons-discord",
		}
		return icons[provider]
	}

	function getProviderColor(provider: WebhookProvider): string {
		const colors: Record<WebhookProvider, string> = {
			slack: "#4A154B",
			discord: "#5865F2",
		}
		return colors[provider]
	}

	return {
		webhooks: readonly(webhooks),
		isLoading: readonly(isLoading),
		error: readonly(error),
		fetchWebhooks,
		createWebhook,
		updateWebhook,
		deleteWebhook,
		testWebhook,
		getProviderIcon,
		getProviderColor,
	}
}
