export interface WebhookMonitorStats {
	totalWebhooks: number
	activeWebhooks: number
	recentDeliveries: number
	failedDeliveries: number
}

export interface WebhookFormData {
	name: string
	url: string
	events: string[]
	secret: string
	retryPolicy: {
		maxRetries: number
		retryDelay: number
	}
	headersJson: string
}
