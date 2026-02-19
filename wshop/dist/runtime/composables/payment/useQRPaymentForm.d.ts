import type { QRCodePayment } from "#shared/types";
export interface QRPaymentFormData {
    selectedProvider: "promptpay" | "truewallet" | "linepay";
    qrPayment: QRCodePayment | null;
    timeRemaining: string;
}
export declare const useQRPaymentForm: () => {
    selectedProvider: any;
    qrPayment: any;
    timeRemaining: any;
    statusCheckInterval: any;
    providers: {
        id: string;
        name: string;
        icon: string;
    }[];
    setSelectedProvider: (provider: "promptpay" | "truewallet" | "linepay") => void;
    setQRPayment: (payment: QRCodePayment | null) => void;
    setStatusCheckInterval: (interval: NodeJS.Timeout | null) => void;
    resetForm: () => void;
    getFormData: () => QRPaymentFormData;
    formatTimeRemaining: (expiresAt: Date) => string;
};
//# sourceMappingURL=useQRPaymentForm.d.ts.map