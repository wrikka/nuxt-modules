import { useReviewsApi } from "./useReviewsApi"
import { useReviewsState } from "./useReviewsState"
import { useReviewsUtils } from "./useReviewsUtils"

export function useReviews() {
	// Initialize state
	const reviewsState = useReviewsState()
	const {
		reviews,
		reviewStats,
		loading,
		processing,
		error,
		averageRating,
		totalReviews,
		ratingDistribution,
	} = reviewsState

	// Initialize API methods
	const reviewsApi = useReviewsApi(
		reviews,
		reviewStats,
		loading,
		processing,
		error,
	)
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
		exportReviews,
	} = reviewsApi

	// Initialize utility methods
	const reviewsUtils = useReviewsUtils(
		reviews,
		averageRating,
		totalReviews,
		ratingDistribution,
	)
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
		getReviewSummary,
	} = reviewsUtils

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
		getReviewSummary,
	}
}
