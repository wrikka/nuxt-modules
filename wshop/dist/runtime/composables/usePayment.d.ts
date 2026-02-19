import type { CardPayment, CashPayment } from "~~/shared/types";
export declare function usePayment(): {
    processing: any;
    error: any;
    processCardPayment: (payment: CardPayment) => Promise<any>;
    processCashPayment: (payment: CashPayment) => Promise<any>;
    generateQRPayment: (amount: number, provider: "promptpay" | "truewallet" | "linepay") => Promise<QRCodePayment>;
    checkQRPaymentStatus: (paymentId: string) => Promise<string | {
        success?: boolean;
        data?: {
            status?: string;
        } | string;
    } | {
        status?: string;
    }>;
    startQRStatusCheck: (paymentId: string, callback: (status: string) => void) => NodeJS.Timeout;
};
//# sourceMappingURL=usePayment.d.ts.map