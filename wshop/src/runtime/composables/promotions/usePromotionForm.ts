import { ref } from "#imports"
import type { Promotion } from "#shared/types"

type PromotionFormState = ReturnType<typeof getInitialFormState>

const getInitialFormState = () => ({
	name: "",
	description: "",
	type: "percentage" as Promotion["type"],
	discountValue: 0,
	startDate: new Date().toISOString().split("T")[0],
	endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
	maxUsage: null as number | null,
	maxUsagePerCustomer: null as number | null,
	conditions: {
		minPurchase: null as number | null,
		minQuantity: null as number | null,
		customerTypes: [] as string[],
		productCategories: [] as string[],
	},
})

export const usePromotionForm = (
	createPromotion: (data: any) => Promise<any>,
	updatePromotion: (id: number, data: any) => Promise<any>,
) => {
	const showPromotionForm = ref(false)
	const editingPromotion = ref<Promotion | null>(null)
	const promotionForm = ref<PromotionFormState>(getInitialFormState())

	const editPromotion = (promotion: Promotion) => {
		editingPromotion.value = promotion
		const formState: PromotionFormState = {
			name: promotion.name,
			description: promotion.description ?? "",
			type: promotion.type,
			discountValue: promotion.type === "fixed" ? promotion.discountValue : 0,
			startDate: promotion.startDate.split("T")[0],
			endDate: promotion.endDate.split("T")[0],
			maxUsage: promotion.maxUsage,
			maxUsagePerCustomer: promotion.maxUsagePerCustomer,
			conditions: promotion.conditions || {
				minPurchase: null,
				minQuantity: null,
				customerTypes: [],
				productCategories: [],
			},
		}
		promotionForm.value = formState
		showPromotionForm.value = true
	}

	const savePromotion = async () => {
		if (editingPromotion.value) {
			await updatePromotion(editingPromotion.value.id, promotionForm.value)
		} else {
			await createPromotion(promotionForm.value)
		}
		closePromotionForm()
	}

	const closePromotionForm = () => {
		showPromotionForm.value = false
		editingPromotion.value = null
		promotionForm.value = getInitialFormState()
	}

	return {
		showPromotionForm,
		editingPromotion,
		promotionForm,
		editPromotion,
		savePromotion,
		closePromotionForm,
	}
}
