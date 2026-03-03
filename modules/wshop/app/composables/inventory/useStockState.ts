import type {
	StockAdjustment,
	StockAlert,
	StockCount,
	StockMovement,
	StockTransfer,
} from "#shared/types"
import { ref } from "vue"

export function useStockState() {
	const stockAlerts = ref<StockAlert[]>([])
	const stockMovements = ref<StockMovement[]>([])
	const stockTransfers = ref<StockTransfer[]>([])
	const stockAdjustments = ref<StockAdjustment[]>([])
	const stockCounts = ref<StockCount[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	return {
		stockAlerts,
		stockMovements,
		stockTransfers,
		stockAdjustments,
		stockCounts,
		loading,
		error,
	}
}
