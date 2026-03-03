// d:/wshop/server/fraud/detection.ts

import { z } from "zod"
import type { Order } from "~/shared/types"

export const FraudCheckResultSchema = z.object({
	riskScore: z.number(),
	riskLevel: z.enum(["low", "medium", "high"]),
	reasons: z.array(z.string()),
	shouldBlock: z.boolean(),
})
export type FraudCheckResult = z.infer<typeof FraudCheckResultSchema>

export async function analyzeOrder(order: Order): Promise<FraudCheckResult> {
	const reasons: string[] = []
	let riskScore = 0

	// Check 1: High value orders
	if (order.total > 10000) {
		riskScore += 20
		reasons.push("High value order")
	}

	// Check 2: Unusual shipping address
	if (order.shippingAddress?.country !== order.customer?.country) {
		riskScore += 15
		reasons.push("International shipping to different country")
	}

	// Check 3: Multiple failed payment attempts
	if (order.paymentAttempts > 3) {
		riskScore += 30
		reasons.push("Multiple failed payment attempts")
	}

	// Check 4: Suspicious email patterns
	if (isSuspiciousEmail(order.customer?.email)) {
		riskScore += 25
		reasons.push("Suspicious email pattern")
	}

	// Check 5: First-time customer with high value
	if (order.customer?.isFirstTime && order.total > 5000) {
		riskScore += 15
		reasons.push("First-time customer with high value order")
	}

	// Check 6: Rapid multiple orders
	if (order.orderCountInLastHour > 5) {
		riskScore += 35
		reasons.push("Rapid multiple orders")
	}

	// Determine risk level
	let riskLevel: "low" | "medium" | "high" = "low"
	if (riskScore >= 50) riskLevel = "high"
	else if (riskScore >= 30) riskLevel = "medium"

	return {
		riskScore,
		riskLevel,
		reasons,
		shouldBlock: riskLevel === "high",
	}
}

function isSuspiciousEmail(email: string): boolean {
	if (!email) return false

	const suspiciousPatterns = [
		/^[a-z]+[0-9]+@/, // Simple pattern with numbers
		/@temp\./, // Temporary email
		/@10minutemail/, // Disposable email
		/@guerrillamail/, // Disposable email
	]

	return suspiciousPatterns.some(pattern => pattern.test(email))
}

import { db } from "~~/server/db"
import { fraudAlerts } from "~~/server/db/schemas"

export async function createFraudAlert(order: Order, result: FraudCheckResult) {
	try {
		await db.insert(fraudAlerts).values({
			orderId: order.id,
			riskScore: result.riskScore,
			riskLevel: result.riskLevel,
			reasons: result.reasons,
		})
		console.log(`Fraud alert created for order ${order.id}`)

		// TODO: Send notification to admin (e.g., via email or webhook)
	} catch (error) {
		console.error("Failed to create fraud alert:", error)
	}
}
