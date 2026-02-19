import { useReviewsApi } from "./useReviewsApi.js";
import { useReviewsState } from "./useReviewsState.js";
import { useReviewsUtils } from "./useReviewsUtils.js";
export function useReviews() {
  const reviewsState = useReviewsState();
  const {
    reviews,
    reviewStats,
    loading,
    processing,
    error,
    averageRating,
    totalReviews,
    ratingDistribution
  } = reviewsState;
  const reviewsApi = useReviewsApi(
    reviews,
    reviewStats,
    loading,
    processing,
    error
  );
  const {
    loadReviews,
    loadReviewStats,
    createReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    reportReview,
    approveReview,
    rejectReview,
    getReviewsByCustomer,
    getPendingReviews,
    exportReviews
  } = reviewsApi;
  const reviewsUtils = useReviewsUtils(
    reviews,
    averageRating,
    totalReviews,
    ratingDistribution
  );
  const {
    getReviewById,
    getReviewsByRating,
    getVerifiedReviews,
    getRecentReviews,
    getTopRatedReviews,
    getMostHelpfulReviews,
    calculateAverageRating,
    getRatingDistribution,
    searchReviews,
    getReviewSummary
  } = reviewsUtils;
  return {
    // State
    reviews,
    reviewStats,
    loading,
    processing,
    error,
    // Computed
    averageRating,
    totalReviews,
    ratingDistribution,
    // API Methods
    loadReviews,
    loadReviewStats,
    createReview,
    updateReview,
    deleteReview,
    markReviewHelpful,
    reportReview,
    approveReview,
    rejectReview,
    getReviewsByCustomer,
    getPendingReviews,
    exportReviews,
    // Utility Methods
    getReviewById,
    getReviewsByRating,
    getVerifiedReviews,
    getRecentReviews,
    getTopRatedReviews,
    getMostHelpfulReviews,
    calculateAverageRating,
    getRatingDistribution,
    searchReviews,
    getReviewSummary
  };
}
