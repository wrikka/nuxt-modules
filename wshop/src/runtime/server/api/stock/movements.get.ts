import type { StockMovement } from "~~/shared/types"

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	// Mock stock movements - in real app, this would come from database with filters
	const stockMovements: StockMovement[] = [
		{
			id: "movement_1",
			productId: "prod_001",
			type: "out",
			quantity: 5,
			reason: "ขายสินค้า",
			reference: "INV-001",
			userId: "user_001",
			createdAt: new Date(Date.now() - 30 * 60 * 1000),
		},
		{
			id: "movement_2",
			productId: "prod_002",
			type: "in",
			quantity: 50,
			reason: "รับสินค้าใหม่",
			reference: "PO-001",
			userId: "user_001",
			createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
		},
		{
			id: "movement_3",
			productId: "prod_003",
			type: "adjust",
			quantity: -10,
			reason: "สินค้าเสียหาย",
			userId: "user_002",
			createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
		},
		{
			id: "movement_4",
			productId: "prod_004",
			type: "transfer",
			quantity: 20,
			reason: "โอนไปยังสาขาอื่น",
			reference: "TRF-001",
			userId: "user_001",
			createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
		},
	]

	// Apply filters if provided
	let filteredMovements = stockMovements

	if (query.productId) {
		filteredMovements = filteredMovements.filter(m => m.productId === query.productId)
	}

	if (query.type) {
		filteredMovements = filteredMovements.filter(m => m.type === query.type)
	}

	return {
		success: true,
		data: filteredMovements,
	}
})
