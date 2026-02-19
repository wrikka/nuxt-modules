import type { LoyaltyPoint, Membership } from "#shared/types";
export declare const useMembership: () => {
    memberships: Readonly<import("vue").Ref<any, any>>;
    loyaltyPoints: Readonly<import("vue").Ref<any, any>>;
    membershipTiers: Readonly<import("vue").Ref<any, any>>;
    pointRedemptions: Readonly<import("vue").Ref<any, any>>;
    membershipRewards: Readonly<import("vue").Ref<any, any>>;
    loading: Readonly<import("vue").Ref<boolean, boolean>>;
    error: Readonly<import("vue").Ref<string | null, string | null>>;
    loadCustomerMembership: (customerId: string) => Promise<any>;
    createMembership: (membership: {
        customerId: string;
        tier: Membership["tier"];
    }) => Promise<any>;
    addLoyaltyPoints: (points: {
        customerId: string;
        orderId: string;
        points: number;
        description: string;
    }) => Promise<any>;
    redeemPoints: (redemption: {
        customerId: string;
        pointsUsed: number;
        reward: string;
        value: number;
    }) => Promise<any>;
    loadLoyaltyPoints: (customerId: string, filters?: {
        type?: LoyaltyPoint["type"];
        startDate?: Date;
        endDate?: Date;
    }) => Promise<any>;
    loadMembershipTiers: () => Promise<any>;
    loadMembershipRewards: (tier?: Membership["tier"]) => Promise<any>;
    upgradeMembershipTier: (customerId: string) => Promise<any>;
    getMembershipStatistics: () => Promise<any>;
};
//# sourceMappingURL=useMembership.d.ts.map