import type { Promotion, PromotionError } from "#shared/types"

export function usePromotionsApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as PromotionError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchPromotions = async () => {
		try {
			return await $fetch<Promotion[]>("/api/promotions")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load promotions"))
		}
	}

	const createPromotion = async (
		promotionData: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "usageCount">,
	) => {
		try {
			return await $fetch<Promotion>("/api/promotions", {
				method: "POST",
				body: promotionData,
			})
		} catch (err: unknown) {
			throw new Error(handleApiError(err, "Failed to create promotion"))
		}
	}

	const updatePromotion = async (id: number, updates: Partial<Promotion>) => {
		try {
			return await $fetch<Promotion>(`/api/promotions/${id}`, {
				method: "PUT",
				body: updates,
			})
		} catch (err: unknown) {
			throw new Error(handleApiError(err, "Failed to update promotion"))
		}
	}

	const deletePromotion = async (id: number) => {
		try {
			await $fetch(`/api/promotions/${id}`, { method: "DELETE" })
		} catch (err: unknown) {
			throw new Error(handleApiError(err, "Failed to delete promotion"))
		}
	}

	return {
		fetchPromotions,
		createPromotion,
		updatePromotion,
		deletePromotion,
	}
}
