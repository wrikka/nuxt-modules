export function useMembershipApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchCustomerMembership = async (customerId) => {
    try {
      return await $fetch(`/api/memberships/customer/${customerId}`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load customer membership"));
    }
  };
  const createMembership = async (membership) => {
    try {
      return await $fetch("/api/memberships", {
        method: "POST",
        body: membership
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to create membership"));
    }
  };
  const addLoyaltyPoints = async (points) => {
    try {
      return await $fetch("/api/loyalty/points", {
        method: "POST",
        body: points
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to add loyalty points"));
    }
  };
  const redeemPoints = async (redemption) => {
    try {
      return await $fetch("/api/loyalty/redeem", {
        method: "POST",
        body: redemption
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to redeem points"));
    }
  };
  const fetchLoyaltyPoints = async (customerId, filters) => {
    try {
      return await $fetch(`/api/loyalty/points/customer/${customerId}`, {
        query: filters
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load loyalty points"));
    }
  };
  const fetchMembershipTiers = async () => {
    try {
      return await $fetch("/api/memberships/tiers");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load membership tiers"));
    }
  };
  const fetchMembershipRewards = async (tier) => {
    try {
      return await $fetch("/api/memberships/rewards", { query: { tier } });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load membership rewards"));
    }
  };
  const upgradeMembershipTier = async (customerId) => {
    try {
      return await $fetch(`/api/memberships/${customerId}/upgrade`, { method: "POST" });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to upgrade membership tier"));
    }
  };
  const fetchMembershipStatistics = async () => {
    try {
      return await $fetch("/api/memberships/statistics");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to get membership statistics"));
    }
  };
  return {
    fetchCustomerMembership,
    createMembership,
    addLoyaltyPoints,
    redeemPoints,
    fetchLoyaltyPoints,
    fetchMembershipTiers,
    fetchMembershipRewards,
    upgradeMembershipTier,
    fetchMembershipStatistics
  };
}
