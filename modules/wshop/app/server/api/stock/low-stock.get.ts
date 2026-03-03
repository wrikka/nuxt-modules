import type { StockAlert } from "~~/shared/types"

export default defineEventHandler(async (_event) => {
	// Mock low stock products - in real app, this would come from database
	const lowStockProducts: StockAlert[] = [
		{
			id: "low_stock_1",
			productId: "prod_001",
			productName: "น้ำดื่มตราสุขภาพ",
			currentStock: 5,
			minStock: 20,
			maxStock: 100,
			alertType: "low_stock",
			severity: "high",
			message: "สต็อกใกล้หมด ต้องเติมสินค้าในเร็วๆ นี้",
			isRead: false,
			createdAt: new Date(),
		},
		{
			id: "low_stock_2",
			productId: "prod_002",
			productName: "ขนมปังปิ้ง",
			currentStock: 0,
			minStock: 10,
			maxStock: 50,
			alertType: "out_of_stock",
			severity: "critical",
			message: "สินค้าหมด! ต้องดำเนินการทันที",
			isRead: false,
			createdAt: new Date(),
		},
		{
			id: "low_stock_3",
			productId: "prod_005",
			productName: "น้ำยาล้างจาน",
			currentStock: 3,
			minStock: 8,
			maxStock: 40,
			alertType: "low_stock",
			severity: "medium",
			message: "สต็อกต่ำ ควรสั่งซื้อเพิ่ม",
			isRead: true,
			createdAt: new Date(),
		},
	]

	return {
		success: true,
		data: lowStockProducts,
	}
})
