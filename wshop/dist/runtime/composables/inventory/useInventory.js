import { computed, onMounted, onUnmounted, ref } from "vue";
import { useInventoryApi } from "./useInventoryApi.js";
import { useInventorySocket } from "./useInventorySocket.js";
export function useInventory() {
  const inventory = ref([]);
  const products = ref([]);
  const stockMovements = ref([]);
  const stockAlerts = ref([]);
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const api = useInventoryApi();
  const socket = useInventorySocket(inventory, stockMovements, stockAlerts);
  const totalProducts = computed(() => inventory.value.length);
  const inStockCount = computed(
    () => inventory.value.filter((item) => item.availableQuantity > 10).length
  );
  const lowStockCount = computed(
    () => inventory.value.filter(
      (item) => item.availableQuantity > 0 && item.availableQuantity <= 10
    ).length
  );
  const outOfStockCount = computed(
    () => inventory.value.filter((item) => item.availableQuantity === 0).length
  );
  const lowStockItems = computed(
    () => inventory.value.filter(
      (item) => item.availableQuantity <= item.reorderLevel && item.availableQuantity > 0
    )
  );
  const outOfStockItems = computed(
    () => inventory.value.filter((item) => item.availableQuantity === 0)
  );
  const loadData = async (loader, state, errorMessage) => {
    try {
      state.value = await loader();
    } catch (err) {
      console.error(errorMessage, err);
    }
  };
  const loadAllData = async () => {
    loading.value = true;
    error.value = null;
    await Promise.all([
      loadData(api.fetchInventory, inventory, "Failed to load inventory"),
      loadData(api.fetchProducts, products, "Failed to load products"),
      loadData(api.fetchStockAlerts, stockAlerts, "Failed to load stock alerts")
    ]);
    loading.value = false;
  };
  const executeProcessingAction = async (action, errorMessage) => {
    processing.value = true;
    error.value = null;
    try {
      await action();
    } catch (err) {
      error.value = err instanceof Error ? err.message : errorMessage;
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const adjustStock = async (adjustment) => {
    await executeProcessingAction(async () => {
      await api.adjustStock(adjustment);
      await loadAllData();
    }, "Failed to adjust stock");
  };
  const updateInventoryItem = async (id, updates) => {
    await executeProcessingAction(async () => {
      await api.updateInventoryItem(id, updates);
      await loadAllData();
    }, "Failed to update inventory");
  };
  const bulkUpdateInventory = async (updates) => {
    await executeProcessingAction(async () => {
      await api.bulkUpdateInventory(updates);
      await loadAllData();
    }, "Failed to bulk update inventory");
  };
  onMounted(() => {
    loadAllData();
    socket.connect();
  });
  onUnmounted(() => {
    socket.disconnect();
  });
  return {
    inventory,
    products,
    stockMovements,
    stockAlerts,
    loading,
    processing,
    error,
    totalProducts,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    lowStockItems,
    outOfStockItems,
    loadInventory: () => loadData(api.fetchInventory, inventory, "Failed to load inventory"),
    loadProducts: () => loadData(api.fetchProducts, products, "Failed to load products"),
    loadStockMovements: (productId) => loadData(
      () => api.fetchStockMovements(productId),
      stockMovements,
      "Failed to load stock movements"
    ),
    loadStockAlerts: () => loadData(api.fetchStockAlerts, stockAlerts, "Failed to load stock alerts"),
    adjustStock,
    updateInventoryItem,
    bulkUpdateInventory,
    exportInventory: api.exportInventory,
    markAlertAsRead: api.markAlertAsRead,
    dismissAlert: api.dismissAlert,
    subscribeToInventoryUpdates: () => {
      socket.connect();
      return socket.disconnect;
    },
    getInventoryByProductId: (productId) => inventory.value.find((item) => item.productId === productId),
    getStockStatus: (productId) => {
      const item = inventory.value.find((item2) => item2.productId === productId);
      if (!item) return "unknown";
      if (item.availableQuantity === 0) return "out_of_stock";
      if (item.availableQuantity <= item.reorderLevel) return "low_stock";
      return "in_stock";
    },
    calculateInventoryValue: () => inventory.value.reduce((total, item) => {
      const product = products.value.find((p) => p.id === item.productId);
      return total + item.quantity * parseFloat(product?.price || "0");
    }, 0),
    getTopMovingProducts: (limit = 10) => stockMovements.value.reduce(
      (acc, movement) => {
        const productIdAsNumber = parseInt(movement.productId, 10);
        const existing = acc.find(
          (item) => item.productId === productIdAsNumber
        );
        if (existing) {
          existing.totalQuantity += Math.abs(movement.quantity);
        } else {
          acc.push({
            productId: productIdAsNumber,
            totalQuantity: Math.abs(movement.quantity),
            movements: 1
          });
        }
        return acc;
      },
      []
    ).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    ).slice(0, limit)
  };
}
