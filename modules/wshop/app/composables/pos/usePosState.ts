import type { Customer, Product } from "#shared/types"
import { computed, ref } from "vue"
import { useSettings } from "~/composables/useSettings"

export function usePosState() {
	// Basic state
	const categories = ref<{ id: number; name: string }[]>([])
	const products = ref<Product[]>([])
	const customers = ref<Customer[]>([])
	const selectedCustomer = ref<Customer | null>(null)
	const loading = ref(false)
	const processing = ref(false)
	const error = ref<string | null>(null)

	// POS-specific state
	const registers = ref<{ id: number; name: string }[]>([])
	const selectedRegister = ref<number | null>(null)
	const paymentMethods = ref<{ id: string; name: string }[]>([])
	const selectedPaymentMethod = ref<string | null>(null)
	const discount = ref(0)

	const { settings } = useSettings()
	const tax = computed(() => subtotal.value * ((settings.value as any).taxRate || 0) / 100)

	return {
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
	}
}
