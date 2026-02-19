import type { Inventory, StockAlert, StockMovement } from "#shared/types";
export declare function useInventorySocket(inventory: Ref<Inventory[]>, stockMovements: Ref<StockMovement[]>, stockAlerts: Ref<StockAlert[]>): {
    connect: () => void;
    disconnect: () => void;
};
//# sourceMappingURL=useInventorySocket.d.ts.map