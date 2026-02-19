import { computed, onMounted, ref } from "vue"
import type { CartItem } from "../../../shared/types/cart"
import type { Promotion } from "../../../shared/types/promotion"
import { useDiscountCalculator } from "./useDiscountCalculator"
import { usePromotionsApi } from "./usePromotionsApi"

export function usePromotions() {
	const promotions = ref<Promotion[]>([])
	const loading = ref(false)
	const processing = ref(false)
	const error = ref<string | null>(null)

	const api = usePromotionsApi()
	const calculator = useDiscountCalculator()

	const activePromotions = computed(() =>
		promotions.value.filter(promo => promo.status === "active")
	)
	const scheduledPromotions = computed(() =>
		promotions.value.filter(promo => promo.status === "scheduled")
	)
	const expiredPromotions = computed(() =>
		promotions.value.filter(promo => promo.status === "inactive")
	)

	const executeApiAction = async (action: () => Promise<any>, errorMessage: string) => {
		processing.value = true
		error.value = null
		try {
			await action()
			await loadPromotions()
		} catch (err) {
			error.value = err instanceof Error ? err.message : errorMessage
			throw err
		} finally {
			processing.value = false
		}
	}

	const loadPromotions = async () => {
		loading.value = true
		error.value = null
		try {
			promotions.value = await api.fetchPromotions()
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load promotions"
		} finally {
			loading.value = false
		}
	}

	const createPromotion = (
		data: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "usageCount">,
	) => executeApiAction(() => api.createPromotion(data), "Failed to create promotion")

	const updatePromotion = (id: number, updates: Partial<Promotion>) =>
		executeApiAction(() => api.updatePromotion(id, updates), "Failed to update promotion")

	const deletePromotion = (id: number) =>
		executeApiAction(() => api.deletePromotion(id), "Failed to delete promotion")

	const togglePromotionStatus = async (id: number) => {
		const promotion = promotions.value.find(p => p.id === id)
		if (!promotion) throw new Error("Promotion not found")

		const newStatus = promotion.status === "active" ? "inactive" : "active"

		await updatePromotion(id, { status: newStatus })
	}

	const duplicatePromotion = async (id: number) => {
		const originalPromotion = promotions.value.find(p => p.id === id)
		if (!originalPromotion) throw new Error("Promotion not found")

		const {
			id: _id,
			createdAt: _createdAt,
			updatedAt: _updatedAt,
			usageCount: _usageCount,
			...rest
		} = originalPromotion
		const duplicatedData = {
			...rest,
			name: `${originalPromotion.name} (คัดลอก)`,
			status: "inactive" as const,
		}

		await createPromotion(duplicatedData)
	}

	const applyPromotion = async (promotionId: number, cartTotal: number, cartItems: CartItem[]) => {
		const promotion = promotions.value.find(p => p.id === promotionId)
		if (!promotion) throw new Error("Promotion not found")

		const discountApplication = calculator.calculateDiscount(promotion, cartTotal, cartItems)
		if (!discountApplication.applicable) {
			throw new Error(discountApplication.reason || "Promotion cannot be applied.")
		}

		await updatePromotion(promotionId, { usageCount: (promotion.usageCount || 0) + 1 })
		return discountApplication
	}

	const getPromotionById = (id: number) => {
		return promotions.value.find(promo => promo.id === id)
	}

	const getPromotionsByType = (type: string) => {
		return promotions.value.filter(promo => promo.type === type)
	}

	const getPromotionsByStatus = (status: string) => {
		return promotions.value.filter(promo => promo.status === status)
	}

	const searchPromotions = (query: string) => {
		if (!query.trim()) return promotions.value

		const searchTerm = query.toLowerCase()
		return promotions.value.filter(promo =>
			promo.name.toLowerCase().includes(searchTerm)
			|| promo.description?.toLowerCase().includes(searchTerm)
		)
	}

	const getPromotionStats = () => {
		return {
			total: promotions.value.length,
			active: activePromotions.value.length,
			scheduled: scheduledPromotions.value.length,
			expired: expiredPromotions.value.length,
			totalUsage: promotions.value.reduce((total, promo) => total + (promo.usageCount || 0), 0),
		}
	}

	const validatePromotionDates = (startDate: string, endDate: string) => {
		const start = new Date(startDate)
		const end = new Date(endDate)
		const now = new Date()

		if (start >= end) {
			return "วันที่สิ้นสุดต้องมาหลังวันที่เริ่ม"
		}

		if (start < now) {
			return "วันที่เริ่มต้องไม่น้อยกว่าวันนี้"
		}

		return null
	}

	onMounted(loadPromotions)

	return {
		promotions,
		loading,
		processing,
		error,
		activePromotions,
		scheduledPromotions,
		expiredPromotions,
		loadPromotions,
		createPromotion,
		updatePromotion,
		deletePromotion,
		togglePromotionStatus,
		duplicatePromotion,
		applyPromotion,
		getBestDiscount: (cartTotal: number, cartItems: CartItem[]) =>
			calculator.getBestDiscount(cartTotal, cartItems, activePromotions.value),
		getPromotionById,
		getPromotionsByType,
		getPromotionsByStatus,
		searchPromotions,
		getPromotionStats,
		validatePromotionDates,
	}
}
