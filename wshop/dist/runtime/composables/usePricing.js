import { ref } from "vue";
export const usePricing = () => {
  const rules = ref([]);
  const loading = ref(false);
  const fetchRules = async () => {
    loading.value = true;
    try {
      rules.value = [
        {
          id: "1",
          name: "10% off for VIPs",
          description: "VIP customers get 10% off",
          priority: 1,
          enabled: true,
          conditions: {
            operator: "AND",
            conditions: [{ fact: "customerTier", operator: "equalTo", value: "VIP" }]
          },
          actions: [{ type: "discountPercentage", value: 10, target: "order" }]
        },
        {
          id: "2",
          name: "Free shipping over $100",
          description: "Orders over $100 get free shipping",
          priority: 2,
          enabled: true,
          conditions: {
            operator: "AND",
            conditions: [{ fact: "orderTotal", operator: "greaterThan", value: 100 }]
          },
          actions: [{ type: "freeShipping", value: 0, target: "shipping" }]
        }
      ];
    } catch (error) {
      console.error("Failed to fetch pricing rules:", error);
    } finally {
      loading.value = false;
    }
  };
  return {
    rules,
    loading,
    fetchRules
  };
};
