import type { ProcessSaleData, SalesHistoryParams, SuspendSaleData } from "#shared/types";
export declare function usePointOfSaleApi(): {
    fetchRegisters: () => Promise<any>;
    fetchCategories: () => Promise<any>;
    fetchProducts: () => Promise<any>;
    fetchCustomers: () => Promise<any>;
    updateVariantStock: (variantId: string, newStock: number) => Promise<any>;
    processSale: (saleData: ProcessSaleData) => Promise<any>;
    suspendSale: (saleData: SuspendSaleData) => Promise<any>;
    fetchSuspendedSales: () => Promise<any>;
    fetchSuspendedSale: (sessionId: string) => Promise<any>;
    closeRegister: (registerId: string) => Promise<any>;
    openRegister: (registerId: string, staffId: string) => Promise<any>;
    fetchSalesHistory: (params: SalesHistoryParams) => Promise<any>;
};
//# sourceMappingURL=usePointOfSaleApi.d.ts.map