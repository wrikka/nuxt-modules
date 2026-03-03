import { useFetch } from "#imports"
import type { CustomerLoyalty, LoyaltyProgram } from "#shared/types"

export const useLoyalty = () => {
	// Fetch the main loyalty program settings
	const { data: program, pending: pendingProgram, error: errorProgram, refresh: refreshProgram } =
		useFetch<LoyaltyProgram>("/api/loyalty/program")

	// Fetch the list of customers with loyalty points
	const { data: customers, pending: pendingCustomers, error: errorCustomers } = useFetch<
		CustomerLoyalty[]
	>("/api/loyalty/customers")

	const saveProgram = async (updatedProgram: LoyaltyProgram) => {
		try {
			await $fetch("/api/loyalty/program", {
				method: "PUT",
				body: updatedProgram,
			})
			await refreshProgram()
			// Show success notification
		} catch (error) {
			console.error("Failed to save loyalty program:", error)
			// Show error notification
			throw error
		}
	}

	return {
		program,
		pendingProgram,
		errorProgram,
		customers,
		pendingCustomers,
		errorCustomers,
		saveProgram,
	}
}
