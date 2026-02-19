import { computed, ref } from "vue";
import { useStock } from "./useStock.js";
export const useStockMovementForm = (props, emit) => {
  const { createStockMovement, loading } = useStock();
  const movementType = ref("in");
  const quantity = ref(1);
  const reason = ref("");
  const reference = ref("");
  const isFormValid = computed(() => {
    return props.productId && quantity.value > 0 && reason.value.trim().length > 0;
  });
  const resetForm = () => {
    quantity.value = 1;
    reason.value = "";
    reference.value = "";
  };
  const handleSubmit = async () => {
    if (!isFormValid.value || !props.productId) return;
    try {
      const movement = await createStockMovement({
        productId: props.productId,
        type: movementType.value,
        quantity: quantity.value,
        reason: reason.value,
        reference: reference.value || void 0
      });
      if (movement) {
        emit("submit", movement);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create stock movement:", error);
    }
  };
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
    setReason: (selectedReason) => {
      reason.value = selectedReason;
    }
  };
};
