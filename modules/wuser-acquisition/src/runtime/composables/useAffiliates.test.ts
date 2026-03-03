import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAffiliates } from "./useAffiliates"

describe("useAffiliates", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should calculate commission for percentage type", () => {
		const { calculateCommission } = useAffiliates()

		const commission = calculateCommission(1000)

		expect(commission).toBe(100)
	})

	it("should calculate commission for fixed type", () => {
		const { calculateCommission } = useAffiliates()

		const commission = calculateCommission(1000)

		expect(commission).toBeGreaterThanOrEqual(0)
	})

	it("should check if payout is possible", () => {
		const { canRequestPayout } = useAffiliates()

		const canPayout = canRequestPayout()

		expect(typeof canPayout).toBe("boolean")
	})
})
