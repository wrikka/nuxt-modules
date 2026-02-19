import { onMounted, readonly, ref } from "vue";
import { useMembershipApi } from "./useMembershipApi.js";
export const useMembership = () => {
  const memberships = ref([]);
  const loyaltyPoints = ref([]);
  const membershipTiers = ref([]);
  const pointRedemptions = ref([]);
  const membershipRewards = ref([]);
  const statistics = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const api = useMembershipApi();
  async function executeAction(action, state, errorMessage) {
    loading.value = true;
    error.value = null;
    try {
      const result = await action();
      if (!Array.isArray(state.value)) {
        state.value = result;
      } else if (Array.isArray(result)) {
        state.value = result;
      } else if (result && typeof result === "object" && "id" in result) {
        const items = state.value;
        const index = items.findIndex((item) => item.id === result.id);
        if (index !== -1) {
          items.splice(index, 1, result);
        } else {
          items.push(result);
        }
      }
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : errorMessage;
      return null;
    } finally {
      loading.value = false;
    }
  }
  onMounted(
    () => executeAction(api.fetchMembershipTiers, membershipTiers, "Failed to load membership tiers")
  );
  return {
    memberships: readonly(memberships),
    loyaltyPoints: readonly(loyaltyPoints),
    membershipTiers: readonly(membershipTiers),
    pointRedemptions: readonly(pointRedemptions),
    membershipRewards: readonly(membershipRewards),
    loading: readonly(loading),
    error: readonly(error),
    loadCustomerMembership: (customerId) => executeAction(
      () => api.fetchCustomerMembership(customerId),
      memberships,
      "Failed to load customer membership"
    ),
    createMembership: (membership) => executeAction(
      () => api.createMembership(membership),
      memberships,
      "Failed to create membership"
    ),
    addLoyaltyPoints: (points) => executeAction(
      () => api.addLoyaltyPoints(points),
      loyaltyPoints,
      "Failed to add loyalty points"
    ),
    redeemPoints: (redemption) => executeAction(
      () => api.redeemPoints(redemption),
      pointRedemptions,
      "Failed to redeem points"
    ),
    loadLoyaltyPoints: (customerId, filters) => executeAction(
      () => api.fetchLoyaltyPoints(customerId, filters),
      loyaltyPoints,
      "Failed to load loyalty points"
    ),
    loadMembershipTiers: () => executeAction(api.fetchMembershipTiers, membershipTiers, "Failed to load membership tiers"),
    loadMembershipRewards: (tier) => executeAction(
      () => api.fetchMembershipRewards(tier),
      membershipRewards,
      "Failed to load membership rewards"
    ),
    upgradeMembershipTier: (customerId) => executeAction(
      () => api.upgradeMembershipTier(customerId),
      memberships,
      "Failed to upgrade membership tier"
    ),
    getMembershipStatistics: () => executeAction(
      api.fetchMembershipStatistics,
      statistics,
      "Failed to get membership statistics"
    )
  };
};
