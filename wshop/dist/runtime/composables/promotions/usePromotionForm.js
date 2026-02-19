import { ref } from "#imports";
const getInitialFormState = () => ({
  name: "",
  description: "",
  type: "percentage",
  discountValue: 0,
  startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
  endDate: new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() + 30)).toISOString().split("T")[0],
  maxUsage: null,
  maxUsagePerCustomer: null,
  conditions: {
    minPurchase: null,
    minQuantity: null,
    customerTypes: [],
    productCategories: []
  }
});
export const usePromotionForm = (createPromotion, updatePromotion) => {
  const showPromotionForm = ref(false);
  const editingPromotion = ref(null);
  const promotionForm = ref(getInitialFormState());
  const editPromotion = (promotion) => {
    editingPromotion.value = promotion;
    const formState = {
      name: promotion.name,
      description: promotion.description ?? "",
      type: promotion.type,
      discountValue: promotion.type === "fixed" ? promotion.discountValue : 0,
      startDate: promotion.startDate.split("T")[0],
      endDate: promotion.endDate.split("T")[0],
      maxUsage: promotion.maxUsage,
      maxUsagePerCustomer: promotion.maxUsagePerCustomer,
      conditions: promotion.conditions || {
        minPurchase: null,
        minQuantity: null,
        customerTypes: [],
        productCategories: []
      }
    };
    promotionForm.value = formState;
    showPromotionForm.value = true;
  };
  const savePromotion = async () => {
    if (editingPromotion.value) {
      await updatePromotion(editingPromotion.value.id, promotionForm.value);
    } else {
      await createPromotion(promotionForm.value);
    }
    closePromotionForm();
  };
  const closePromotionForm = () => {
    showPromotionForm.value = false;
    editingPromotion.value = null;
    promotionForm.value = getInitialFormState();
  };
  return {
    showPromotionForm,
    editingPromotion,
    promotionForm,
    editPromotion,
    savePromotion,
    closePromotionForm
  };
};
