/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = "THB", locale = "th-TH"): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount)
}

/**
 * Format date with locale
 */
export function formatDate(date: string | Date, locale = "th-TH"): string {
	const dateObj = typeof date === "string" ? new Date(date) : date
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(dateObj)
}

/**
 * Format date time with locale
 */
export function formatDateTime(date: string | Date, locale = "th-TH"): string {
	const dateObj = typeof date === "string" ? new Date(date) : date
	return new Intl.DateTimeFormat(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(dateObj)
}

/**
 * Format a map of options into a string
 */
export const formatOptions = (options: { [key: string]: string }): string => {
	if (!options || Object.keys(options).length === 0) {
		return ""
	}
	return Object.entries(options)
		.map(([key, value]) => `${key}: ${value}`)
		.join(", ")
}
