export const movementTypes = [
	{ value: "in", label: "นำเข้า", icon: "lucide:plus", color: "green" },
	{ value: "out", label: "นำออก", icon: "lucide:minus", color: "red" },
	{ value: "adjust", label: "ปรับปรุง", icon: "lucide:edit", color: "blue" },
	{ value: "transfer", label: "โอนย้าย", icon: "lucide:package", color: "purple" },
] as const

export const getCommonReasons = (type: StockMovement["type"]) => {
	const reasons: Record<StockMovement["type"], string[]> = {
		in: ["รับสินค้าใหม่", "คืนสินค้าจากลูกค้า", "คืนสินค้าจากผู้จัดจำหน่าย", "แก้ไขข้อผิดพลาด", "อื่นๆ"],
		out: ["ขายสินค้า", "คืนสินค้าให้ผู้จัดจำหน่าย", "สินค้าเสียหาย", "สินค้าหาย", "อื่นๆ"],
		adjust: ["นับสต็อก", "แก้ไขข้อผิดพลาด", "สินค้าเสียหาย", "สินค้าหมดอายุ", "อื่นๆ"],
		transfer: ["โอนไปยังสาขาอื่น", "โอนจากสาขาอื่น", "โอนภายในร้าน", "อื่นๆ"],
	}
	return reasons[type] || ["อื่นๆ"]
}
