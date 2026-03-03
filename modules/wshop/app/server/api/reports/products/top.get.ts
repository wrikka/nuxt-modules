export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const limit = parseInt(query.limit as string) || 10

	// Mock top products data - in real app, this would come from database
	const topProducts = [
		{
			id: "prod_001",
			name: "น้ำดื่มตราสุขภาพ",
			category: "เครื่องดื่ม",
			sales: 12500,
			quantity: 250,
			averagePrice: 50,
			growth: 15.5,
		},
		{
			id: "prod_002",
			name: "ขนมปังปิ้ง",
			category: "ขนมขบเคี้ยว",
			sales: 8900,
			quantity: 178,
			averagePrice: 50,
			growth: 8.2,
		},
		{
			id: "prod_003",
			name: "กาแฟผง",
			category: "เครื่องดื่ม",
			sales: 6700,
			quantity: 134,
			averagePrice: 50,
			growth: -2.1,
		},
		{
			id: "prod_004",
			name: "กระดาษทิชชู่",
			category: "ของใช้ในบ้าน",
			sales: 4500,
			quantity: 90,
			averagePrice: 50,
			growth: 5.8,
		},
		{
			id: "prod_005",
			name: "น้ำยาล้างจาน",
			category: "ของใช้ในบ้าน",
			sales: 3200,
			quantity: 64,
			averagePrice: 50,
			growth: 12.3,
		},
		{
			id: "prod_006",
			name: "มาม่า",
			category: "อาหารแห้ง",
			sales: 2800,
			quantity: 56,
			averagePrice: 50,
			growth: 3.7,
		},
		{
			id: "prod_007",
			name: "น้ำปลา",
			category: "อาหารแห้ง",
			sales: 2400,
			quantity: 48,
			averagePrice: 50,
			growth: -1.5,
		},
		{
			id: "prod_008",
			name: "สบู่",
			category: "ของใช้ในบ้าน",
			sales: 2100,
			quantity: 42,
			averagePrice: 50,
			growth: 7.9,
		},
		{
			id: "prod_009",
			name: "ยาสีฟัน",
			category: "ของใช้ส่วนตัว",
			sales: 1900,
			quantity: 38,
			averagePrice: 50,
			growth: 4.2,
		},
		{
			id: "prod_010",
			name: "ชาเย็น",
			category: "เครื่องดื่ม",
			sales: 1700,
			quantity: 34,
			averagePrice: 50,
			growth: 9.6,
		},
	].slice(0, limit)

	return {
		success: true,
		data: topProducts,
	}
})
