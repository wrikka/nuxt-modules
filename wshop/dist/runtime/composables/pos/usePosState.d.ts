export declare function usePosState(): {
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
    selectedCustomer: any;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
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
    selectedRegister: import("vue").Ref<number | null, number | null>;
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
    selectedPaymentMethod: import("vue").Ref<string | null, string | null>;
    discount: import("vue").Ref<number, number>;
    tax: import("vue").ComputedRef<number>;
};
//# sourceMappingURL=usePosState.d.ts.map