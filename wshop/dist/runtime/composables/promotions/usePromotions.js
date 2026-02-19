import { computed, onMounted, ref } from "vue";
import { useDiscountCalculator } from "./useDiscountCalculator.js";
import { usePromotionsApi } from "./usePromotionsApi.js";
export function usePromotions() {
  const promotions = ref([]);
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const api = usePromotionsApi();
  const calculator = useDiscountCalculator();
  const activePromotions = computed(
    () => promotions.value.filter((promo) => promo.status === "active")
  );
  const scheduledPromotions = computed(
    () => promotions.value.filter((promo) => promo.status === "scheduled")
  );
  const expiredPromotions = computed(
    () => promotions.value.filter((promo) => promo.status === "inactive")
  );
  const executeApiAction = async (action, errorMessage) => {
    processing.value = true;
    error.value = null;
    try {
      await action();
      await loadPromotions();
    } catch (err) {
      error.value = err instanceof Error ? err.message : errorMessage;
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const loadPromotions = async () => {
    loading.value = true;
    error.value = null;
    try {
      promotions.value = await api.fetchPromotions();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load promotions";
    } finally {
      loading.value = false;
    }
  };
  const createPromotion = (data) => executeApiAction(() => api.createPromotion(data), "Failed to create promotion");
  const updatePromotion = (id, updates) => executeApiAction(() => api.updatePromotion(id, updates), "Failed to update promotion");
  const deletePromotion = (id) => executeApiAction(() => api.deletePromotion(id), "Failed to delete promotion");
  const togglePromotionStatus = async (id) => {
    const promotion = promotions.value.find((p) => p.id === id);
    if (!promotion) throw new Error("Promotion not found");
    const newStatus = promotion.status === "active" ? "inactive" : "active";
    await updatePromotion(id, { status: newStatus });
  };
  const duplicatePromotion = async (id) => {
    const originalPromotion = promotions.value.find((p) => p.id === id);
    if (!originalPromotion) throw new Error("Promotion not found");
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      usageCount: _usageCount,
      ...rest
    } = originalPromotion;
    const duplicatedData = {
      ...rest,
      name: `${originalPromotion.name} (\u0E04\u0E31\u0E14\u0E25\u0E2D\u0E01)`,
      status: "inactive"
    };
    await createPromotion(duplicatedData);
  };
  const applyPromotion = async (promotionId, cartTotal, cartItems) => {
    const promotion = promotions.value.find((p) => p.id === promotionId);
    if (!promotion) throw new Error("Promotion not found");
    const discountApplication = calculator.calculateDiscount(promotion, cartTotal, cartItems);
    if (!discountApplication.applicable) {
      throw new Error(discountApplication.reason || "Promotion cannot be applied.");
    }
    await updatePromotion(promotionId, { usageCount: (promotion.usageCount || 0) + 1 });
    return discountApplication;
  };
  const getPromotionById = (id) => {
    return promotions.value.find((promo) => promo.id === id);
  };
  const getPromotionsByType = (type) => {
    return promotions.value.filter((promo) => promo.type === type);
  };
  const getPromotionsByStatus = (status) => {
    return promotions.value.filter((promo) => promo.status === status);
  };
  const searchPromotions = (query) => {
    if (!query.trim()) return promotions.value;
    const searchTerm = query.toLowerCase();
    return promotions.value.filter(
      (promo) => promo.name.toLowerCase().includes(searchTerm) || promo.description?.toLowerCase().includes(searchTerm)
    );
  };
  const getPromotionStats = () => {
    return {
      total: promotions.value.length,
      active: activePromotions.value.length,
      scheduled: scheduledPromotions.value.length,
      expired: expiredPromotions.value.length,
      totalUsage: promotions.value.reduce((total, promo) => total + (promo.usageCount || 0), 0)
    };
  };
  const validatePromotionDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = /* @__PURE__ */ new Date();
    if (start >= end) {
      return "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E32\u0E2B\u0E25\u0E31\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21";
    }
    if (start < now) {
      return "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49";
    }
    return null;
  };
  onMounted(loadPromotions);
  return {
    promotions,
    loading,
    processing,
    error,
    activePromotions,
    scheduledPromotions,
    expiredPromotions,
    loadPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus,
    duplicatePromotion,
    applyPromotion,
    getBestDiscount: (cartTotal, cartItems) => calculator.getBestDiscount(cartTotal, cartItems, activePromotions.value),
    getPromotionById,
    getPromotionsByType,
    getPromotionsByStatus,
    searchPromotions,
    getPromotionStats,
    validatePromotionDates
  };
}
