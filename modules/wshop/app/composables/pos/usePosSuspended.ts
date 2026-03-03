import type { SuspendSaleData } from "#shared/types"
import type { Customer, Product } from "#shared/types"
import { useAuth } from "~/composables/core/useAuth"
import { useCart } from "~/composables/useCart"
import { useAppStore } from "~/stores/app"
import { usePointOfSaleApi } from "./usePointOfSaleApi"

export function usePosSuspended(
	cart: any,
	subtotal: any,
	total: any,
	selectedCustomer: any,
	products: Product[],
	customers: Customer[],
) {
	const api = usePointOfSaleApi()
	const { user: currentUser } = useAuth()
	const { addNotification } = useAppStore()
	const error = ref<string | null>(null)

	const suspendSale = async () => {
		if (!cart.value?.items || cart.value.items.length === 0) return
		if (!currentUser.value) return

		try {
			await api.suspendSale({
				sessionId: `SUSPENDED-${Date.now()}`,
				items: cart.value.items,
				subtotal: subtotal.value,
				total: total.value,
				customerId: selectedCustomer.value?.id.toString() || null,
				staffId: currentUser.value.id.toString(),
				createdAt: new Date().toISOString(),
			})

			addNotification({ type: "success", message: "บันทึกการขายแบบพักไว้เรียบร้อย" })
		} catch (err: unknown) {
			console.error("Failed to suspend sale:", err)
			if (err instanceof Error) {
				addNotification({ type: "error", message: `ไม่สามารถบันทึกการขายแบบพักไว้ได้: ${err.message}` })
			} else {
				addNotification({ type: "error", message: "ไม่สามารถบันทึกการขายแบบพักไว้ได้" })
			}
		}
	}

	const resumeSuspendedSale = async (sessionId: string) => {
		try {
			const sale = await api.fetchSuspendedSale(sessionId) as SuspendSaleData
			if (sale && products && customers) {
				// Clear the current cart first
				const { clearCart } = useCart()
				await clearCart()

				// Add items from the suspended sale one by one
				const { addToCart } = useCart()
				for (const item of sale.items) {
					const product = products.find(p => p.id === item.productId)
					const variant = product?.variants?.find(v => v.id === item.variantId)

					if (product && variant) {
						await addToCart(product, variant, item.quantity)
					} else {
						console.warn(`Product or variant not found for suspended item:`, item)
					}
				}

				if (sale.customerId) {
					selectedCustomer.value = customers.find(c => c.id.toString() === sale.customerId) || null
				}
			}
		} catch (err: unknown) {
			console.error("Failed to resume suspended sale:", err)
			error.value = err instanceof Error ? err.message : "An unknown error occurred"
			addNotification({ type: "error", message: "ไม่สามารถโหลดการขายที่พักไว้ได้" })
		}
	}

	return {
		error,
		suspendSale,
		resumeSuspendedSale,
	}
}
