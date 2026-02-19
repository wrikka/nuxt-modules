export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const period = query.period as string || "today"

	// Mock real-time sales data - in real app, this would come from database
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

	let startDate: Date
	let previousStartDate: Date
	let previousEndDate: Date

	switch (period) {
		case "today":
			startDate = today
			previousStartDate = new Date(today.getTime() - 24 * 60 * 60 * 1000)
			previousEndDate = today
			break
		case "week":
			startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
			previousStartDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
			previousEndDate = startDate
			break
		case "month":
			startDate = new Date(today.getFullYear(), today.getMonth(), 1)
			previousStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
			previousEndDate = startDate
			break
		case "year":
			startDate = new Date(today.getFullYear(), 0, 1)
			previousStartDate = new Date(today.getFullYear() - 1, 0, 1)
			previousEndDate = startDate
			break
		default:
			startDate = today
			previousStartDate = new Date(today.getTime() - 24 * 60 * 60 * 1000)
			previousEndDate = today
	}

	// Generate mock data
	const generateSalesData = (start: Date, end: Date) => {
		const days = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
		const baseDailySales = 25000
		const baseDailyOrders = 45
		const baseDailyCustomers = 35
		const baseDailyItems = 120

		// Add some randomness
		const randomFactor = 0.8 + Math.random() * 0.4

		return {
			total: Math.floor(baseDailySales * days * randomFactor),
			orders: Math.floor(baseDailyOrders * days * randomFactor),
			customers: Math.floor(baseDailyCustomers * days * randomFactor),
			newCustomers: Math.floor(baseDailyCustomers * 0.3 * days * randomFactor),
			items: Math.floor(baseDailyItems * days * randomFactor),
			uniqueProducts: Math.floor(50 + Math.random() * 20),
		}
	}

	const todayData = generateSalesData(startDate, now)
	const previousData = generateSalesData(previousStartDate, previousEndDate)

	return {
		success: true,
		data: {
			today: todayData,
			previous: previousData,
			period,
			lastUpdated: now.toISOString(),
		},
	}
})
