import { beforeEach, describe, expect, it, vi } from "vitest"
import { useRewards } from "./useRewards"

describe("useRewards", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should get tier name", () => {
		const { getTierName } = useRewards()

		const tier1Name = getTierName(0)
		const tier2Name = getTierName(1)

		expect(tier1Name).toBeDefined()
		expect(tier2Name).toBeDefined()
	})

	it("should get tier requirement", () => {
		const { getTierRequirement } = useRewards()

		const tier1Requirement = getTierRequirement(0)
		const tier2Requirement = getTierRequirement(1)

		expect(tier1Requirement).toBeGreaterThanOrEqual(0)
		expect(tier2Requirement).toBeGreaterThanOrEqual(0)
	})

	it("should calculate bonus multiplier", () => {
		const { calculateBonusMultiplier } = useRewards()

		const multiplier = calculateBonusMultiplier(100)

		expect(multiplier).toBeGreaterThanOrEqual(1)
	})

	it("should get next tier progress", () => {
		const { getNextTierProgress } = useRewards()

		const progress = getNextTierProgress()

		expect(progress).toBeGreaterThanOrEqual(0)
		expect(progress).toBeLessThanOrEqual(100)
	})

	it("should filter available rewards", () => {
		const { getAvailableRewards } = useRewards()

		const rewards = getAvailableRewards()

		expect(Array.isArray(rewards)).toBe(true)
	})

	it("should filter pending rewards", () => {
		const { getPendingRewards } = useRewards()

		const rewards = getPendingRewards()

		expect(Array.isArray(rewards)).toBe(true)
	})

	it("should filter redeemed rewards", () => {
		const { getRedeemedRewards } = useRewards()

		const rewards = getRedeemedRewards()

		expect(Array.isArray(rewards)).toBe(true)
	})

	it("should filter expired rewards", () => {
		const { getExpiredRewards } = useRewards()

		const rewards = getExpiredRewards()

		expect(Array.isArray(rewards)).toBe(true)
	})

	it("should calculate total rewards", () => {
		const { getTotalRewards } = useRewards()

		const total = getTotalRewards()

		expect(typeof total).toBe("number")
	})

	it("should calculate available rewards total", () => {
		const { getAvailableRewardsTotal } = useRewards()

		const total = getAvailableRewardsTotal()

		expect(typeof total).toBe("number")
	})
})
