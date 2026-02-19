import type { Promotion } from "#shared/types";
export declare const usePromotionForm: (createPromotion: (data: any) => Promise<any>, updatePromotion: (id: number, data: any) => Promise<any>) => {
    showPromotionForm: any;
    editingPromotion: any;
    promotionForm: any;
    editPromotion: (promotion: Promotion) => void;
    savePromotion: () => Promise<void>;
    closePromotionForm: () => void;
};
//# sourceMappingURL=usePromotionForm.d.ts.map