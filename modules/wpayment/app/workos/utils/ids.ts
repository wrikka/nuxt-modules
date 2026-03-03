export const generateId = (prefix = ""): string => {
	const timestamp = Date.now()
	const random = Math.random().toString(36).substring(2, 15)
	return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`
}

export const generateSessionId = (): string => {
	return generateId("sess")
}

export const generateWebhookId = (): string => {
	return generateId("webhook")
}

export const generateMiddlewareId = (): string => {
	return generateId("middleware")
}
