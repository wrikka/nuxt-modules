import type { ContestEntry, GamificationBadge, ReferralContest, UserBadge } from "../types/new-features"

export function useReferralContests() {
	const activeContests = useState<ReferralContest[]>("active-contests", () => [])
	const currentLeaderboard = useState<ContestEntry[]>("contest-leaderboard", () => [])
	const userBadges = useState<UserBadge[]>("user-badges", () => [])
	const availableBadges = useState<GamificationBadge[]>("available-badges", () => [])

	async function fetchActiveContests(): Promise<ReferralContest[]> {
		const response = await $fetch<ReferralContest[]>("/api/user-acquisition/contests/active")
		activeContests.value = response
		return response
	}

	async function getContestLeaderboard(contestId: string): Promise<ContestEntry[]> {
		const response = await $fetch<ContestEntry[]>(`/api/user-acquisition/contests/${contestId}/leaderboard`)
		currentLeaderboard.value = response
		return response
	}

	async function joinContest(contestId: string, userId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/contests/${contestId}/join`, {
			method: "POST",
			body: { userId },
		})
	}

	async function updateContestScore(contestId: string, userId: string, score: number): Promise<void> {
		await $fetch(`/api/user-acquisition/contests/${contestId}/score`, {
			method: "POST",
			body: { userId, score },
		})
	}

	function getUserRank(contestId: string, userId: string): number {
		const entry = currentLeaderboard.value.find(
			(e) => e.contestId === contestId && e.userId === userId,
		)
		return entry?.rank ?? 0
	}

	async function fetchUserBadges(userId: string): Promise<UserBadge[]> {
		const response = await $fetch<UserBadge[]>(`/api/user-acquisition/badges/user/${userId}`)
		userBadges.value = response
		return response
	}

	async function fetchAvailableBadges(): Promise<GamificationBadge[]> {
		const response = await $fetch<GamificationBadge[]>("/api/user-acquisition/badges/available")
		availableBadges.value = response
		return response
	}

	async function checkBadgeEligibility(userId: string): Promise<GamificationBadge[]> {
		const newBadges = await $fetch<GamificationBadge[]>("/api/user-acquisition/badges/check", {
			method: "POST",
			body: { userId },
		})

		for (const badge of newBadges) {
			userBadges.value.push({
				id: `ub_${Date.now()}_${badge.id}`,
				badgeId: badge.id,
				userId,
				earnedAt: new Date(),
				equipped: false,
			})
		}

		return newBadges
	}

	async function equipBadge(badgeId: string, userId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/badges/${badgeId}/equip`, {
			method: "POST",
			body: { userId },
		})

		userBadges.value = userBadges.value.map((b) =>
			b.badgeId === badgeId ? { ...b, equipped: true } : { ...b, equipped: false },
		)
	}

	function calculateGamificationScore(userId: string): number {
		const badges = userBadges.value.filter((b) => b.userId === userId)
		const badgeScore = badges.length * 100
		const equippedBonus = badges.filter((b) => b.equipped).length * 50
		return badgeScore + equippedBonus
	}

	async function createContest(params: Omit<ReferralContest, "id" | "leaderboard" | "createdAt">): Promise<ReferralContest> {
		const response = await $fetch<ReferralContest>("/api/user-acquisition/contests", {
			method: "POST",
			body: params,
		})
		activeContests.value.push(response)
		return response
	}

	async function endContest(contestId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/contests/${contestId}/end`, {
			method: "POST",
		})

		const contest = activeContests.value.find((c) => c.id === contestId)
		if (contest) {
			contest.status = "ended"
		}
	}

	async function distributePrizes(contestId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/contests/${contestId}/distribute-prizes`, {
			method: "POST",
		})
	}

	return {
		activeContests: readonly(activeContests),
		currentLeaderboard: readonly(currentLeaderboard),
		userBadges: readonly(userBadges),
		availableBadges: readonly(availableBadges),
		fetchActiveContests,
		getContestLeaderboard,
		joinContest,
		updateContestScore,
		getUserRank,
		fetchUserBadges,
		fetchAvailableBadges,
		checkBadgeEligibility,
		equipBadge,
		calculateGamificationScore,
		createContest,
		endContest,
		distributePrizes,
	}
}
