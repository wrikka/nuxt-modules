import type {
	LoyaltyPoint,
	Membership,
	MembershipReward,
	MembershipTier,
	PointRedemption,
} from "#shared/types"
import { onMounted, readonly, ref } from "vue"
import { useMembershipApi } from "./useMembershipApi"

export const useMembership = () => {
	const memberships = ref<Membership[]>([])
	const loyaltyPoints = ref<LoyaltyPoint[]>([])
	const membershipTiers = ref<MembershipTier[]>([])
	const pointRedemptions = ref<PointRedemption[]>([])
	const membershipRewards = ref<MembershipReward[]>([])
	const statistics = ref<any>(null)
	const loading = ref(false)
	const error = ref<string | null>(null)

	const api = useMembershipApi()

	async function executeAction<T>(
		action: () => Promise<T[]>,
		state: Ref<T[]>,
		errorMessage: string,
	): Promise<T[] | null>
	async function executeAction<T>(
		action: () => Promise<T>,
		state: Ref<T[]>,
		errorMessage: string,
	): Promise<T | null>
	async function executeAction<T>(
		action: () => Promise<T>,
		state: Ref<T>,
		errorMessage: string,
	): Promise<T | null>
	async function executeAction(
		action: () => Promise<any>,
		state: Ref<any>,
		errorMessage: string,
	): Promise<any | null> {
		loading.value = true
		error.value = null
		try {
			const result = await action()
			if (!Array.isArray(state.value)) {
				state.value = result
			} else if (Array.isArray(result)) {
				state.value = result
			} else if (result && typeof result === "object" && "id" in result) {
				const items = state.value as any[]
				const index = items.findIndex(item => item.id === (result as any).id)
				if (index !== -1) {
					items.splice(index, 1, result)
				} else {
					items.push(result)
				}
			}
			return result
		} catch (err) {
			error.value = err instanceof Error ? err.message : errorMessage
			return null
		} finally {
			loading.value = false
		}
	}

	onMounted(() =>
		executeAction(api.fetchMembershipTiers, membershipTiers, "Failed to load membership tiers")
	)

	return {
		memberships: readonly(memberships),
		loyaltyPoints: readonly(loyaltyPoints),
		membershipTiers: readonly(membershipTiers),
		pointRedemptions: readonly(pointRedemptions),
		membershipRewards: readonly(membershipRewards),
		loading: readonly(loading),
		error: readonly(error),
		loadCustomerMembership: (customerId: string) =>
			executeAction(
				() => api.fetchCustomerMembership(customerId),
				memberships,
				"Failed to load customer membership",
			),
		createMembership: (membership: { customerId: string; tier: Membership["tier"] }) =>
			executeAction(
				() => api.createMembership(membership),
				memberships,
				"Failed to create membership",
			),
		addLoyaltyPoints: (
			points: { customerId: string; orderId: string; points: number; description: string },
		) =>
			executeAction(
				() => api.addLoyaltyPoints(points),
				loyaltyPoints,
				"Failed to add loyalty points",
			),
		redeemPoints: (
			redemption: { customerId: string; pointsUsed: number; reward: string; value: number },
		) =>
			executeAction(
				() => api.redeemPoints(redemption),
				pointRedemptions,
				"Failed to redeem points",
			),
		loadLoyaltyPoints: (
			customerId: string,
			filters?: { type?: LoyaltyPoint["type"]; startDate?: Date; endDate?: Date },
		) =>
			executeAction(
				() => api.fetchLoyaltyPoints(customerId, filters),
				loyaltyPoints,
				"Failed to load loyalty points",
			),
		loadMembershipTiers: () =>
			executeAction(api.fetchMembershipTiers, membershipTiers, "Failed to load membership tiers"),
		loadMembershipRewards: (tier?: Membership["tier"]) =>
			executeAction(
				() => api.fetchMembershipRewards(tier),
				membershipRewards,
				"Failed to load membership rewards",
			),
		upgradeMembershipTier: (customerId: string) =>
			executeAction(
				() => api.upgradeMembershipTier(customerId),
				memberships,
				"Failed to upgrade membership tier",
			),
		getMembershipStatistics: () =>
			executeAction(
				api.fetchMembershipStatistics,
				statistics,
				"Failed to get membership statistics",
			),
	}
}
