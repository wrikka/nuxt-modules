import { z } from "zod";
export declare const LoyaltyProgramSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    pointsPerCurrency: z.ZodNumber;
    currencyPerPoint: z.ZodNumber;
    minimumPoints: z.ZodNumber;
    isActive: z.ZodBoolean;
    tiers: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        minPoints: z.ZodNumber;
        benefits: z.ZodArray<z.ZodString, "many">;
        color: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        name: string;
        color: string;
        minPoints: number;
        benefits: string[];
    }, {
        id: number;
        name: string;
        color: string;
        minPoints: number;
        benefits: string[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    isActive: boolean;
    pointsPerCurrency: number;
    currencyPerPoint: number;
    minimumPoints: number;
    tiers: {
        id: number;
        name: string;
        color: string;
        minPoints: number;
        benefits: string[];
    }[];
}, {
    id: number;
    name: string;
    isActive: boolean;
    pointsPerCurrency: number;
    currencyPerPoint: number;
    minimumPoints: number;
    tiers: {
        id: number;
        name: string;
        color: string;
        minPoints: number;
        benefits: string[];
    }[];
}>;
export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;
export declare const LoyaltyTransactionSchema: z.ZodObject<{
    id: z.ZodNumber;
    customerId: z.ZodNumber;
    orderId: z.ZodNullable<z.ZodNumber>;
    type: z.ZodEnum<["earned", "redeemed", "expired", "adjusted"]>;
    points: z.ZodNumber;
    description: z.ZodString;
    balance: z.ZodNumber;
    createdAt: z.ZodString;
    expiresAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    description: string;
    type: "expired" | "earned" | "redeemed" | "adjusted";
    createdAt: string;
    expiresAt: string | null;
    customerId: number;
    orderId: number | null;
    points: number;
    balance: number;
}, {
    id: number;
    description: string;
    type: "expired" | "earned" | "redeemed" | "adjusted";
    createdAt: string;
    expiresAt: string | null;
    customerId: number;
    orderId: number | null;
    points: number;
    balance: number;
}>;
export type LoyaltyTransaction = z.infer<typeof LoyaltyTransactionSchema>;
export declare const CustomerLoyaltySchema: z.ZodObject<{
    customerId: z.ZodNumber;
    programId: z.ZodNumber;
    currentPoints: z.ZodNumber;
    tierId: z.ZodNumber;
    totalEarned: z.ZodNumber;
    totalRedeemed: z.ZodNumber;
    joinDate: z.ZodString;
    lastActivity: z.ZodString;
}, "strip", z.ZodTypeAny, {
    customerId: number;
    programId: number;
    currentPoints: number;
    tierId: number;
    totalEarned: number;
    totalRedeemed: number;
    joinDate: string;
    lastActivity: string;
}, {
    customerId: number;
    programId: number;
    currentPoints: number;
    tierId: number;
    totalEarned: number;
    totalRedeemed: number;
    joinDate: string;
    lastActivity: string;
}>;
export type CustomerLoyalty = z.infer<typeof CustomerLoyaltySchema>;
export declare const LoyaltyTierSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    minPoints: z.ZodNumber;
    benefits: z.ZodArray<z.ZodString, "many">;
    color: z.ZodString;
    isCurrent: z.ZodOptional<z.ZodBoolean>;
    description: z.ZodOptional<z.ZodString>;
    pointsMultiplier: z.ZodOptional<z.ZodNumber>;
    discount: z.ZodOptional<z.ZodNumber>;
    pointsPerBaht: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    color: string;
    minPoints: number;
    benefits: string[];
    description?: string | undefined;
    discount?: number | undefined;
    isCurrent?: boolean | undefined;
    pointsMultiplier?: number | undefined;
    pointsPerBaht?: number | undefined;
}, {
    id: number;
    name: string;
    color: string;
    minPoints: number;
    benefits: string[];
    description?: string | undefined;
    discount?: number | undefined;
    isCurrent?: boolean | undefined;
    pointsMultiplier?: number | undefined;
    pointsPerBaht?: number | undefined;
}>;
export type LoyaltyTier = z.infer<typeof LoyaltyTierSchema>;
export declare const LoyaltyMemberSchema: z.ZodObject<{
    id: z.ZodNumber;
    customerId: z.ZodNumber;
    programId: z.ZodNumber;
    tierId: z.ZodNumber;
    status: z.ZodEnum<["active", "inactive", "suspended"]>;
    currentPoints: z.ZodNumber;
    totalEarned: z.ZodNumber;
    totalRedeemed: z.ZodNumber;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    joinDate: z.ZodString;
    lastActivity: z.ZodString;
    recentTransactions: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        type: z.ZodEnum<["earned", "redeemed", "expired", "adjusted"]>;
        points: z.ZodNumber;
        description: z.ZodString;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        description: string;
        type: "expired" | "earned" | "redeemed" | "adjusted";
        createdAt: string;
        points: number;
    }, {
        id: number;
        description: string;
        type: "expired" | "earned" | "redeemed" | "adjusted";
        createdAt: string;
        points: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "active" | "inactive" | "suspended";
    id: number;
    name: string;
    email: string;
    phone: string;
    customerId: number;
    programId: number;
    currentPoints: number;
    tierId: number;
    totalEarned: number;
    totalRedeemed: number;
    joinDate: string;
    lastActivity: string;
    recentTransactions: {
        id: number;
        description: string;
        type: "expired" | "earned" | "redeemed" | "adjusted";
        createdAt: string;
        points: number;
    }[];
}, {
    status: "active" | "inactive" | "suspended";
    id: number;
    name: string;
    email: string;
    phone: string;
    customerId: number;
    programId: number;
    currentPoints: number;
    tierId: number;
    totalEarned: number;
    totalRedeemed: number;
    joinDate: string;
    lastActivity: string;
    recentTransactions: {
        id: number;
        description: string;
        type: "expired" | "earned" | "redeemed" | "adjusted";
        createdAt: string;
        points: number;
    }[];
}>;
export type LoyaltyMember = z.infer<typeof LoyaltyMemberSchema>;
//# sourceMappingURL=loyalty.d.ts.map