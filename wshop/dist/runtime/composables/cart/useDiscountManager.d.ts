export declare const useDiscountManager: (refreshCart: () => Promise<void>) => {
    applyDiscount: (code: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    removeDiscount: () => Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=useDiscountManager.d.ts.map