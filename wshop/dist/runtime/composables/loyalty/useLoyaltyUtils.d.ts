import type { LoyaltyTier } from "#shared/types";
export declare const useLoyaltyUtils: () => {
    defaultTiers: LoyaltyTier[];
    getTierBadgeClass: (tierId: number, tiers?: LoyaltyTier[]) => string;
    getTierName: (tierId: number, tiers?: LoyaltyTier[]) => string;
    getStatusClass: (status: string) => string;
    getStatusText: (status: string) => string;
    getTierByPoints: (points: number, tiers?: LoyaltyTier[]) => LoyaltyTier | null;
    getNextTier: (currentTierId: number, tiers?: LoyaltyTier[]) => LoyaltyTier | null;
    getPointsToNextTier: (currentPoints: number, currentTierId: number, tiers?: LoyaltyTier[]) => number;
};
//# sourceMappingURL=useLoyaltyUtils.d.ts.map