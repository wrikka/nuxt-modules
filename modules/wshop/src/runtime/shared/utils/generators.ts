/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "")
}

/**
 * Generate a unique ID using crypto.randomUUID
 */
export function generateId(): string {
	return crypto.randomUUID()
}
