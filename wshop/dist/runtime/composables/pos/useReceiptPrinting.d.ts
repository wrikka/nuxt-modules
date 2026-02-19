import type { POSSession } from "../../../shared/types/pos.js";
export declare function useReceiptPrinting(): {
    loading: import("vue").ComputedRef<boolean>;
    error: import("vue").ComputedRef<string | null>;
    generateReceiptData: (session: POSSession) => POSSession;
    printReceipt: (elementId: string) => Promise<void>;
    generatePDFReceipt: (session: POSSession) => Promise<any>;
    generateImageReceipt: (elementId: string) => Promise<any>;
    generateTaxInvoice: any;
    emailReceipt: (session: POSSession, customerEmail: string) => Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=useReceiptPrinting.d.ts.map