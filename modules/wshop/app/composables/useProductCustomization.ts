import type { CustomizationOptionSet } from "#shared/types"
import { ref } from "vue"

export const useProductCustomization = () => {
	const optionSets = ref<CustomizationOptionSet[]>([])
	const loading = ref(false)

	const fetchOptionSets = async () => {
		loading.value = true
		try {
			// Mock data for now
			optionSets.value = [
				{
					id: "1",
					name: "T-Shirt Options",
					options: [
						{
							id: "opt1",
							name: "Size",
							type: "dropdown",
							values: [{ id: "val1", label: "Small", value: "S" }, {
								id: "val2",
								label: "Medium",
								value: "M",
							}],
						},
						{
							id: "opt2",
							name: "Color",
							type: "swatch",
							values: [{ id: "val3", label: "Red", value: "#FF0000" }, {
								id: "val4",
								label: "Blue",
								value: "#0000FF",
							}],
						},
					],
				},
				{
					id: "2",
					name: "Engraving Options",
					options: [
						{ id: "opt3", name: "Text", type: "text", values: [] },
					],
				},
			]
		} catch (error) {
			console.error("Failed to fetch option sets:", error)
		} finally {
			loading.value = false
		}
	}

	return {
		optionSets,
		loading,
		fetchOptionSets,
	}
}
