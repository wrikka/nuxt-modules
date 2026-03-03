import type { StockAlert } from "~~/shared/types"

export default defineEventHandler(async (_event) => {
	// Mock stock alerts - in real app, this would come from database
	const stockAlerts: StockAlert[] = [
		{
			id: "alert_1",
			productId: "prod_001",
			productName: "น้ำดื่มตราสุขภาพ",
			currentStock: 5,
			minStock: 20,
			maxStock: 100,
			alertType: "low_stock",
			severity: "high",
			message: "สต็อกใกล้หมด ต้องเติมสินค้าในเร็วๆ นี้",
			isRead: false,
			createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
		},
		{
			id: "alert_2",
			productId: "prod_002",
			productName: "ขนมปังปิ้ง",
			currentStock: 0,
			minStock: 10,
			maxStock: 50,
			alertType: "out_of_stock",
			severity: "critical",
			message: "สินค้าหมด! ต้องดำเนินการทันที",
			isRead: false,
			createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
		},
		{
			id: "alert_3",
			productId: "prod_003",
			productName: "กระดาษทิชชู่",
			currentStock: 150,
			minStock: 20,
			maxStock: 100,
			alertType: "overstock",
			severity: "medium",
			message: "สต็อกเกินขีดจำกัด อาจต้องโปรโมชั่นลดราคา",
			isRead: true,
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: "alert_4",
			productId: "prod_004",
			productName: "กาแฟผง",
			currentStock: 8,
			minStock: 15,
			maxStock: 80,
			alertType: "low_stock",
			severity: "medium",
			message: "สต็อกต่ำ ควรสั่งซื้อเพิ่ม",
			isRead: true,
			createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
		},
	]

	return {
		success: true,
		data: stockAlerts,
	}
})
