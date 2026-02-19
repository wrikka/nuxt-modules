import type { Customer } from "#shared/types";
export declare function usePointOfSale(): {
    categories: import("vue").Ref<{
        id: number;
        name: string;
    }[], {
        id: number;
        name: string;
    }[] | {
        id: number;
        name: string;
    }[]>;
    products: import("vue").Ref<any, any>;
    customers: import("vue").Ref<any, any>;
    registers: import("vue").Ref<{
        id: number;
        name: string;
    }[], {
        id: number;
        name: string;
    }[] | {
        id: number;
        name: string;
    }[]>;
    paymentMethods: import("vue").Ref<{
        id: string;
        name: string;
    }[], {
        id: string;
        name: string;
    }[] | {
        id: string;
        name: string;
    }[]>;
    selectedCustomer: any;
    selectedRegister: import("vue").Ref<number | null, number | null>;
    selectedPaymentMethod: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentUser: any;
    cartItems: any;
    subtotal: any;
    discount: import("vue").Ref<number, number>;
    tax: import("vue").ComputedRef<number>;
    total: any;
    addToCart: (product: Customer, variant: Customer) => void;
    updateQuantity: (itemId: string, newQuantity: number) => any;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    selectCustomer: (customer: Customer) => void;
    processPayment: (paymentDetails: {
        amount: number;
        method: string;
        reference?: string;
    }) => Promise<any>;
    suspendSale: () => Promise<void>;
    resumeSuspendedSale: (sessionId: string) => Promise<void>;
    endShift: () => Promise<void>;
    openRegister: (registerId: string) => Promise<void>;
    getSalesHistory: (startDate?: string, endDate?: string) => Promise<any>;
    loadCategories: () => Promise<void>;
    loadProducts: () => Promise<void>;
    loadRegisters: () => Promise<void>;
    addNotification: any;
};
//# sourceMappingURL=usePointOfSale.d.ts.map