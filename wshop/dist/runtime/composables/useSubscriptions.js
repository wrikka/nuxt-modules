import { ref } from "vue";
export const useSubscriptions = () => {
  const subscriptions = ref([]);
  const loading = ref(false);
  const fetchPlans = async () => {
    loading.value = true;
    try {
      subscriptions.value = [
        {
          id: "1",
          customerId: "1",
          planId: "plan_basic",
          status: "active",
          startDate: /* @__PURE__ */ new Date(),
          nextBillingDate: /* @__PURE__ */ new Date("2023-12-01")
        },
        {
          id: "2",
          customerId: "2",
          planId: "plan_premium",
          status: "cancelled",
          startDate: /* @__PURE__ */ new Date(),
          nextBillingDate: /* @__PURE__ */ new Date("2023-11-15")
        }
      ];
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
    } finally {
      loading.value = false;
    }
  };
  return {
    subscriptions,
    loading,
    fetchPlans
  };
};
