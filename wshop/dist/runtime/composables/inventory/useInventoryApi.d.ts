import type { Inventory } from "#shared/types";
export declare function useInventoryApi(): {
    fetchInventory: () => Promise<any>;
    fetchProducts: () => Promise<any>;
    fetchStockMovements: (productId?: number) => Promise<any>;
    fetchStockAlerts: () => Promise<any>;
    adjustStock: (adjustment: {
        productId: string;
        type: "in" | "out" | "adjustment";
        quantity: number;
        reason: string;
    }) => Promise<any>;
    updateInventoryItem: (id: number, updates: Partial<Inventory>) => Promise<any>;
    bulkUpdateInventory: (updates: Array<{
        id: number;
        updates: Partial<Inventory>;
    }>) => Promise<any>;
    exportInventory: (format?: "csv" | "excel") => Promise<any>;
    markAlertAsRead: (alertId: number) => Promise<any>;
    dismissAlert: (alertId: number) => Promise<any>;
};
//# sourceMappingURL=useInventoryApi.d.ts.map