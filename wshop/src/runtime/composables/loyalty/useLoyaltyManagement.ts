import type { LoyaltyMember, LoyaltyTier } from "#shared/types"

export const useLoyaltyManagement = () => {
	// API layer
	const loyaltyApi = useLoyaltyApi()
	const { loading, processing } = loyaltyApi

	// Utils
	const {
		defaultTiers,
		getTierBadgeClass,
		getTierName,
		getStatusClass,
		getStatusText,
	} = useLoyaltyUtils()

	// State
	const members = ref<LoyaltyMember[]>([])
	const loyaltyTiers = ref<LoyaltyTier[]>(defaultTiers)
	const programStats = ref({ totalMembers: 0, activeMembers: 0, totalPointsEarned: 0 })

	// Form state
	const searchQuery = ref("")
	const filterTier = ref("")
	const filterStatus = ref("")
	const showMemberForm = ref(false)
	const showPointsForm = ref(false)
	const editingMember = ref<Partial<LoyaltyMember> | null>(null)
	const selectedMember = ref<LoyaltyMember | null>(null)

	// Computed
	const filteredMembers = computed(() => {
		let filtered = members.value

		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase()
			filtered = filtered.filter((member: LoyaltyMember) =>
				member.name.toLowerCase().includes(query)
				|| member.email.toLowerCase().includes(query)
				|| member.phone.includes(query)
			)
		}

		if (filterTier.value) {
			filtered = filtered.filter((member: LoyaltyMember) =>
				member.tierId === parseInt(filterTier.value)
			)
		}

		if (filterStatus.value) {
			filtered = filtered.filter((member: LoyaltyMember) => member.status === filterStatus.value)
		}

		return filtered
	})

	// API functions (using API layer)
	const loadMembers = async () => {
		try {
			const data = await loyaltyApi.loadMembers()
			members.value = data
		} catch (error) {
			console.error("Failed to load members:", error)
		}
	}

	const loadLoyaltyTiers = async () => {
		try {
			const data = await loyaltyApi.loadLoyaltyTiers()
			loyaltyTiers.value = data
		} catch (error) {
			console.error("Failed to load tiers:", error)
		}
	}

	const createMember = async (member: Partial<LoyaltyMember>) => {
		try {
			await loyaltyApi.createMember(member)
			await loadMembers()
		} catch (error) {
			console.error("Failed to create member:", error)
			throw error
		}
	}

	const updateMember = async (id: number, member: Partial<LoyaltyMember>) => {
		try {
			await loyaltyApi.updateMember(id, member)
			await loadMembers()
		} catch (error) {
			console.error("Failed to update member:", error)
			throw error
		}
	}

	const deleteMemberApi = async (id: number) => {
		try {
			await loyaltyApi.deleteMemberApi(id)
			await loadMembers()
		} catch (error) {
			console.error("Failed to delete member:", error)
			throw error
		}
	}

	const suspendMemberApi = async (id: number) => {
		try {
			await loyaltyApi.suspendMemberApi(id)
			await loadMembers()
		} catch (error) {
			console.error("Failed to suspend member:", error)
			throw error
		}
	}

	const adjustMemberPoints = async (id: number, adjustment: any) => {
		try {
			await loyaltyApi.adjustMemberPoints(id, adjustment)
			await loadMembers()
		} catch (error) {
			console.error("Failed to adjust points:", error)
			throw error
		}
	}

	// Action functions
	const openAddMemberForm = () => {
		editingMember.value = null
		showMemberForm.value = true
	}

	const openEditMemberForm = (member: LoyaltyMember) => {
		editingMember.value = { ...member }
		showMemberForm.value = true
	}

	const openAdjustPointsForm = (member: LoyaltyMember) => {
		selectedMember.value = member
		showPointsForm.value = true
	}

	const viewMember = (member: LoyaltyMember) => {
		console.log("View member:", member)
	}

	const suspendMember = async (member: LoyaltyMember) => {
		try {
			await suspendMemberApi(member.id)
			await loadMembers()
		} catch (error) {
			console.error("Failed to suspend member:", error)
		}
	}

	const deleteMember = async (member: LoyaltyMember) => {
		if (confirm(`คุณต้องการลบสมาชิก "${member.name}" ใช่หรือไม่?`)) {
			try {
				await deleteMemberApi(member.id)
				await loadMembers()
			} catch (error) {
				console.error("Failed to delete member:", error)
			}
		}
	}

	const saveMember = async (memberData: Partial<LoyaltyMember>) => {
		try {
			if (editingMember.value && editingMember.value.id) {
				await updateMember(editingMember.value.id, memberData)
			} else {
				await createMember(memberData)
			}
			showMemberForm.value = false
		} catch (error) {
			console.error("Failed to save member:", error)
			throw error
		}
	}

	const savePointsAdjustment = async (adjustment: any) => {
		if (!selectedMember.value) return
		try {
			await adjustMemberPoints(selectedMember.value.id, adjustment)
			showPointsForm.value = false
		} catch (error) {
			console.error("Failed to adjust points:", error)
			throw error
		}
	}

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
		savePointsAdjustment,
	}
}
