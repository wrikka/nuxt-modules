export declare const useGiftCardManager: (refreshCart: () => Promise<void>) => {
    applyGiftCard: (code: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    removeGiftCard: () => Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=useGiftCardManager.d.ts.map