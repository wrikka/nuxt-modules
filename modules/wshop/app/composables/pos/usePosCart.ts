import type { Product, ProductVariant } from "#shared/types"
import { useCart } from "~/composables/useCart"
import { useAppStore } from "~/stores/app"

export function usePosCart(products: any) {
	const { addNotification } = useAppStore()

	const {
		cart,
		addToCart: addToCartApi,
		updateQuantity: updateQuantityApi,
		removeFromCart: removeFromCartApi,
		clearCart: clearCartApi,
		subtotal,
		total,
	} = useCart()

	const addToCart = (product: Product, variant: ProductVariant) => {
		if (variant.stock <= 0) {
			addNotification({ type: "warning", message: "สินค้าหมดสต็อก" })
			return
		}

		const existingItem = cart.value?.items.find(item => item.variantId === variant.id)
		if (existingItem && existingItem.quantity >= variant.stock) {
			addNotification({ type: "warning", message: "สินค้าไม่เพียงพอ" })
			return
		}

		addToCartApi(product, variant, 1)
	}

	const updateQuantity = (itemId: string, newQuantity: number) => {
		if (newQuantity <= 0) {
			return removeFromCartApi(itemId)
		}

		const item = cart.value?.items.find(i => i.id === itemId)
		const product = products.value.find(p => p.id === item?.productId)
		const variant = product?.variants?.find(v => v.id === item?.variantId)

		if (item && variant && newQuantity > variant.stock) {
			addNotification({ type: "warning", message: "สินค้าไม่เพียงพอ" })
			return
		}

		updateQuantityApi(itemId, newQuantity)
	}

	const removeFromCart = (itemId: string) => {
		removeFromCartApi(itemId)
	}

	const clearCart = () => {
		clearCartApi()
	}

	return {
		cart,
		subtotal,
		total,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
	}
}
