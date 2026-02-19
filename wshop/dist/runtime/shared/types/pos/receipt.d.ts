import { z } from "zod";
export declare const ReceiptItemSchema: z.ZodObject<{
    productId: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    discount: z.ZodNumber;
    total: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    discount: number;
    productId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
}, {
    total: number;
    discount: number;
    productId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
}>;
export type ReceiptItem = z.infer<typeof ReceiptItemSchema>;
export declare const ReceiptSchema: z.ZodObject<{
    id: z.ZodString;
    sessionId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        discount: z.ZodNumber;
        total: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        discount: number;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
    }, {
        total: number;
        discount: number;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
    }>, "many">;
    subtotal: z.ZodNumber;
    tax: z.ZodNumber;
    discount: z.ZodNumber;
    total: z.ZodNumber;
    paymentMethod: z.ZodString;
    paymentDetails: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    customerInfo: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    }, {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    }>>;
    staffInfo: z.ZodObject<{
        name: z.ZodString;
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: string;
    }, {
        name: string;
        role: string;
    }>;
    registerInfo: z.ZodObject<{
        name: z.ZodString;
        location: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        location: string;
    }, {
        name: string;
        location: string;
    }>;
    issuedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    paymentMethod: string;
    items: {
        total: number;
        discount: number;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
    }[];
    sessionId: string;
    staffInfo: {
        name: string;
        role: string;
    };
    registerInfo: {
        name: string;
        location: string;
    };
    issuedAt: string;
    paymentDetails?: Record<string, any> | undefined;
    customerInfo?: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    } | undefined;
}, {
    id: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    paymentMethod: string;
    items: {
        total: number;
        discount: number;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
    }[];
    sessionId: string;
    staffInfo: {
        name: string;
        role: string;
    };
    registerInfo: {
        name: string;
        location: string;
    };
    issuedAt: string;
    paymentDetails?: Record<string, any> | undefined;
    customerInfo?: {
        name?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    } | undefined;
}>;
export type Receipt = z.infer<typeof ReceiptSchema>;
//# sourceMappingURL=receipt.d.ts.map