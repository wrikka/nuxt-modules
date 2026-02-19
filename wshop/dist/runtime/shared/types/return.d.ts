import { z } from "zod";
export declare const ReturnRequestSchema: z.ZodObject<{
    id: z.ZodNumber;
    orderId: z.ZodNumber;
    customerId: z.ZodNumber;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
        reason: z.ZodString;
        condition: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        productId: number;
        quantity: number;
        condition: string;
    }, {
        reason: string;
        productId: number;
        quantity: number;
        condition: string;
    }>, "many">;
    reason: z.ZodString;
    status: z.ZodEnum<["pending", "approved", "rejected", "processing", "completed"]>;
    refundType: z.ZodEnum<["refund", "exchange", "store_credit"]>;
    refundAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "completed" | "approved" | "rejected";
    id: number;
    createdAt: string;
    updatedAt: string;
    reason: string;
    customerId: number;
    orderId: number;
    items: {
        reason: string;
        productId: number;
        quantity: number;
        condition: string;
    }[];
    refundType: "store_credit" | "refund" | "exchange";
    refundAmount: number;
    notes?: string | undefined;
    trackingNumber?: string | undefined;
}, {
    status: "pending" | "processing" | "completed" | "approved" | "rejected";
    id: number;
    createdAt: string;
    updatedAt: string;
    reason: string;
    customerId: number;
    orderId: number;
    items: {
        reason: string;
        productId: number;
        quantity: number;
        condition: string;
    }[];
    refundType: "store_credit" | "refund" | "exchange";
    refundAmount: number;
    notes?: string | undefined;
    trackingNumber?: string | undefined;
}>;
export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;
export declare const ReturnItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    returnId: z.ZodNumber;
    productId: z.ZodNumber;
    quantity: z.ZodNumber;
    reason: z.ZodString;
    condition: z.ZodString;
    approvedQuantity: z.ZodNumber;
    refundAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    reason: string;
    productId: number;
    quantity: number;
    condition: string;
    refundAmount: number;
    returnId: number;
    approvedQuantity: number;
}, {
    id: number;
    reason: string;
    productId: number;
    quantity: number;
    condition: string;
    refundAmount: number;
    returnId: number;
    approvedQuantity: number;
}>;
export type ReturnItem = z.infer<typeof ReturnItemSchema>;
//# sourceMappingURL=return.d.ts.map