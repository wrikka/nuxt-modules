import { onMounted, onUnmounted } from "vue"
import { useStockApi } from "./useStockApi"
import { useStockState } from "./useStockState"
import { useStockWebSocket } from "./useStockWebSocket"

export const useStock = () => {
	// Initialize state
	const stockState = useStockState()
	const {
		stockAlerts,
		stockMovements,
		stockTransfers,
		stockAdjustments,
		stockCounts,
		loading,
		error,
	} = stockState

	// Initialize WebSocket
	const stockWebSocket = useStockWebSocket(
		stockAlerts,
		stockMovements,
		stockTransfers,
		stockAdjustments,
	)
	const { initializeWebSocket, socket } = stockWebSocket

	// Initialize API methods
	const stockApi = useStockApi()
	const {
		loadStockAlerts,
		loadStockMovements,
		createStockMovement,
		createStockAdjustment,
		createStockTransfer,
		approveStockTransfer,
		receiveStockTransfer,
		createStockCount,
		getLowStockProducts,
		updateProductStock,
		markAlertAsRead,
		getStockStatistics,
	} = stockApi

	// Initialize on mount
	onMounted(() => {
		initializeWebSocket()
		loadStockAlerts()
	})

	// Cleanup on unmount
	onUnmounted(() => {
		if (socket.value) {
			socket.value.close()
		}
	})

	return {
		// State
		stockAlerts: readonly(stockAlerts),
		stockMovements: readonly(stockMovements),
		stockTransfers: readonly(stockTransfers),
		stockAdjustments: readonly(stockAdjustments),
		stockCounts: readonly(stockCounts),
		loading: readonly(loading),
		error: readonly(error),

		// Methods
		loadStockAlerts,
		loadStockMovements,
		createStockMovement,
		createStockAdjustment,
		createStockTransfer,
		approveStockTransfer,
		receiveStockTransfer,
		createStockCount,
		getLowStockProducts,
		updateProductStock,
		markAlertAsRead,
		getStockStatistics,
	}
}
