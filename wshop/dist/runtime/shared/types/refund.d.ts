import { z } from "zod";
export declare const RefundItemSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    totalAmount: z.ZodNumber;
    restocked: z.ZodBoolean;
    condition: z.ZodEnum<["good", "damaged", "used"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    restocked: boolean;
    condition: "used" | "good" | "damaged";
}, {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    restocked: boolean;
    condition: "used" | "good" | "damaged";
}>;
export type RefundItem = z.infer<typeof RefundItemSchema>;
export declare const RefundReasonSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    requiresApproval: z.ZodBoolean;
    restockItem: z.ZodBoolean;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    requiresApproval: boolean;
    restockItem: boolean;
}, {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    requiresApproval: boolean;
    restockItem: boolean;
}>;
export type RefundReason = z.infer<typeof RefundReasonSchema>;
export declare const RefundSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    originalTransactionId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        totalAmount: z.ZodNumber;
        restocked: z.ZodBoolean;
        condition: z.ZodEnum<["good", "damaged", "used"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        restocked: boolean;
        condition: "used" | "good" | "damaged";
    }, {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        restocked: boolean;
        condition: "used" | "good" | "damaged";
    }>, "many">;
    totalAmount: z.ZodNumber;
    reason: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        requiresApproval: z.ZodBoolean;
        restockItem: z.ZodBoolean;
        isActive: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        requiresApproval: boolean;
        restockItem: boolean;
    }, {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        requiresApproval: boolean;
        restockItem: boolean;
    }>;
    status: z.ZodEnum<["pending", "approved", "rejected", "processed"]>;
    refundMethod: z.ZodString;
    processedBy: z.ZodString;
    approvedBy: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    processedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "rejected" | "processed";
    id: string;
    createdAt: Date;
    reason: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        requiresApproval: boolean;
        restockItem: boolean;
    };
    orderId: string;
    items: {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        restocked: boolean;
        condition: "used" | "good" | "damaged";
    }[];
    totalAmount: number;
    originalTransactionId: string;
    refundMethod: string;
    processedBy: string;
    notes?: string | undefined;
    approvedBy?: string | undefined;
    processedAt?: Date | undefined;
}, {
    status: "pending" | "approved" | "rejected" | "processed";
    id: string;
    createdAt: Date;
    reason: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
        requiresApproval: boolean;
        restockItem: boolean;
    };
    orderId: string;
    items: {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        restocked: boolean;
        condition: "used" | "good" | "damaged";
    }[];
    totalAmount: number;
    originalTransactionId: string;
    refundMethod: string;
    processedBy: string;
    notes?: string | undefined;
    approvedBy?: string | undefined;
    processedAt?: Date | undefined;
}>;
export type Refund = z.infer<typeof RefundSchema>;
export declare const RefundPolicySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    timeLimit: z.ZodNumber;
    conditionRequired: z.ZodBoolean;
    restockFee: z.ZodNumber;
    requiresReceipt: z.ZodBoolean;
    autoApproval: z.ZodBoolean;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    timeLimit: number;
    conditionRequired: boolean;
    restockFee: number;
    requiresReceipt: boolean;
    autoApproval: boolean;
}, {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    timeLimit: number;
    conditionRequired: boolean;
    restockFee: number;
    requiresReceipt: boolean;
    autoApproval: boolean;
}>;
export type RefundPolicy = z.infer<typeof RefundPolicySchema>;
//# sourceMappingURL=refund.d.ts.map