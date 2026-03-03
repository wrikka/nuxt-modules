export interface WorkOSWebhookConfig {
	id: string
	name: string
	url: string
	events: string[]
	secret?: string
	active: boolean
	retryPolicy: {
		maxRetries: number
		retryDelay: number
	}
	headers?: Record<string, string>
	organizationId?: string
	createdAt: string
	updatedAt: string
}

export interface WorkOSWebhookDelivery {
	id: string
	webhookId: string
	eventId: string
	payload: unknown
	responseCode?: number
	responseBody?: string
	attempt: number
	status: "pending" | "delivered" | "failed" | "retrying"
	deliveredAt?: string
	nextRetryAt?: string
	createdAt: string
}
