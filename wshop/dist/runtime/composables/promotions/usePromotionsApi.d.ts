import type { Promotion } from "#shared/types";
export declare function usePromotionsApi(): {
    fetchPromotions: () => Promise<any>;
    createPromotion: (promotionData: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "usageCount">) => Promise<any>;
    updatePromotion: (id: number, updates: Partial<Promotion>) => Promise<any>;
    deletePromotion: (id: number) => Promise<void>;
};
//# sourceMappingURL=usePromotionsApi.d.ts.map