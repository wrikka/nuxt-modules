import type { POSSession } from "#shared/types";
export declare function useReceiptPrinting(): {
    printing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    printReceipt: (session: POSSession) => Promise<{
        success: boolean;
    }>;
    generateReceiptData: (session: POSSession) => {
        sessionId: any;
        items: any;
        subtotal: any;
        tax: any;
        discount: any;
        total: any;
        paymentMethod: any;
        paymentReference: any;
        customer: any;
        staff: any;
        register: any;
        createdAt: any;
        completedAt: any;
    };
};
//# sourceMappingURL=useReceiptPrinting.d.ts.map