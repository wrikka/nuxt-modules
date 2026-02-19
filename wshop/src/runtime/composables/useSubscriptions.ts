import type { Subscription } from "#shared/types"
import { ref } from "vue"

export const useSubscriptions = () => {
	const subscriptions = ref<Subscription[]>([])
	const loading = ref(false)

	const fetchPlans = async () => {
		loading.value = true
		try {
			// Mock data for now
			subscriptions.value = [
				{
					id: "1",
					customerId: "1",
					planId: "plan_basic",
					status: "active",
					startDate: new Date(),
					nextBillingDate: new Date("2023-12-01"),
				},
				{
					id: "2",
					customerId: "2",
					planId: "plan_premium",
					status: "cancelled",
					startDate: new Date(),
					nextBillingDate: new Date("2023-11-15"),
				},
			]
		} catch (error) {
			console.error("Failed to fetch subscription plans:", error)
		} finally {
			loading.value = false
		}
	}

	return {
		subscriptions,
		loading,
		fetchPlans,
	}
}
