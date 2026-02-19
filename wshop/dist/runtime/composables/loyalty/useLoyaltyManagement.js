export const useLoyaltyManagement = () => {
  const loyaltyApi = useLoyaltyApi();
  const { loading, processing } = loyaltyApi;
  const {
    defaultTiers,
    getTierBadgeClass,
    getTierName,
    getStatusClass,
    getStatusText
  } = useLoyaltyUtils();
  const members = ref([]);
  const loyaltyTiers = ref(defaultTiers);
  const programStats = ref({ totalMembers: 0, activeMembers: 0, totalPointsEarned: 0 });
  const searchQuery = ref("");
  const filterTier = ref("");
  const filterStatus = ref("");
  const showMemberForm = ref(false);
  const showPointsForm = ref(false);
  const editingMember = ref(null);
  const selectedMember = ref(null);
  const filteredMembers = computed(() => {
    let filtered = members.value;
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (member) => member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query) || member.phone.includes(query)
      );
    }
    if (filterTier.value) {
      filtered = filtered.filter(
        (member) => member.tierId === parseInt(filterTier.value)
      );
    }
    if (filterStatus.value) {
      filtered = filtered.filter((member) => member.status === filterStatus.value);
    }
    return filtered;
  });
  const loadMembers = async () => {
    try {
      const data = await loyaltyApi.loadMembers();
      members.value = data;
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  };
  const loadLoyaltyTiers = async () => {
    try {
      const data = await loyaltyApi.loadLoyaltyTiers();
      loyaltyTiers.value = data;
    } catch (error) {
      console.error("Failed to load tiers:", error);
    }
  };
  const createMember = async (member) => {
    try {
      await loyaltyApi.createMember(member);
      await loadMembers();
    } catch (error) {
      console.error("Failed to create member:", error);
      throw error;
    }
  };
  const updateMember = async (id, member) => {
    try {
      await loyaltyApi.updateMember(id, member);
      await loadMembers();
    } catch (error) {
      console.error("Failed to update member:", error);
      throw error;
    }
  };
  const deleteMemberApi = async (id) => {
    try {
      await loyaltyApi.deleteMemberApi(id);
      await loadMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
      throw error;
    }
  };
  const suspendMemberApi = async (id) => {
    try {
      await loyaltyApi.suspendMemberApi(id);
      await loadMembers();
    } catch (error) {
      console.error("Failed to suspend member:", error);
      throw error;
    }
  };
  const adjustMemberPoints = async (id, adjustment) => {
    try {
      await loyaltyApi.adjustMemberPoints(id, adjustment);
      await loadMembers();
    } catch (error) {
      console.error("Failed to adjust points:", error);
      throw error;
    }
  };
  const openAddMemberForm = () => {
    editingMember.value = null;
    showMemberForm.value = true;
  };
  const openEditMemberForm = (member) => {
    editingMember.value = { ...member };
    showMemberForm.value = true;
  };
  const openAdjustPointsForm = (member) => {
    selectedMember.value = member;
    showPointsForm.value = true;
  };
  const viewMember = (member) => {
    console.log("View member:", member);
  };
  const suspendMember = async (member) => {
    try {
      await suspendMemberApi(member.id);
      await loadMembers();
    } catch (error) {
      console.error("Failed to suspend member:", error);
    }
  };
  const deleteMember = async (member) => {
    if (confirm(`\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01 "${member.name}" \u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?`)) {
      try {
        await deleteMemberApi(member.id);
        await loadMembers();
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
  };
  const saveMember = async (memberData) => {
    try {
      if (editingMember.value && editingMember.value.id) {
        await updateMember(editingMember.value.id, memberData);
      } else {
        await createMember(memberData);
      }
      showMemberForm.value = false;
    } catch (error) {
      console.error("Failed to save member:", error);
      throw error;
    }
  };
  const savePointsAdjustment = async (adjustment) => {
    if (!selectedMember.value) return;
    try {
      await adjustMemberPoints(selectedMember.value.id, adjustment);
      showPointsForm.value = false;
    } catch (error) {
      console.error("Failed to adjust points:", error);
      throw error;
    }
  };
  return {
    // State
    members,
    loyaltyTiers,
    programStats,
    loading,
    processing,
    searchQuery,
    filterTier,
    filterStatus,
    showMemberForm,
    showPointsForm,
    editingMember,
    selectedMember,
    // Computed
    filteredMembers,
    // Helper functions
    getTierBadgeClass,
    getTierName,
    getStatusClass,
    getStatusText,
    // Action functions
    loadMembers,
    loadLoyaltyTiers,
    openAddMemberForm,
    openEditMemberForm,
    openAdjustPointsForm,
    viewMember,
    suspendMember,
    deleteMember,
    saveMember,
    savePointsAdjustment
  };
};
