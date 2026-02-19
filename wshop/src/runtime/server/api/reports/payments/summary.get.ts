export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const period = query.period as string || "today"

	// Mock payment methods summary - in real app, this would come from database
	const paymentMethods = [
		{
			method: "เงินสด",
			type: "cash",
			amount: 35000,
			count: 120,
			percentage: 45,
			averageAmount: 291.67,
			growth: 5.2,
		},
		{
			method: "โอนเงิน",
			type: "transfer",
			amount: 23000,
			count: 85,
			percentage: 30,
			averageAmount: 270.59,
			growth: 12.8,
		},
		{
			method: "บัตรเครดิต",
			type: "card",
			amount: 15000,
			count: 45,
			percentage: 19,
			averageAmount: 333.33,
			growth: -3.5,
		},
		{
			method: "QR Code",
			type: "qr",
			amount: 4000,
			count: 25,
			percentage: 6,
			averageAmount: 160,
			growth: 25.0,
		},
	]

	const totalAmount = paymentMethods.reduce((sum, method) => sum + method.amount, 0)

	// Calculate percentages
	paymentMethods.forEach(method => {
		method.percentage = Math.round((method.amount / totalAmount) * 100)
	})

	return {
		success: true,
		data: {
			paymentMethods,
			totalAmount,
			totalTransactions: paymentMethods.reduce((sum, method) => sum + method.count, 0),
			period,
			lastUpdated: new Date().toISOString(),
		},
	}
})
