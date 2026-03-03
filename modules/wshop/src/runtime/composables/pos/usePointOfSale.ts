import type { Customer } from "#shared/types"
import { onMounted } from "vue"
import { useAuth } from "~/composables/core/useAuth"
import { useAppStore } from "~/stores/app"
import { usePointOfSaleApi } from "./usePointOfSaleApi"
import { usePosCart } from "./usePosCart"
import { usePosPayment } from "./usePosPayment"
import { usePosRegister } from "./usePosRegister"
import { usePosState } from "./usePosState"
import { usePosSuspended } from "./usePosSuspended"

export function usePointOfSale() {
	const api = usePointOfSaleApi()
	const { addNotification } = useAppStore()
	const { user: currentUser } = useAuth()

	// Initialize all sub-composables
	const posState = usePosState()
	const {
		categories,
		products,
		customers,
		selectedCustomer,
		loading,
		processing,
		error,
		registers,
		selectedRegister,
		paymentMethods,
		selectedPaymentMethod,
		discount,
		tax,
	} = posState

	const posCart = usePosCart(products)
	const {
		cart,
		subtotal,
		total,
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
	} = posCart

	const posPayment = usePosPayment(
		cart,
		subtotal,
		tax,
		discount,
		total,
		selectedCustomer,
		selectedRegister,
		products,
	)
	const { processPayment } = posPayment

	const posSuspended = usePosSuspended(
		cart,
		subtotal,
		total,
		selectedCustomer,
		products,
		customers,
	)
	const { suspendSale, resumeSuspendedSale } = posSuspended

	const posRegister = usePosRegister()
	const { _loadRegisters, openRegister, endShift, getSalesHistory } = posRegister

	const loadInitialData = async () => {
		loading.value = true
		try {
			const [catData, prodData, custData] = await Promise.all([
				api.fetchCategories(),
				api.fetchProducts(),
				api.fetchCustomers(),
			])
			categories.value = catData
			products.value = prodData
			customers.value = custData
		} catch (err: unknown) {
			if (err instanceof Error) {
				error.value = err.message
			} else {
				error.value = "An unknown error occurred"
			}
		} finally {
			loading.value = false
		}
	}

	onMounted(loadInitialData)

	const selectCustomer = (customer: Customer) => {
		selectedCustomer.value = customer
	}

	return {
		// State
		categories,
		products,
		customers,
		registers,
		paymentMethods,
		selectedCustomer,
		selectedRegister,
		selectedPaymentMethod,
		loading,
		processing,
		error,
		currentUser,
		cartItems: cart,
		subtotal,
		discount,
		tax,
		total,

		// Methods
		addToCart,
		updateQuantity,
		removeFromCart,
		clearCart,
		selectCustomer,
		processPayment,
		suspendSale,
		resumeSuspendedSale,
		endShift,
		openRegister,
		getSalesHistory,
		loadCategories: loadInitialData,
		loadProducts: loadInitialData,
		loadRegisters: loadInitialData,
		addNotification,
	}
}
