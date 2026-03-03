import { ref } from "vue"
import { useAuth } from "~/composables/core/useAuth"
import { useAppStore } from "~/stores/app"
import type { POSRegister } from "../../../shared/types"
import { usePointOfSaleApi } from "./usePointOfSaleApi"

export function usePosRegister() {
	const registers = ref<POSRegister[]>([])
	const selectedRegister = ref<string | null>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	const api = usePointOfSaleApi()
	const { user: currentUser } = useAuth()
	const { addNotification } = useAppStore()

	const loadRegisters = async () => {
		loading.value = true
		error.value = null
		try {
			registers.value = await api.fetchRegisters()
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to load registers"
		} finally {
			loading.value = false
		}
	}

	const openRegister = async (registerId: string) => {
		try {
			await api.openRegister(registerId, currentUser.value?.id?.toString() || "")
			selectedRegister.value = registerId
		} catch (err: unknown) {
			console.error("Failed to open register:", err)
			if (err instanceof Error) {
				addNotification({ type: "error", message: `ไม่สามารถเปิดเครื่องได้: ${err.message}` })
			} else {
				addNotification({ type: "error", message: "ไม่สามารถเปิดเครื่องได้" })
			}
		}
	}

	const endShift = async () => {
		if (!selectedRegister.value) return
		loading.value = true
		try {
			await api.closeRegister(selectedRegister.value)
		} catch (err: unknown) {
			console.error("Failed to end shift:", err)
			if (err instanceof Error) {
				addNotification({ type: "error", message: `ไม่สามารถจบกะได้: ${err.message}` })
			} else {
				addNotification({ type: "error", message: "ไม่สามารถจบกะได้" })
			}
		} finally {
			loading.value = false
		}
	}

	const getSalesHistory = async (startDate?: string, endDate?: string) => {
		if (!selectedRegister.value) return []
		try {
			const params: any = { registerId: selectedRegister.value }
			if (startDate) params.startDate = startDate
			if (endDate) params.endDate = endDate
			return await api.fetchSalesHistory(params)
		} catch (err: unknown) {
			console.error("Failed to get sales history:", err)
			if (err instanceof Error) {
				error.value = err.message
			} else {
				error.value = "An unknown error occurred"
			}
			return []
		}
	}

	return {
		registers,
		selectedRegister,
		loading,
		error,
		loadRegisters,
		openRegister,
		endShift,
		getSalesHistory,
	}
}
