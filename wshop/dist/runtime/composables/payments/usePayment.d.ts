export declare const usePayment: () => {
    paymentMethods: Readonly<import("vue").Ref<any, any>>;
    currentTransaction: any;
    qrPayments: Readonly<import("vue").Ref<any, any>>;
    loading: Readonly<import("vue").Ref<boolean, boolean>>;
    error: Readonly<import("vue").Ref<string | null, string | null>>;
    loadPaymentMethods: () => Promise<any>;
    processCashPayment: (payment: {
        amount: number;
        cashReceived: number;
        orderId: string;
    }) => Promise<any>;
    processCardPayment: (payment: {
        amount: number;
        cardNumber: string;
        expiryMonth: string;
        expiryYear: string;
        cvv: string;
        orderId: string;
    }) => Promise<any>;
    generateQRPayment: (payment: {
        amount: number;
        provider: "promptpay" | "truewallet" | "linepay";
        orderId: string;
    }) => Promise<any>;
    checkQRPaymentStatus: (qrId: string) => Promise<any>;
    processBankTransfer: (payment: {
        amount: number;
        bankName: string;
        accountNumber: string;
        accountName: string;
        transferTime: Date;
        slipImage?: string;
        orderId: string;
    }) => Promise<any>;
    refundPayment: (transactionId: string, amount?: number) => Promise<any>;
    getPaymentHistory: (filters?: {
        startDate?: Date;
        endDate?: Date;
        method?: string;
        status?: string;
    } | undefined) => Promise<any>;
    startQRStatusCheck: (qrId: string, interval?: number) => void;
};
//# sourceMappingURL=usePayment.d.ts.map