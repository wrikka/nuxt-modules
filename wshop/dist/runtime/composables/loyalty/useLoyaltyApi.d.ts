import type { LoyaltyMember, LoyaltyTier } from "#shared/types";
export declare const useLoyaltyApi: () => {
    loading: any;
    processing: any;
    loadMembers: () => Promise<LoyaltyMember[]>;
    loadLoyaltyTiers: () => Promise<LoyaltyTier[]>;
    createMember: (member: Partial<LoyaltyMember>) => Promise<LoyaltyMember>;
    updateMember: (id: number, member: Partial<LoyaltyMember>) => Promise<LoyaltyMember>;
    deleteMemberApi: (id: number) => Promise<void>;
    suspendMemberApi: (id: number) => Promise<LoyaltyMember>;
    adjustMemberPoints: (id: number, adjustment: {
        points: number;
        reason: string;
    }) => Promise<LoyaltyMember>;
    loadProgramStats: () => Promise<any>;
};
//# sourceMappingURL=useLoyaltyApi.d.ts.map