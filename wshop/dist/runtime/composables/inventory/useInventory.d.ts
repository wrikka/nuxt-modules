import type { Inventory } from "#shared/types";
import { type Ref } from "vue";
export declare function useInventory(): {
    inventory: Ref<any, any>;
    products: Ref<any, any>;
    stockMovements: Ref<any, any>;
    stockAlerts: Ref<any, any>;
    loading: Ref<boolean, boolean>;
    processing: Ref<boolean, boolean>;
    error: Ref<string | null, string | null>;
    totalProducts: import("vue").ComputedRef<any>;
    inStockCount: import("vue").ComputedRef<any>;
    lowStockCount: import("vue").ComputedRef<any>;
    outOfStockCount: import("vue").ComputedRef<any>;
    lowStockItems: import("vue").ComputedRef<any>;
    outOfStockItems: import("vue").ComputedRef<any>;
    loadInventory: () => Promise<void>;
    loadProducts: () => Promise<void>;
    loadStockMovements: (productId?: number) => Promise<void>;
    loadStockAlerts: () => Promise<void>;
    adjustStock: (adjustment: {
        productId: string;
        type: "in" | "out" | "adjustment";
        quantity: number;
        reason: string;
    }) => Promise<void>;
    updateInventoryItem: (id: number, updates: Partial<Inventory>) => Promise<void>;
    bulkUpdateInventory: (updates: Array<{
        id: number;
        updates: Partial<Inventory>;
    }>) => Promise<void>;
    exportInventory: (format?: "csv" | "excel") => Promise<any>;
    markAlertAsRead: (alertId: number) => Promise<any>;
    dismissAlert: (alertId: number) => Promise<any>;
    subscribeToInventoryUpdates: () => () => void;
    getInventoryByProductId: (productId: string) => any;
    getStockStatus: (productId: string) => "unknown" | "out_of_stock" | "low_stock" | "in_stock";
    calculateInventoryValue: () => any;
    getTopMovingProducts: (limit?: number) => any;
};
//# sourceMappingURL=useInventory.d.ts.map