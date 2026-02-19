import type { StockTransfer } from "#shared/types";
export declare const useStockTransfers: () => {
    loading: any;
    error: any;
    createStockTransfer: (transfer: {
        productId: string;
        fromStoreId: string;
        toStoreId: string;
        quantity: number;
    }) => Promise<StockTransfer>;
    approveStockTransfer: (transferId: string) => Promise<StockTransfer>;
    receiveStockTransfer: (transferId: string) => Promise<StockTransfer>;
    clearError: () => void;
};
//# sourceMappingURL=useStockTransfers.d.ts.map