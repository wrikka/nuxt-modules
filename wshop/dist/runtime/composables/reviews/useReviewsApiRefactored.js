export const useReviewsApi = () => {
  const reviews = ref([]);
  const reviewStats = ref(null);
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const loadReviews = async (productId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch(`/api/products/${productId}/reviews`);
      reviews.value = response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load reviews";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const createReview = async (reviewData) => {
    processing.value = true;
    error.value = null;
    try {
      const response = await $fetch(`/api/products/${reviewData.productId}/reviews`, {
        method: "POST",
        body: reviewData
      });
      reviews.value.unshift(response);
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create review";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const updateReview = async (reviewId, updates) => {
    processing.value = true;
    error.value = null;
    try {
      const response = await $fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        body: updates
      });
      const index = reviews.value.findIndex((r) => r.id === reviewId);
      if (index !== -1) reviews.value[index] = response;
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update review";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const deleteReview = async (reviewId) => {
    processing.value = true;
    error.value = null;
    try {
      await $fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      reviews.value = reviews.value.filter((r) => r.id !== reviewId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete review";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  return {
    reviews: readonly(reviews),
    reviewStats: readonly(reviewStats),
    loading: readonly(loading),
    processing: readonly(processing),
    error: readonly(error),
    loadReviews,
    createReview,
    updateReview,
    deleteReview
  };
};
