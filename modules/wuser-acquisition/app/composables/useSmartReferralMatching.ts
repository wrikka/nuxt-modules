import type { ReferralMatch, ReferralPotential } from "../types/new-features"

export function useSmartReferralMatching() {
	const potentialMatches = useState<ReferralMatch[]>("potential-matches", () => [])
	const userPotential = useState<ReferralPotential | null>("user-referral-potential", () => null)
	const matchHistory = useState<ReferralMatch[]>("match-history", () => [])

	async function findPotentialMatches(referrerId: string): Promise<ReferralMatch[]> {
		const response = await $fetch<ReferralMatch[]>(
			`/api/user-acquisition/smart-matching/potential/${referrerId}`,
		)
		potentialMatches.value = response
		return response
	}

	async function calculateUserPotential(userId: string): Promise<ReferralPotential> {
		const response = await $fetch<ReferralPotential>(
			`/api/user-acquisition/smart-matching/potential/${userId}`,
		)
		userPotential.value = response
		return response
	}

	async function getMatchScore(referrerId: string, refereeId: string): Promise<number> {
		const response = await $fetch<{ score: number }>(
			"/api/user-acquisition/smart-matching/score",
			{
				method: "POST",
				body: { referrerId, refereeId },
			},
		)
		return response.score
	}

	async function contactPotentialReferee(matchId: string, message?: string): Promise<void> {
		await $fetch(`/api/user-acquisition/smart-matching/${matchId}/contact`, {
			method: "POST",
			body: { message },
		})

		const match = potentialMatches.value.find((m) => m.id === matchId)
		if (match) {
			match.status = "contacted"
			match.contactedAt = new Date()
		}
	}

	async function markMatchConverted(matchId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/smart-matching/${matchId}/convert`, {
			method: "POST",
		})

		const match = potentialMatches.value.find((m) => m.id === matchId)
		if (match) {
			match.status = "converted"
			match.convertedAt = new Date()
		}
	}

	function getHighPotentialUsers(minScore = 70): ReferralMatch[] {
		return potentialMatches.value.filter((m) => m.score >= minScore)
	}

	async function getMatchRecommendations(userId: string): Promise<string[]> {
		const potential = await calculateUserPotential(userId)
		return potential.recommendations
	}

	async function fetchMatchHistory(userId: string): Promise<ReferralMatch[]> {
		const response = await $fetch<ReferralMatch[]>(
			`/api/user-acquisition/smart-matching/history/${userId}`,
		)
		matchHistory.value = response
		return response
	}

	function analyzeMatchFactors(match: ReferralMatch): {
		type: string
		impact: "high" | "medium" | "low"
		description: string
	}[] {
		return match.reasons.map((reason) => ({
			type: reason.type,
			impact: reason.score >= 30 ? "high" : reason.score >= 15 ? "medium" : "low",
			description: reason.description,
		}))
	}

	async function autoMatchBatch(referrerIds: string[]): Promise<ReferralMatch[]> {
		const response = await $fetch<ReferralMatch[]>("/api/user-acquisition/smart-matching/batch", {
			method: "POST",
			body: { referrerIds },
		})
		potentialMatches.value = [...potentialMatches.value, ...response]
		return response
	}

	return {
		potentialMatches: readonly(potentialMatches),
		userPotential: readonly(userPotential),
		matchHistory: readonly(matchHistory),
		findPotentialMatches,
		calculateUserPotential,
		getMatchScore,
		contactPotentialReferee,
		markMatchConverted,
		getHighPotentialUsers,
		getMatchRecommendations,
		fetchMatchHistory,
		analyzeMatchFactors,
		autoMatchBatch,
	}
}
