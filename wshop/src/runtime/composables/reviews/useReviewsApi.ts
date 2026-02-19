import type { Review, ReviewStats } from "#shared/types"

export const useReviewsApi = () => {
	const reviews = ref<Review[]>([])
	const reviewStats = ref<ReviewStats | null>(null)
	const loading = ref(false)
	const processing = ref(false)
	const error = ref<string | null>(null)

	const loadReviews = async (productId: string) => {
		loading.value = true
		error.value = null
		try {
			const response = await $fetch<Review[]>(`/api/products/${productId}/reviews`)
			reviews.value = response
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load reviews"
			throw err
		} finally {
			loading.value = false
		}
	}

	const loadReviewStats = async (productId: string) => {
		try {
			const response = await $fetch<ReviewStats>(`/api/products/${productId}/reviews/stats`)
			reviewStats.value = response
		} catch (err) {
			console.error("Failed to load review stats:", err)
			throw err
		}
	}

	const createReview = async (reviewData: {
		productId: string
		rating: number
		title?: string
		content: string
		images?: string[]
	}) => {
		processing.value = true
		error.value = null

		try {
			const response = await $fetch<Review>(`/api/products/${reviewData.productId}/reviews`, {
				method: "POST",
				body: reviewData,
			})

			reviews.value.unshift(response)
			return response
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to create review"
			throw err
		} finally {
			processing.value = false
		}
	}

	const updateReview = async (reviewId: string, updates: Partial<Review>) => {
		processing.value = true
		error.value = null

		try {
			const response = await $fetch<Review>(`/api/reviews/${reviewId}`, {
				method: "PUT",
				body: updates,
			})

			const index = reviews.value.findIndex((review: Review) => review.id === reviewId)
			if (index !== -1) {
				reviews.value[index] = response
			}

			return response
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to update review"
			throw err
		} finally {
			processing.value = false
		}
	}

	const deleteReview = async (reviewId: string) => {
		processing.value = true
		error.value = null

		try {
			await $fetch(`/api/reviews/${reviewId}`, {
				method: "DELETE",
			})

			reviews.value = reviews.value.filter((review: Review) => review.id !== reviewId)
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to delete review"
			throw err
		} finally {
			processing.value = false
		}
	}

	const markReviewHelpful = async (reviewId: string) => {
		try {
			await $fetch(`/api/reviews/${reviewId}/helpful`, {
				method: "POST",
			})

			const review = reviews.value.find((review: Review) => review.id === reviewId)
			if (review) {
				review.helpful += 1
				review.userMarkedHelpful = true
			}
		} catch (err) {
			console.error("Failed to mark review as helpful:", err)
			throw err
		}
	}

	const reportReview = async (reviewId: string) => {
		try {
			await $fetch(`/api/reviews/${reviewId}/report`, {
				method: "POST",
			})
		} catch (err) {
			console.error("Failed to report review:", err)
			throw err
		}
	}

	const approveReview = async (reviewId: string) => {
		try {
			await $fetch(`/api/reviews/${reviewId}/approve`, {
				method: "PUT",
			})

			const review = reviews.value.find((review: Review) => review.id === reviewId)
			if (review) {
				review.isVerified = true
			}
		} catch (err) {
			console.error("Failed to approve review:", err)
			throw err
		}
	}

	const rejectReview = async (reviewId: string) => {
		try {
			await $fetch(`/api/reviews/${reviewId}/reject`, {
				method: "PUT",
			})

			reviews.value = reviews.value.filter((review: Review) => review.id !== reviewId)
		} catch (err) {
			console.error("Failed to reject review:", err)
			throw err
		}
	}

	const getReviewsByCustomer = async (customerId: string) => {
		try {
			const response = await $fetch<Review[]>(`/api/customers/${customerId}/reviews`)
			return response
		} catch (err) {
			console.error("Failed to get customer reviews:", err)
			throw err
		}
	}

	const getPendingReviews = async () => {
		try {
			const response = await $fetch<Review[]>("/api/reviews/pending")
			return response
		} catch (err) {
			console.error("Failed to get pending reviews:", err)
			throw err
		}
	}

	const exportReviews = async (productId?: string, format: "csv" | "json" = "csv") => {
		try {
			const url = productId
				? `/api/products/${productId}/reviews/export?format=${format}`
				: `/api/reviews/export?format=${format}`

			const response = await $fetch<Blob>(url, {
				method: "GET",
			})

			// Create download link
			const blob = new Blob([response], {
				type: format === "csv" ? "text/csv" : "application/json",
			})
			const downloadUrl = window.URL.createObjectURL(blob)
			const link = document.createElement("a")
			link.href = downloadUrl
			link.download = `reviews.${format}`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(downloadUrl)
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to export reviews"
			throw err
		}
	}

	return {
		reviews: readonly(reviews),
		reviewStats: readonly(reviewStats),
		loading: readonly(loading),
		processing: readonly(processing),
		error: readonly(error),
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
	}
}
