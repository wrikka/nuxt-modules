export declare function usePosPayment(cart: any, subtotal: any, tax: any, discount: any, total: any, selectedCustomer: any, selectedRegister: any, products: any): {
    processing: any;
    error: any;
    processPayment: (paymentDetails: {
        amount: number;
        method: string;
        reference?: string;
    }) => Promise<any>;
};
//# sourceMappingURL=usePosPayment.d.ts.map