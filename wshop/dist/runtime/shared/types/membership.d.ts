import { z } from "zod";
export declare const MembershipSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    tier: z.ZodEnum<["bronze", "silver", "gold", "platinum"]>;
    points: z.ZodNumber;
    totalSpent: z.ZodNumber;
    joinDate: z.ZodDate;
    lastActivity: z.ZodDate;
    benefits: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["active", "inactive", "suspended"]>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "inactive" | "suspended";
    id: string;
    customerId: string;
    benefits: string[];
    joinDate: Date;
    lastActivity: Date;
    points: number;
    tier: "bronze" | "silver" | "gold" | "platinum";
    totalSpent: number;
}, {
    status: "active" | "inactive" | "suspended";
    id: string;
    customerId: string;
    benefits: string[];
    joinDate: Date;
    lastActivity: Date;
    points: number;
    tier: "bronze" | "silver" | "gold" | "platinum";
    totalSpent: number;
}>;
export type Membership = z.infer<typeof MembershipSchema>;
export declare const LoyaltyPointSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    orderId: z.ZodString;
    points: z.ZodNumber;
    type: z.ZodEnum<["earned", "redeemed", "expired"]>;
    description: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string;
    type: "expired" | "earned" | "redeemed";
    createdAt: Date;
    customerId: string;
    orderId: string;
    points: number;
    expiresAt?: Date | undefined;
}, {
    id: string;
    description: string;
    type: "expired" | "earned" | "redeemed";
    createdAt: Date;
    customerId: string;
    orderId: string;
    points: number;
    expiresAt?: Date | undefined;
}>;
export type LoyaltyPoint = z.infer<typeof LoyaltyPointSchema>;
export declare const MembershipTierSchema: z.ZodObject<{
    tier: z.ZodEnum<["bronze", "silver", "gold", "platinum"]>;
    name: z.ZodString;
    minSpent: z.ZodNumber;
    minPoints: z.ZodNumber;
    pointMultiplier: z.ZodNumber;
    discountRate: z.ZodNumber;
    benefits: z.ZodArray<z.ZodString, "many">;
    color: z.ZodString;
    icon: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    icon: string;
    color: string;
    minPoints: number;
    benefits: string[];
    tier: "bronze" | "silver" | "gold" | "platinum";
    minSpent: number;
    pointMultiplier: number;
    discountRate: number;
}, {
    name: string;
    icon: string;
    color: string;
    minPoints: number;
    benefits: string[];
    tier: "bronze" | "silver" | "gold" | "platinum";
    minSpent: number;
    pointMultiplier: number;
    discountRate: number;
}>;
export type MembershipTier = z.infer<typeof MembershipTierSchema>;
export declare const PointRedemptionSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    pointsUsed: z.ZodNumber;
    reward: z.ZodString;
    value: z.ZodNumber;
    status: z.ZodEnum<["pending", "approved", "redeemed", "expired"]>;
    createdAt: z.ZodDate;
    redeemedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "expired" | "approved" | "redeemed";
    id: string;
    createdAt: Date;
    value: number;
    customerId: string;
    pointsUsed: number;
    reward: string;
    redeemedAt?: Date | undefined;
}, {
    status: "pending" | "expired" | "approved" | "redeemed";
    id: string;
    createdAt: Date;
    value: number;
    customerId: string;
    pointsUsed: number;
    reward: string;
    redeemedAt?: Date | undefined;
}>;
export type PointRedemption = z.infer<typeof PointRedemptionSchema>;
export declare const MembershipRewardSchema: z.ZodObject<{
    id: z.ZodString;
    tier: z.ZodEnum<["bronze", "silver", "gold", "platinum"]>;
    type: z.ZodEnum<["discount", "free_item", "points_bonus", "exclusive"]>;
    title: z.ZodString;
    description: z.ZodString;
    pointsRequired: z.ZodNumber;
    value: z.ZodNumber;
    validUntil: z.ZodOptional<z.ZodDate>;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string;
    type: "discount" | "free_item" | "points_bonus" | "exclusive";
    title: string;
    value: number;
    isActive: boolean;
    tier: "bronze" | "silver" | "gold" | "platinum";
    pointsRequired: number;
    validUntil?: Date | undefined;
}, {
    id: string;
    description: string;
    type: "discount" | "free_item" | "points_bonus" | "exclusive";
    title: string;
    value: number;
    isActive: boolean;
    tier: "bronze" | "silver" | "gold" | "platinum";
    pointsRequired: number;
    validUntil?: Date | undefined;
}>;
export type MembershipReward = z.infer<typeof MembershipRewardSchema>;
//# sourceMappingURL=membership.d.ts.map