import type {
	LoyaltyPoint,
	Membership,
	MembershipReward,
	MembershipTier,
	PointRedemption,
} from "#shared/types"
import type { MembershipError } from "./types"

export function useMembershipApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as MembershipError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchCustomerMembership = async (customerId: string) => {
		try {
			return await $fetch<Membership>(`/api/memberships/customer/${customerId}`)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load customer membership"))
		}
	}

	const createMembership = async (membership: { customerId: string; tier: Membership["tier"] }) => {
		try {
			return await $fetch<Membership>("/api/memberships", {
				method: "POST",
				body: membership,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to create membership"))
		}
	}

	const addLoyaltyPoints = async (
		points: { customerId: string; orderId: string; points: number; description: string },
	) => {
		try {
			return await $fetch<LoyaltyPoint>("/api/loyalty/points", {
				method: "POST",
				body: points,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to add loyalty points"))
		}
	}

	const redeemPoints = async (
		redemption: { customerId: string; pointsUsed: number; reward: string; value: number },
	) => {
		try {
			return await $fetch<PointRedemption>("/api/loyalty/redeem", {
				method: "POST",
				body: redemption,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to redeem points"))
		}
	}

	const fetchLoyaltyPoints = async (
		customerId: string,
		filters?: { type?: LoyaltyPoint["type"]; startDate?: Date; endDate?: Date },
	) => {
		try {
			return await $fetch<LoyaltyPoint[]>(`/api/loyalty/points/customer/${customerId}`, {
				query: filters,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load loyalty points"))
		}
	}

	const fetchMembershipTiers = async () => {
		try {
			return await $fetch<MembershipTier[]>("/api/memberships/tiers")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load membership tiers"))
		}
	}

	const fetchMembershipRewards = async (tier?: Membership["tier"]) => {
		try {
			return await $fetch<MembershipReward[]>("/api/memberships/rewards", { query: { tier } })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load membership rewards"))
		}
	}

	const upgradeMembershipTier = async (customerId: string) => {
		try {
			return await $fetch<Membership>(`/api/memberships/${customerId}/upgrade`, { method: "POST" })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to upgrade membership tier"))
		}
	}

	const fetchMembershipStatistics = async () => {
		try {
			return await $fetch("/api/memberships/statistics")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to get membership statistics"))
		}
	}

	return {
		fetchCustomerMembership,
		createMembership,
		addLoyaltyPoints,
		redeemPoints,
		fetchLoyaltyPoints,
		fetchMembershipTiers,
		fetchMembershipRewards,
		upgradeMembershipTier,
		fetchMembershipStatistics,
	}
}
