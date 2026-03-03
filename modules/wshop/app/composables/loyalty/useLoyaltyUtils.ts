import type { LoyaltyTier } from "#shared/types"

export const useLoyaltyUtils = () => {
	const defaultTiers: LoyaltyTier[] = [
		{ id: 1, name: "Silver", minPoints: 0, benefits: [], color: "#9CA3AF" },
		{ id: 2, name: "Gold", minPoints: 1000, benefits: [], color: "#F59E0B" },
		{ id: 3, name: "Platinum", minPoints: 5000, benefits: [], color: "#8B5CF6" },
	]

	const getTierBadgeClass = (tierId: number, tiers: LoyaltyTier[] = defaultTiers): string => {
		const tier = tiers.find((t: LoyaltyTier) => t.id === tierId)
		if (!tier) return "bg-gray-100 text-gray-800"

		switch (tier.name) {
			case "Silver":
				return "bg-gray-100 text-gray-800"
			case "Gold":
				return "bg-yellow-100 text-yellow-800"
			case "Platinum":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getTierName = (tierId: number, tiers: LoyaltyTier[] = defaultTiers): string => {
		const tier = tiers.find((t: LoyaltyTier) => t.id === tierId)
		return tier?.name || "Unknown"
	}

	const getStatusClass = (status: string): string => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800"
			case "inactive":
				return "bg-gray-100 text-gray-800"
			case "suspended":
				return "bg-orange-100 text-orange-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusText = (status: string): string => {
		switch (status) {
			case "active":
				return "ใช้งานอยู่"
			case "inactive":
				return "ไม่ใช้งาน"
			case "suspended":
				return "ระงับ"
			default:
				return status
		}
	}

	const getTierByPoints = (
		points: number,
		tiers: LoyaltyTier[] = defaultTiers,
	): LoyaltyTier | null => {
		const sortedTiers = [...tiers].sort((a, b) => b.minPoints - a.minPoints)
		return sortedTiers.find(tier => points >= tier.minPoints) || sortedTiers[sortedTiers.length - 1]
			|| null
	}

	const getNextTier = (
		currentTierId: number,
		tiers: LoyaltyTier[] = defaultTiers,
	): LoyaltyTier | null => {
		const currentTier = tiers.find(t => t.id === currentTierId)
		if (!currentTier) return null

		const sortedTiers = [...tiers].sort((a, b) => a.minPoints - b.minPoints)
		const currentIndex = sortedTiers.findIndex(t => t.id === currentTierId)
		return currentIndex < sortedTiers.length - 1 ? sortedTiers[currentIndex + 1] : null
	}

	const getPointsToNextTier = (
		currentPoints: number,
		currentTierId: number,
		tiers: LoyaltyTier[] = defaultTiers,
	): number => {
		const nextTier = getNextTier(currentTierId, tiers)
		if (!nextTier) return 0
		return Math.max(0, nextTier.minPoints - currentPoints)
	}

	return {
		defaultTiers,
		getTierBadgeClass,
		getTierName,
		getStatusClass,
		getStatusText,
		getTierByPoints,
		getNextTier,
		getPointsToNextTier,
	}
}
