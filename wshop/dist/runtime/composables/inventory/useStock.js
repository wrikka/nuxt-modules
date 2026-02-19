import { onMounted, onUnmounted } from "vue";
import { useStockApi } from "./useStockApi.js";
import { useStockState } from "./useStockState.js";
import { useStockWebSocket } from "./useStockWebSocket.js";
export const useStock = () => {
  const stockState = useStockState();
  const {
    stockAlerts,
    stockMovements,
    stockTransfers,
    stockAdjustments,
    stockCounts,
    loading,
    error
  } = stockState;
  const stockWebSocket = useStockWebSocket(
    stockAlerts,
    stockMovements,
    stockTransfers,
    stockAdjustments
  );
  const { initializeWebSocket, socket } = stockWebSocket;
  const stockApi = useStockApi();
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
    getStockStatistics
  } = stockApi;
  onMounted(() => {
    initializeWebSocket();
    loadStockAlerts();
  });
  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
    }
  });
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
    getStockStatistics
  };
};
