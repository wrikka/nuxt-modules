export function useInventoryApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchInventory = async () => {
    try {
      return await $fetch("/api/inventory");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load inventory"));
    }
  };
  const fetchProducts = async () => {
    try {
      return await $fetch("/api/products");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load products"));
    }
  };
  const fetchStockMovements = async (productId) => {
    try {
      const url = productId ? `/api/inventory/movements?productId=${productId}` : "/api/inventory/movements";
      return await $fetch(url);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load stock movements"));
    }
  };
  const fetchStockAlerts = async () => {
    try {
      return await $fetch("/api/inventory/alerts");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load stock alerts"));
    }
  };
  const adjustStock = async (adjustment) => {
    try {
      return await $fetch("/api/inventory/adjust", {
        method: "POST",
        body: adjustment
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to adjust stock"));
    }
  };
  const updateInventoryItem = async (id, updates) => {
    try {
      return await $fetch(`/api/inventory/${id}`, {
        method: "post",
        body: updates
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update inventory"));
    }
  };
  const bulkUpdateInventory = async (updates) => {
    try {
      return await $fetch("/api/inventory/bulk-update", {
        method: "get",
        query: { updates }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to bulk update inventory"));
    }
  };
  const exportInventory = async (format = "csv") => {
    try {
      return await $fetch(`/api/inventory/export?format=${format}`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to export inventory"));
    }
  };
  const markAlertAsRead = async (alertId) => {
    try {
      return await $fetch(`/api/inventory/alerts/${alertId}/read`, { method: "put" });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to mark alert as read"));
    }
  };
  const dismissAlert = async (alertId) => {
    try {
      return await $fetch(`/api/inventory/alerts/${alertId}/dismiss`, { method: "DELETE" });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to dismiss alert"));
    }
  };
  return {
    fetchInventory,
    fetchProducts,
    fetchStockMovements,
    fetchStockAlerts,
    adjustStock,
    updateInventoryItem,
    bulkUpdateInventory,
    exportInventory,
    markAlertAsRead,
    dismissAlert
  };
}
