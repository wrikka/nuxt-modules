export function usePointOfSaleApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchRegisters = async () => {
    try {
      return await $fetch("/api/pos/registers");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch registers"));
    }
  };
  const fetchCategories = async () => {
    try {
      return await $fetch("/api/categories");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch categories"));
    }
  };
  const fetchProducts = async () => {
    try {
      return await $fetch("/api/products");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch products"));
    }
  };
  const fetchCustomers = async () => {
    try {
      return await $fetch("/api/customers");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to fetch customers"));
    }
  };
  const updateVariantStock = async (variantId, newStock) => {
    try {
      return await $fetch(`/api/products/variants/${variantId}`, {
        method: "PUT",
        body: { stock: newStock }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update variant stock"));
    }
  };
  const processSale = async (saleData) => {
    try {
      return await $fetch("/api/pos/sessions", { method: "POST", body: saleData });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to process payment"));
    }
  };
  const suspendSale = async (saleData) => {
    try {
      return await $fetch("/api/pos/suspended-sales", { method: "POST", body: saleData });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to suspend sale"));
    }
  };
  const fetchSuspendedSales = async () => {
    try {
      return await $fetch("/api/pos/suspended-sales");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load suspended sales"));
    }
  };
  const fetchSuspendedSale = async (sessionId) => {
    try {
      return await $fetch(`/api/pos/suspended-sales/${sessionId}`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to resume suspended sale"));
    }
  };
  const closeRegister = async (registerId) => {
    try {
      return await $fetch(`/api/pos/registers/${registerId}/close`, {
        method: "PUT",
        body: { closedAt: (/* @__PURE__ */ new Date()).toISOString() }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to end shift"));
    }
  };
  const openRegister = async (registerId, staffId) => {
    try {
      return await $fetch(`/api/pos/registers/${registerId}/open`, {
        method: "PUT",
        body: { currentStaffId: staffId, openedAt: (/* @__PURE__ */ new Date()).toISOString() }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to open register"));
    }
  };
  const fetchSalesHistory = async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await $fetch(`/api/pos/sales?${query}`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to get sales history"));
    }
  };
  return {
    fetchRegisters,
    fetchCategories,
    fetchProducts,
    fetchCustomers,
    updateVariantStock,
    processSale,
    suspendSale,
    fetchSuspendedSales,
    fetchSuspendedSale,
    closeRegister,
    openRegister,
    fetchSalesHistory
  };
}
