export declare const useReceiptUtils: () => {
    formatDate: (dateString?: string) => string;
    getPaymentMethodName: (method: string) => string;
    printReceipt: (receiptElementId?: string) => void;
    emailReceipt: (customerEmail?: string, customerName?: string) => Promise<boolean>;
};
//# sourceMappingURL=useReceiptUtils.d.ts.map