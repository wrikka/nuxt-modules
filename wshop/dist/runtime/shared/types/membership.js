import { z } from "zod";
export const MembershipSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  tier: z.enum(["bronze", "silver", "gold", "platinum"]),
  points: z.number(),
  totalSpent: z.number(),
  joinDate: z.date(),
  lastActivity: z.date(),
  benefits: z.array(z.string()),
  status: z.enum(["active", "inactive", "suspended"])
});
export const LoyaltyPointSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  orderId: z.string(),
  points: z.number(),
  type: z.enum(["earned", "redeemed", "expired"]),
  description: z.string(),
  expiresAt: z.date().optional(),
  createdAt: z.date()
});
export const MembershipTierSchema = z.object({
  tier: z.enum(["bronze", "silver", "gold", "platinum"]),
  name: z.string(),
  minSpent: z.number(),
  minPoints: z.number(),
  pointMultiplier: z.number(),
  discountRate: z.number(),
  benefits: z.array(z.string()),
  color: z.string(),
  icon: z.string()
});
export const PointRedemptionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  pointsUsed: z.number(),
  reward: z.string(),
  value: z.number(),
  status: z.enum(["pending", "approved", "redeemed", "expired"]),
  createdAt: z.date(),
  redeemedAt: z.date().optional()
});
export const MembershipRewardSchema = z.object({
  id: z.string(),
  tier: MembershipSchema.shape.tier,
  type: z.enum(["discount", "free_item", "points_bonus", "exclusive"]),
  title: z.string(),
  description: z.string(),
  pointsRequired: z.number(),
  value: z.number(),
  validUntil: z.date().optional(),
  isActive: z.boolean()
});
