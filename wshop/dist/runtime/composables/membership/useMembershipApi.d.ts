import type { LoyaltyPoint, Membership } from "#shared/types";
export declare function useMembershipApi(): {
    fetchCustomerMembership: (customerId: string) => Promise<any>;
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
    fetchLoyaltyPoints: (customerId: string, filters?: {
        type?: LoyaltyPoint["type"];
        startDate?: Date;
        endDate?: Date;
    }) => Promise<any>;
    fetchMembershipTiers: () => Promise<any>;
    fetchMembershipRewards: (tier?: Membership["tier"]) => Promise<any>;
    upgradeMembershipTier: (customerId: string) => Promise<any>;
    fetchMembershipStatistics: () => Promise<any>;
};
//# sourceMappingURL=useMembershipApi.d.ts.map