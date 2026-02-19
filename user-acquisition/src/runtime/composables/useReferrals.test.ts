import { beforeEach, describe, expect, it, vi } from "vitest"
import { useReferrals } from "./useReferrals"

describe("useReferrals", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should generate referral code", () => {
		const { generateReferralCode } = useReferrals()

		const code = generateReferralCode("user-123")

		expect(code).toBeDefined()
		expect(code.length).toBeGreaterThan(8)
	})

	it("should get referral code", () => {
		const { generateReferralCode, getReferralCode } = useReferrals()

		const userId = "user-123"
		const code = generateReferralCode(userId)
		const retrievedCode = getReferralCode(userId)

		expect(retrievedCode).toBe(code)
	})

	it("should generate referral link", () => {
		const { generateReferralLink } = useReferrals()

		const code = "ABC123"
		const link = generateReferralLink(code, "https://example.com")

		expect(link).toBe("https://example.com/ref/ABC123")
	})

	it("should get referral link", () => {
		const { generateReferralCode, getReferralLink } = useReferrals()

		const userId = "user-123"
		const code = generateReferralCode(userId)
		const link = getReferralLink(userId, "https://example.com")

		expect(link).toContain(code)
		expect(link).toContain("/ref/")
	})

	it("should validate referral code", () => {
		const { generateReferralCode, validateReferralCode } = useReferrals()

		const userId = "user-123"
		const code = generateReferralCode(userId)
		const isValid = validateReferralCode(code)

		expect(isValid).toBe(true)
	})

	it("should get referral reward by tier", () => {
		const { getReferralReward } = useReferrals()

		const tier1Reward = getReferralReward(1)
		const tier2Reward = getReferralReward(2)
		const tier3Reward = getReferralReward(3)

		expect(tier1Reward).toBeDefined()
		expect(tier2Reward).toBeDefined()
		expect(tier3Reward).toBeDefined()
	})
})
