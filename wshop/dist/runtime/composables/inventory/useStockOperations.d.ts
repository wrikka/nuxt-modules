import type { StockAdjustment, StockCount, StockMovement } from "#shared/types";
export declare const useStockOperations: () => {
    loading: any;
    error: any;
    loadStockMovements: (filters?: {
        productId?: string;
        type?: StockMovement["type"];
        startDate?: Date;
        endDate?: Date;
    }) => Promise<StockMovement[]>;
    createStockMovement: (movement: {
        productId: string;
        type: StockMovement["type"];
        quantity: number;
        reason: string;
        reference?: string;
    }) => Promise<StockMovement>;
    createStockAdjustment: (adjustment: {
        productId: string;
        newStock: number;
        reason: StockAdjustment["reason"];
        description: string;
    }) => Promise<StockAdjustment>;
    createStockCount: (count: {
        productId: string;
        countedStock: number;
    }) => Promise<StockCount>;
    updateProductStock: (productId: string, quantity: number, type: StockMovement["type"]) => Promise<void>;
    clearError: () => void;
};
//# sourceMappingURL=useStockOperations.d.ts.map