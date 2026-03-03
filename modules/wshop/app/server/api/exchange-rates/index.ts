// d:/wshop/server/api/exchange-rates/index.ts

// In-memory cache to simulate fetching from an external API
let cachedRates: { rates: Record<string, number>; lastUpdated: string } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: Fetch current exchange rates
	if (method === "GET") {
		try {
			const now = new Date()
			// Check cache validity
			if (
				cachedRates
				&& (now.getTime() - new Date(cachedRates.lastUpdated).getTime() < CACHE_DURATION)
			) {
				return cachedRates
			}

			// In production, you would fetch from a real API like ExchangeRate-API or Fixer.io
			const rates = {
				THB: 1,
				USD: 0.028,
				EUR: 0.026,
				GBP: 0.022,
				JPY: 4.2,
				CNY: 0.20,
			}

			cachedRates = { rates, lastUpdated: now.toISOString() }
			return cachedRates
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching exchange rates:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch exchange rates: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
