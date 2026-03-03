import type { StockMovement } from "#shared/types"
import { computed, ref } from "vue"
import { useStock } from "./useStock"

interface UseStockMovementFormProps {
	productId: string | undefined
}

export const useStockMovementForm = (
	props: UseStockMovementFormProps,
	emit: (event: "submit", payload: StockMovement) => void,
) => {
	const { createStockMovement, loading } = useStock()

	const movementType = ref<StockMovement["type"]>("in")
	const quantity = ref(1)
	const reason = ref("")
	const reference = ref("")

	const isFormValid = computed(() => {
		return props.productId && quantity.value > 0 && reason.value.trim().length > 0
	})

	const resetForm = () => {
		quantity.value = 1
		reason.value = ""
		reference.value = ""
		// movementType is not reset by design, to allow multiple entries of the same type.
	}

	const handleSubmit = async () => {
		if (!isFormValid.value || !props.productId) return

		try {
			const movement = await createStockMovement({
				productId: props.productId,
				type: movementType.value,
				quantity: quantity.value,
				reason: reason.value,
				reference: reference.value || undefined,
			})

			if (movement) {
				emit("submit", movement)
				resetForm()
			}
		} catch (error) {
			console.error("Failed to create stock movement:", error)
			// Optionally, expose the error to the component
		}
	}

	return {
		// Form State
		movementType,
		quantity,
		reason,
		reference,

		// Computed State
		isFormValid,
		loading,

		// Methods
		handleSubmit,
		setReason: (selectedReason: string) => {
			reason.value = selectedReason
		},
	}
}
