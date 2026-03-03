import type { ShippingZone } from "#shared/types"
import { ref } from "vue"

export const useShipping = () => {
	const shippingZones = ref<ShippingZone[]>([])
	const loading = ref(false)

	const fetchShippingZones = async () => {
		loading.value = true
		try {
			// Mock data for now
			const data: ShippingZone[] = [
				{
					id: 1,
					name: "Domestic",
					isActive: true,
					countries: ["Thailand"],
					rates: [
						{
							id: 1,
							zoneId: 1,
							name: "Standard Shipping",
							price: 50,
							currency: "THB",
							minWeight: 0,
							maxWeight: 5,
						},
						{
							id: 2,
							zoneId: 1,
							name: "Express Shipping",
							price: 100,
							currency: "THB",
							minWeight: 0,
							maxWeight: 5,
						},
					],
				},
				{
					id: 2,
					name: "International",
					isActive: true,
					countries: ["USA", "UK"],
					rates: [
						{
							id: 3,
							zoneId: 2,
							name: "International Standard",
							price: 500,
							currency: "THB",
							minWeight: 0,
							maxWeight: 2,
						},
					],
				},
			]
			shippingZones.value = data
		} catch (error) {
			console.error("Failed to fetch shipping zones:", error)
		} finally {
			loading.value = false
		}
	}

	return {
		shippingZones,
		loading,
		fetchShippingZones,
	}
}
