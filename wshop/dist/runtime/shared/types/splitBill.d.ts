import { z } from "zod";
export declare const SplitTypeSchema: z.ZodEnum<["equal", "by_item", "by_amount", "by_percentage", "custom"]>;
export type SplitType = z.infer<typeof SplitTypeSchema>;
export declare const SplitPaymentSchema: z.ZodObject<{
    id: z.ZodString;
    splitId: z.ZodString;
    amount: z.ZodNumber;
    method: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "completed", "failed"]>;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "failed" | "completed";
    id: string;
    createdAt: Date;
    amount: number;
    method: string;
    splitId: string;
    reference?: string | undefined;
}, {
    status: "pending" | "failed" | "completed";
    id: string;
    createdAt: Date;
    amount: number;
    method: string;
    splitId: string;
    reference?: string | undefined;
}>;
export type SplitPayment = z.infer<typeof SplitPaymentSchema>;
export declare const SplitItemSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    productId: z.ZodString;
    productName: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    totalPrice: z.ZodNumber;
    splitQuantity: z.ZodNumber;
    splitPrice: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
    totalPrice: number;
    splitQuantity: number;
    splitPrice: number;
}, {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
    totalPrice: number;
    splitQuantity: number;
    splitPrice: number;
}>;
export type SplitItem = z.infer<typeof SplitItemSchema>;
export declare const BillSplitSchema: z.ZodObject<{
    id: z.ZodString;
    splitBillId: z.ZodString;
    customerName: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        orderId: z.ZodString;
        productId: z.ZodString;
        productName: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        totalPrice: z.ZodNumber;
        splitQuantity: z.ZodNumber;
        splitPrice: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
        totalPrice: number;
        splitQuantity: number;
        splitPrice: number;
    }, {
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
        totalPrice: number;
        splitQuantity: number;
        splitPrice: number;
    }>, "many">;
    subtotal: z.ZodNumber;
    tax: z.ZodNumber;
    serviceCharge: z.ZodNumber;
    discount: z.ZodNumber;
    total: z.ZodNumber;
    paidAmount: z.ZodNumber;
    status: z.ZodEnum<["unpaid", "partial", "paid"]>;
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        splitId: z.ZodString;
        amount: z.ZodNumber;
        method: z.ZodString;
        reference: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["pending", "completed", "failed"]>;
        createdAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "failed" | "completed";
        id: string;
        createdAt: Date;
        amount: number;
        method: string;
        splitId: string;
        reference?: string | undefined;
    }, {
        status: "pending" | "failed" | "completed";
        id: string;
        createdAt: Date;
        amount: number;
        method: string;
        splitId: string;
        reference?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "paid" | "partial" | "unpaid";
    id: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    items: {
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
        totalPrice: number;
        splitQuantity: number;
        splitPrice: number;
    }[];
    splitBillId: string;
    serviceCharge: number;
    paidAmount: number;
    payments: {
        status: "pending" | "failed" | "completed";
        id: string;
        createdAt: Date;
        amount: number;
        method: string;
        splitId: string;
        reference?: string | undefined;
    }[];
    customerName?: string | undefined;
}, {
    status: "paid" | "partial" | "unpaid";
    id: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    items: {
        id: string;
        orderId: string;
        productId: string;
        quantity: number;
        productName: string;
        unitPrice: number;
        totalPrice: number;
        splitQuantity: number;
        splitPrice: number;
    }[];
    splitBillId: string;
    serviceCharge: number;
    paidAmount: number;
    payments: {
        status: "pending" | "failed" | "completed";
        id: string;
        createdAt: Date;
        amount: number;
        method: string;
        splitId: string;
        reference?: string | undefined;
    }[];
    customerName?: string | undefined;
}>;
export type BillSplit = z.infer<typeof BillSplitSchema>;
export declare const SplitBillSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    type: z.ZodEnum<["equal", "by_item", "by_amount", "by_percentage", "custom"]>;
    splits: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        splitBillId: z.ZodString;
        customerName: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            orderId: z.ZodString;
            productId: z.ZodString;
            productName: z.ZodString;
            quantity: z.ZodNumber;
            unitPrice: z.ZodNumber;
            totalPrice: z.ZodNumber;
            splitQuantity: z.ZodNumber;
            splitPrice: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }, {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }>, "many">;
        subtotal: z.ZodNumber;
        tax: z.ZodNumber;
        serviceCharge: z.ZodNumber;
        discount: z.ZodNumber;
        total: z.ZodNumber;
        paidAmount: z.ZodNumber;
        status: z.ZodEnum<["unpaid", "partial", "paid"]>;
        payments: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            splitId: z.ZodString;
            amount: z.ZodNumber;
            method: z.ZodString;
            reference: z.ZodOptional<z.ZodString>;
            status: z.ZodEnum<["pending", "completed", "failed"]>;
            createdAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }, {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        status: "paid" | "partial" | "unpaid";
        id: string;
        subtotal: number;
        total: number;
        discount: number;
        tax: number;
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }[];
        splitBillId: string;
        serviceCharge: number;
        paidAmount: number;
        payments: {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }[];
        customerName?: string | undefined;
    }, {
        status: "paid" | "partial" | "unpaid";
        id: string;
        subtotal: number;
        total: number;
        discount: number;
        tax: number;
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }[];
        splitBillId: string;
        serviceCharge: number;
        paidAmount: number;
        payments: {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }[];
        customerName?: string | undefined;
    }>, "many">;
    status: z.ZodEnum<["pending", "partial", "completed"]>;
    totalAmount: z.ZodNumber;
    remainingAmount: z.ZodNumber;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "completed" | "partial";
    id: string;
    type: "custom" | "equal" | "by_item" | "by_amount" | "by_percentage";
    createdAt: Date;
    orderId: string;
    createdBy: string;
    totalAmount: number;
    splits: {
        status: "paid" | "partial" | "unpaid";
        id: string;
        subtotal: number;
        total: number;
        discount: number;
        tax: number;
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }[];
        splitBillId: string;
        serviceCharge: number;
        paidAmount: number;
        payments: {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }[];
        customerName?: string | undefined;
    }[];
    remainingAmount: number;
    completedAt?: Date | undefined;
}, {
    status: "pending" | "completed" | "partial";
    id: string;
    type: "custom" | "equal" | "by_item" | "by_amount" | "by_percentage";
    createdAt: Date;
    orderId: string;
    createdBy: string;
    totalAmount: number;
    splits: {
        status: "paid" | "partial" | "unpaid";
        id: string;
        subtotal: number;
        total: number;
        discount: number;
        tax: number;
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            productName: string;
            unitPrice: number;
            totalPrice: number;
            splitQuantity: number;
            splitPrice: number;
        }[];
        splitBillId: string;
        serviceCharge: number;
        paidAmount: number;
        payments: {
            status: "pending" | "failed" | "completed";
            id: string;
            createdAt: Date;
            amount: number;
            method: string;
            splitId: string;
            reference?: string | undefined;
        }[];
        customerName?: string | undefined;
    }[];
    remainingAmount: number;
    completedAt?: Date | undefined;
}>;
export type SplitBill = z.infer<typeof SplitBillSchema>;
export declare const SplitSettingsSchema: z.ZodObject<{
    includeTax: z.ZodBoolean;
    includeServiceCharge: z.ZodBoolean;
    roundAmount: z.ZodBoolean;
    minSplitAmount: z.ZodNumber;
    maxSplits: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    includeTax: boolean;
    includeServiceCharge: boolean;
    roundAmount: boolean;
    minSplitAmount: number;
    maxSplits: number;
}, {
    includeTax: boolean;
    includeServiceCharge: boolean;
    roundAmount: boolean;
    minSplitAmount: number;
    maxSplits: number;
}>;
export type SplitSettings = z.infer<typeof SplitSettingsSchema>;
export declare const SplitTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["equal", "by_item", "by_amount", "by_percentage", "custom"]>;
    description: z.ZodString;
    isDefault: z.ZodBoolean;
    settings: z.ZodObject<{
        includeTax: z.ZodBoolean;
        includeServiceCharge: z.ZodBoolean;
        roundAmount: z.ZodBoolean;
        minSplitAmount: z.ZodNumber;
        maxSplits: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        includeTax: boolean;
        includeServiceCharge: boolean;
        roundAmount: boolean;
        minSplitAmount: number;
        maxSplits: number;
    }, {
        includeTax: boolean;
        includeServiceCharge: boolean;
        roundAmount: boolean;
        minSplitAmount: number;
        maxSplits: number;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    type: "custom" | "equal" | "by_item" | "by_amount" | "by_percentage";
    settings: {
        includeTax: boolean;
        includeServiceCharge: boolean;
        roundAmount: boolean;
        minSplitAmount: number;
        maxSplits: number;
    };
    isDefault: boolean;
}, {
    id: string;
    name: string;
    description: string;
    type: "custom" | "equal" | "by_item" | "by_amount" | "by_percentage";
    settings: {
        includeTax: boolean;
        includeServiceCharge: boolean;
        roundAmount: boolean;
        minSplitAmount: number;
        maxSplits: number;
    };
    isDefault: boolean;
}>;
export type SplitTemplate = z.infer<typeof SplitTemplateSchema>;
//# sourceMappingURL=splitBill.d.ts.map