export interface DiscountApplication {
	discountAmount: number
	applicable: boolean
	reason: string
	promotionId?: string
	type?: string
}

export interface DiscountRule {
	type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_shipping"
	value: number
	conditions?: {
		minPurchase?: number
		minQuantity?: number
		customerTypes?: string[]
		productCategories?: string[]
	}
}
