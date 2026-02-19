export const useStockOperations = () => {
  const loading = ref(false);
  const error = ref(null);
  const loadStockMovements = async (filters) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/stock/movements", {
        query: filters
      });
      return data;
    } catch (err) {
      error.value = "Failed to load stock movements";
      console.error("Error loading stock movements:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const createStockMovement = async (movement) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/stock/movements", {
        method: "POST",
        body: movement
      });
      return data;
    } catch (err) {
      error.value = "Failed to create stock movement";
      console.error("Error creating stock movement:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const createStockAdjustment = async (adjustment) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/stock/adjustments", {
        method: "POST",
        body: adjustment
      });
      return data;
    } catch (err) {
      error.value = "Failed to create stock adjustment";
      console.error("Error creating stock adjustment:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const createStockCount = async (count) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/stock/counts", {
        method: "POST",
        body: count
      });
      return data;
    } catch (err) {
      error.value = "Failed to create stock count";
      console.error("Error creating stock count:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const updateProductStock = async (productId, quantity, type) => {
    try {
      error.value = null;
      await $fetch(`/api/products/${productId}/stock`, {
        method: "PUT",
        body: { quantity, type }
      });
    } catch (err) {
      error.value = "Failed to update product stock";
      console.error("Error updating product stock:", err);
      throw err;
    }
  };
  const clearError = () => {
    error.value = null;
  };
  return {
    loading: readonly(loading),
    error: readonly(error),
    loadStockMovements,
    createStockMovement,
    createStockAdjustment,
    createStockCount,
    updateProductStock,
    clearError
  };
};
