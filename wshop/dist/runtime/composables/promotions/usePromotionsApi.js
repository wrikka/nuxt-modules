export function usePromotionsApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchPromotions = async () => {
    try {
      return await $fetch("/api/promotions");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load promotions"));
    }
  };
  const createPromotion = async (promotionData) => {
    try {
      return await $fetch("/api/promotions", {
        method: "POST",
        body: promotionData
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to create promotion"));
    }
  };
  const updatePromotion = async (id, updates) => {
    try {
      return await $fetch(`/api/promotions/${id}`, {
        method: "PUT",
        body: updates
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update promotion"));
    }
  };
  const deletePromotion = async (id) => {
    try {
      await $fetch(`/api/promotions/${id}`, { method: "DELETE" });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to delete promotion"));
    }
  };
  return {
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion
  };
}
