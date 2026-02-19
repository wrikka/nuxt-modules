import { nanoid } from "nanoid"

export function useReferrals() {
	const config = useRuntimeConfig()
	const referralConfig = config.public.userAcquisition?.referral

	const referralCodes = useState<Record<string, string>>("referral-codes", () => ({}))
	const referralLinks = useState<Record<string, string>>("referral-links", () => ({}))

	function generateReferralCode(userId: string): string {
		if (!referralConfig?.enabled) {
			throw new Error("Referral system is not enabled")
		}

		const prefix = referralConfig.codePrefix || ""
		const length = referralConfig.codeLength || 8
		const code = prefix + nanoid(length)

		referralCodes.value[userId] = code
		return code
	}

	function getReferralCode(userId: string): string | null {
		return referralCodes.value[userId] || null
	}

	function generateReferralLink(code: string, baseUrl?: string): string {
		if (!referralConfig?.enabled) {
			throw new Error("Referral system is not enabled")
		}

		const url = baseUrl || window.location.origin
		return `${url}/ref/${code}`
	}

	function getReferralLink(userId: string, baseUrl?: string): string | null {
		const code = getReferralCode(userId)
		if (!code) return null

		const link = generateReferralLink(code, baseUrl)
		referralLinks.value[userId] = link
		return link
	}

	function trackReferralClick(code: string): void {
		if (!referralConfig?.trackClicks) return

		useFetch("/api/user-acquisition/referrals/click", {
			method: "POST",
			body: { code },
		})
	}

	function validateReferralCode(code: string): boolean {
		if (!referralConfig?.enabled) return false

		const exists = Object.values(referralCodes.value).includes(code)
		return exists
	}

	function getReferralReward(tier: number): number {
		if (!referralConfig) return 0

		const rewards = referralConfig.tierRewards || []
		return rewards[tier - 1] || referralConfig.defaultReward || 0
	}

	return {
		generateReferralCode,
		getReferralCode,
		generateReferralLink,
		getReferralLink,
		trackReferralClick,
		validateReferralCode,
		getReferralReward,
	}
}
