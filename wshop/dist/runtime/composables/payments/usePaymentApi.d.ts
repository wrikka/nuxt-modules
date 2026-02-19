export declare function usePaymentApi(): {
    fetchPaymentMethods: () => Promise<any>;
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
    fetchPaymentHistory: (filters?: {
        startDate?: Date;
        endDate?: Date;
        method?: string;
        status?: string;
    }) => Promise<any>;
};
//# sourceMappingURL=usePaymentApi.d.ts.map