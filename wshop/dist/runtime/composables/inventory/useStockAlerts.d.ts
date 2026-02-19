import type { StockAlert } from "#shared/types";
export declare const useStockAlerts: () => {
    stockAlerts: any;
    loading: any;
    error: any;
    loadStockAlerts: () => Promise<void>;
    getLowStockProducts: () => Promise<StockAlert[]>;
    markAlertAsRead: (alertId: string) => Promise<void>;
    clearError: () => void;
};
//# sourceMappingURL=useStockAlerts.d.ts.map