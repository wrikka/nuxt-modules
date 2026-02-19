import { z } from "zod";
export declare const PaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["cash", "card", "qr", "transfer"]>;
    icon: z.ZodString;
    enabled: z.ZodBoolean;
    config: z.ZodOptional<z.ZodObject<{
        provider: z.ZodOptional<z.ZodString>;
        merchantId: z.ZodOptional<z.ZodString>;
        apiKey: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        provider?: string | undefined;
        merchantId?: string | undefined;
    }, {
        apiKey?: string | undefined;
        provider?: string | undefined;
        merchantId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: "transfer" | "cash" | "card" | "qr";
    icon: string;
    enabled: boolean;
    config?: {
        apiKey?: string | undefined;
        provider?: string | undefined;
        merchantId?: string | undefined;
    } | undefined;
}, {
    id: string;
    name: string;
    type: "transfer" | "cash" | "card" | "qr";
    icon: string;
    enabled: boolean;
    config?: {
        apiKey?: string | undefined;
        provider?: string | undefined;
        merchantId?: string | undefined;
    } | undefined;
}>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export declare const PaymentTransactionSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodEnum<["cash", "card", "qr", "transfer"]>;
    status: z.ZodEnum<["pending", "completed", "failed", "refunded"]>;
    reference: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "failed" | "completed" | "refunded";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    amount: number;
    method: "transfer" | "cash" | "card" | "qr";
    reference?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    status: "pending" | "failed" | "completed" | "refunded";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    amount: number;
    method: "transfer" | "cash" | "card" | "qr";
    reference?: string | undefined;
    metadata?: Record<string, any> | undefined;
}>;
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;
export declare const QRCodePaymentSchema: z.ZodObject<{
    id: z.ZodString;
    amount: z.ZodNumber;
    qrCode: z.ZodString;
    expiresAt: z.ZodDate;
    status: z.ZodEnum<["generated", "scanned", "paid", "expired"]>;
    provider: z.ZodEnum<["promptpay", "truewallet", "linepay"]>;
}, "strip", z.ZodTypeAny, {
    status: "paid" | "expired" | "generated" | "scanned";
    id: string;
    expiresAt: Date;
    amount: number;
    provider: "promptpay" | "truewallet" | "linepay";
    qrCode: string;
}, {
    status: "paid" | "expired" | "generated" | "scanned";
    id: string;
    expiresAt: Date;
    amount: number;
    provider: "promptpay" | "truewallet" | "linepay";
    qrCode: string;
}>;
export type QRCodePayment = z.infer<typeof QRCodePaymentSchema>;
export declare const CardPaymentSchema: z.ZodObject<{
    id: z.ZodString;
    amount: z.ZodNumber;
    cardNumber: z.ZodString;
    cardType: z.ZodEnum<["visa", "mastercard", "jcb"]>;
    expiryMonth: z.ZodString;
    expiryYear: z.ZodString;
    cvv: z.ZodString;
    orderId: z.ZodString;
    approvalCode: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["processing", "approved", "declined"]>;
}, "strip", z.ZodTypeAny, {
    status: "processing" | "approved" | "declined";
    id: string;
    orderId: string;
    amount: number;
    cardNumber: string;
    cardType: "visa" | "mastercard" | "jcb";
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    approvalCode?: string | undefined;
}, {
    status: "processing" | "approved" | "declined";
    id: string;
    orderId: string;
    amount: number;
    cardNumber: string;
    cardType: "visa" | "mastercard" | "jcb";
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    approvalCode?: string | undefined;
}>;
export type CardPayment = z.infer<typeof CardPaymentSchema>;
export declare const CashPaymentSchema: z.ZodObject<{
    id: z.ZodString;
    amount: z.ZodNumber;
    cashReceived: z.ZodNumber;
    change: z.ZodNumber;
    status: z.ZodEnum<["paid", "partial"]>;
}, "strip", z.ZodTypeAny, {
    status: "paid" | "partial";
    id: string;
    amount: number;
    change: number;
    cashReceived: number;
}, {
    status: "paid" | "partial";
    id: string;
    amount: number;
    change: number;
    cashReceived: number;
}>;
export type CashPayment = z.infer<typeof CashPaymentSchema>;
//# sourceMappingURL=payment.d.ts.map