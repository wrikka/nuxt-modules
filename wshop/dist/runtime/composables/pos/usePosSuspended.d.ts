import type { Customer, Product } from "#shared/types";
export declare function usePosSuspended(cart: any, subtotal: any, total: any, selectedCustomer: any, products: Product[], customers: Customer[]): {
    error: any;
    suspendSale: () => Promise<void>;
    resumeSuspendedSale: (sessionId: string) => Promise<void>;
};
//# sourceMappingURL=usePosSuspended.d.ts.map