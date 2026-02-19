export const useStockTransfers = () => {
  const loading = ref(false);
  const error = ref(null);
  const createStockTransfer = async (transfer) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch("/api/stock/transfers", {
        method: "POST",
        body: transfer
      });
      return data;
    } catch (err) {
      error.value = "Failed to create stock transfer";
      console.error("Error creating stock transfer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const approveStockTransfer = async (transferId) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch(`/api/stock/transfers/${transferId}/approve`, {
        method: "POST"
      });
      return data;
    } catch (err) {
      error.value = "Failed to approve stock transfer";
      console.error("Error approving stock transfer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const receiveStockTransfer = async (transferId) => {
    try {
      loading.value = true;
      error.value = null;
      const data = await $fetch(`/api/stock/transfers/${transferId}/receive`, {
        method: "POST"
      });
      return data;
    } catch (err) {
      error.value = "Failed to receive stock transfer";
      console.error("Error receiving stock transfer:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const clearError = () => {
    error.value = null;
  };
  return {
    loading: readonly(loading),
    error: readonly(error),
    createStockTransfer,
    approveStockTransfer,
    receiveStockTransfer,
    clearError
  };
};
