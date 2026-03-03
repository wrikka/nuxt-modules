import type { CartItem } from "../../../shared/types/cart"
import type { Promotion } from "../../../shared/types/promotion"
import type { DiscountApplication } from "./types"

export function useDiscountCalculator() {
	const calculateDiscount = (
		promotion: Promotion,
		cartTotal: number,
		cartItems: CartItem[],
	): DiscountApplication => {
		let discountAmount = 0
		let applicable = true
		let reason = ""

		const now = new Date()
		const startDate = new Date(promotion.startDate)
		const endDate = new Date(promotion.endDate)

		if (promotion.status !== "active" || now < startDate || now > endDate) {
			return {
				promotionId: promotion.id,
				promotionName: promotion.name,
				discountAmount: 0,
				applicable: false,
				reason: "โปรโมชั่นไม่พร้อมใช้งาน",
			}
		}

		if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) {
			return {
				promotionId: promotion.id,
				promotionName: promotion.name,
				discountAmount: 0,
				applicable: false,
				reason: "โปรโมชั่นถูกใช้งานครบแล้ว",
			}
		}

		if (promotion.conditions?.minPurchase && cartTotal < promotion.conditions.minPurchase) {
			return {
				promotionId: promotion.id,
				promotionName: promotion.name,
				discountAmount: 0,
				applicable: false,
				reason: `ยอดซื้อขั้นต่ำ ฿${promotion.conditions.minPurchase}`,
			}
		}

		if (promotion.conditions?.minQuantity && cartItems.length < promotion.conditions.minQuantity) {
			return {
				promotionId: promotion.id,
				promotionName: promotion.name,
				discountAmount: 0,
				applicable: false,
				reason: `จำนวนสินค้าขั้นต่ำ ${promotion.conditions.minQuantity} ชิ้น`,
			}
		}

		switch (promotion.type) {
			case "percentage":
				discountAmount = cartTotal * (promotion.discountValue / 100)
				break
			case "fixed":
				discountAmount = Math.min(promotion.discountValue, cartTotal)
				break
			case "free_shipping":
				const shippingCost = cartTotal >= 500 ? 0 : 50 // Mock calculation
				discountAmount = shippingCost
				break
			case "bundle":
				discountAmount = promotion.discountValue
				break
			case "buy_x_get_y":
				const requiredQuantity = promotion.conditions?.minQuantity || 2
				if (cartItems.length >= requiredQuantity) {
					const cheapestItem = cartItems.reduce((
						min,
						item,
					) => (parseFloat(item.price) < parseFloat(min.price) ? item : min))
					discountAmount = parseFloat(cheapestItem.price)
				}
				break
		}

		discountAmount = Math.min(discountAmount, cartTotal)

		return {
			promotionId: promotion.id,
			promotionName: promotion.name,
			discountAmount,
			applicable,
			reason,
		}
	}

	const getBestDiscount = (
		cartTotal: number,
		cartItems: CartItem[],
		promotions: Promotion[],
	): DiscountApplication => {
		const discounts = promotions.map(promo => calculateDiscount(promo, cartTotal, cartItems))
		const applicableDiscounts = discounts.filter(d => d.applicable)

		if (applicableDiscounts.length === 0) {
			return {
				promotionId: 0,
				promotionName: "",
				discountAmount: 0,
				applicable: false,
				reason: "ไม่มีโปรโมชั่นที่สามารถใช้ได้",
			}
		}

		return applicableDiscounts.reduce((
			best,
			current,
		) => (current.discountAmount > best.discountAmount ? current : best))
	}

	return {
		calculateDiscount,
		getBestDiscount,
	}
}
