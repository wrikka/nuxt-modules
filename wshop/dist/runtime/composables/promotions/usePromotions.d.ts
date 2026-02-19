import type { CartItem } from "../../../shared/types/cart.js";
import type { Promotion } from "../../../shared/types/promotion.js";
export declare function usePromotions(): {
    promotions: import("vue").Ref<any, any>;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    activePromotions: import("vue").ComputedRef<any>;
    scheduledPromotions: import("vue").ComputedRef<any>;
    expiredPromotions: import("vue").ComputedRef<any>;
    loadPromotions: () => Promise<void>;
    createPromotion: (data: Omit<Promotion, "id" | "createdAt" | "updatedAt" | "usageCount">) => Promise<void>;
    updatePromotion: (id: number, updates: Partial<Promotion>) => Promise<void>;
    deletePromotion: (id: number) => Promise<void>;
    togglePromotionStatus: (id: number) => Promise<void>;
    duplicatePromotion: (id: number) => Promise<void>;
    applyPromotion: (promotionId: number, cartTotal: number, cartItems: CartItem[]) => Promise<import("./types.js").DiscountApplication>;
    getBestDiscount: (cartTotal: number, cartItems: CartItem[]) => import("./types.js").DiscountApplication;
    getPromotionById: (id: number) => any;
    getPromotionsByType: (type: string) => any;
    getPromotionsByStatus: (status: string) => any;
    searchPromotions: (query: string) => any;
    getPromotionStats: () => {
        total: any;
        active: any;
        scheduled: any;
        expired: any;
        totalUsage: any;
    };
    validatePromotionDates: (startDate: string, endDate: string) => "วันที่สิ้นสุดต้องมาหลังวันที่เริ่ม" | "วันที่เริ่มต้องไม่น้อยกว่าวันนี้" | null;
};
//# sourceMappingURL=usePromotions.d.ts.map