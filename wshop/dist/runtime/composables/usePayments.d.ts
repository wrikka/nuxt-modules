export interface PaymentProvider {
    id: string;
    name: string;
    connected: boolean;
    description: string;
}
export declare const usePayments: () => {
    providers: import("vue").Ref<{
        id: string;
        name: string;
        connected: boolean;
        description: string;
    }[], PaymentProvider[] | {
        id: string;
        name: string;
        connected: boolean;
        description: string;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    fetchProviders: () => Promise<void>;
};
//# sourceMappingURL=usePayments.d.ts.map