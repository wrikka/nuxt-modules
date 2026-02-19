import type { Review } from "#shared/types"

export function useReviewsUtils(
	reviews: any,
	averageRating: any,
	totalReviews: any,
	ratingDistribution: any,
) {
	const getReviewById = (reviewId: string) => {
		return reviews.value.find((review: Review) => review.id === reviewId)
	}

	const getReviewsByRating = (rating: number) => {
		return reviews.value.filter((review: Review) => review.rating === rating)
	}

	const getVerifiedReviews = () => {
		return reviews.value.filter((review: Review) => review.isVerified)
	}

	const getRecentReviews = (limit = 10) => {
		return reviews.value
			.sort((a: Review, b: Review) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			)
			.slice(0, limit)
	}

	const getTopRatedReviews = (limit = 10) => {
		return reviews.value
			.sort((a: Review, b: Review) => b.rating - a.rating)
			.slice(0, limit)
	}

	const getMostHelpfulReviews = (limit = 10) => {
		return reviews.value
			.sort((a: Review, b: Review) => b.helpful - a.helpful)
			.slice(0, limit)
	}

	const calculateAverageRating = (reviewList: Review[]) => {
		if (reviewList.length === 0) return 0
		const sum = reviewList.reduce((total, review) => total + review.rating, 0)
		return sum / reviewList.length
	}

	const getRatingDistribution = (reviewList: Review[]) => {
		const distribution = {
			"5": 0,
			"4": 0,
			"3": 0,
			"2": 0,
			"1": 0,
		}

		reviewList.forEach((review: Review) => {
			const ratingKey = String(review.rating) as keyof typeof distribution
			if (ratingKey in distribution) {
				distribution[ratingKey]++
			}
		})

		return distribution
	}

	const searchReviews = (query: string) => {
		if (!query.trim()) return reviews.value

		const searchTerm = query.toLowerCase()
		return reviews.value.filter((review: Review) =>
			review.title?.toLowerCase().includes(searchTerm)
			|| review.content?.toLowerCase().includes(searchTerm)
		)
	}

	const getReviewSummary = () => {
		return {
			averageRating: averageRating.value,
			totalReviews: totalReviews.value,
			ratingDistribution: ratingDistribution.value,
			verifiedCount: getVerifiedReviews().length,
			pendingCount: reviews.value.filter((r: Review) => !r.isVerified).length,
		}
	}

	return {
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
