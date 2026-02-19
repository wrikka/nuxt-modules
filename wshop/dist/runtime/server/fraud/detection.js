import { z } from "zod";
export const FraudCheckResultSchema = z.object({
  riskScore: z.number(),
  riskLevel: z.enum(["low", "medium", "high"]),
  reasons: z.array(z.string()),
  shouldBlock: z.boolean()
});
export async function analyzeOrder(order) {
  const reasons = [];
  let riskScore = 0;
  if (order.total > 1e4) {
    riskScore += 20;
    reasons.push("High value order");
  }
  if (order.shippingAddress?.country !== order.customer?.country) {
    riskScore += 15;
    reasons.push("International shipping to different country");
  }
  if (order.paymentAttempts > 3) {
    riskScore += 30;
    reasons.push("Multiple failed payment attempts");
  }
  if (isSuspiciousEmail(order.customer?.email)) {
    riskScore += 25;
    reasons.push("Suspicious email pattern");
  }
  if (order.customer?.isFirstTime && order.total > 5e3) {
    riskScore += 15;
    reasons.push("First-time customer with high value order");
  }
  if (order.orderCountInLastHour > 5) {
    riskScore += 35;
    reasons.push("Rapid multiple orders");
  }
  let riskLevel = "low";
  if (riskScore >= 50) riskLevel = "high";
  else if (riskScore >= 30) riskLevel = "medium";
  return {
    riskScore,
    riskLevel,
    reasons,
    shouldBlock: riskLevel === "high"
  };
}
function isSuspiciousEmail(email) {
  if (!email) return false;
  const suspiciousPatterns = [
    /^[a-z]+[0-9]+@/,
    // Simple pattern with numbers
    /@temp\./,
    // Temporary email
    /@10minutemail/,
    // Disposable email
    /@guerrillamail/
    // Disposable email
  ];
  return suspiciousPatterns.some((pattern) => pattern.test(email));
}
import { db } from "~~/server/db";
import { fraudAlerts } from "~~/server/db/schemas";
export async function createFraudAlert(order, result) {
  try {
    await db.insert(fraudAlerts).values({
      orderId: order.id,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      reasons: result.reasons
    });
    console.log(`Fraud alert created for order ${order.id}`);
  } catch (error) {
    console.error("Failed to create fraud alert:", error);
  }
}
