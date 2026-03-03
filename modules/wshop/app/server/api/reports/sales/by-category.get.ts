export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const period = query.period as string || "today"

	// Mock sales by category data - in real app, this would come from database
	const salesByCategory = [
		{
			category: "เครื่องดื่ม",
			sales: 25000,
			quantity: 500,
			orders: 180,
			percentage: 35,
			growth: 12.5,
		},
		{
			category: "ขนมขบเคี้ยว",
			sales: 18000,
			quantity: 360,
			orders: 120,
			percentage: 25,
			growth: 8.3,
		},
		{
			category: "ของใช้ในบ้าน",
			sales: 15000,
			quantity: 300,
			orders: 90,
			percentage: 21,
			growth: -2.1,
		},
		{
			category: "อาหารแห้ง",
			sales: 13000,
			quantity: 260,
			orders: 75,
			percentage: 19,
			growth: 5.7,
		},
	]

	const totalSales = salesByCategory.reduce((sum, cat) => sum + cat.sales, 0)

	// Calculate percentages
	salesByCategory.forEach(cat => {
		cat.percentage = Math.round((cat.sales / totalSales) * 100)
	})

	return {
		success: true,
		data: {
			categories: salesByCategory,
			totalSales,
			period,
			lastUpdated: new Date().toISOString(),
		},
	}
})
