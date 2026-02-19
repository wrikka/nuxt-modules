export const useLoyaltyApi = () => {
  const loading = ref(false);
  const processing = ref(false);
  const loadMembers = async () => {
    loading.value = true;
    try {
      const data = await $fetch("/api/loyalty/members");
      return data;
    } catch (error) {
      console.error("Failed to load members:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const loadLoyaltyTiers = async () => {
    try {
      const data = await $fetch("/api/loyalty/tiers");
      return data;
    } catch (error) {
      console.error("Failed to load tiers:", error);
      throw error;
    }
  };
  const createMember = async (member) => {
    processing.value = true;
    try {
      const data = await $fetch("/api/loyalty/members", {
        method: "POST",
        body: member
      });
      return data;
    } catch (error) {
      console.error("Failed to create member:", error);
      throw error;
    } finally {
      processing.value = false;
    }
  };
  const updateMember = async (id, member) => {
    processing.value = true;
    try {
      const data = await $fetch(`/api/loyalty/members/${id}`, {
        method: "PUT",
        body: member
      });
      return data;
    } catch (error) {
      console.error("Failed to update member:", error);
      throw error;
    } finally {
      processing.value = false;
    }
  };
  const deleteMemberApi = async (id) => {
    processing.value = true;
    try {
      await $fetch(`/api/loyalty/members/${id}`, {
        method: "DELETE"
      });
    } catch (error) {
      console.error("Failed to delete member:", error);
      throw error;
    } finally {
      processing.value = false;
    }
  };
  const suspendMemberApi = async (id) => {
    processing.value = true;
    try {
      const data = await $fetch(`/api/loyalty/members/${id}/suspend`, {
        method: "POST"
      });
      return data;
    } catch (error) {
      console.error("Failed to suspend member:", error);
      throw error;
    } finally {
      processing.value = false;
    }
  };
  const adjustMemberPoints = async (id, adjustment) => {
    processing.value = true;
    try {
      const data = await $fetch(`/api/loyalty/members/${id}/points`, {
        method: "POST",
        body: adjustment
      });
      return data;
    } catch (error) {
      console.error("Failed to adjust points:", error);
      throw error;
    } finally {
      processing.value = false;
    }
  };
  const loadProgramStats = async () => {
    try {
      const data = await $fetch("/api/loyalty/stats");
      return data;
    } catch (error) {
      console.error("Failed to load program stats:", error);
      throw error;
    }
  };
  return {
    loading: readonly(loading),
    processing: readonly(processing),
    loadMembers,
    loadLoyaltyTiers,
    createMember,
    updateMember,
    deleteMemberApi,
    suspendMemberApi,
    adjustMemberPoints,
    loadProgramStats
  };
};
