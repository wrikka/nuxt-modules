import { z } from "zod";
export declare const PromotionSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["percentage", "fixed", "buy_x_get_y", "free_shipping", "bundle"]>;
    value: z.ZodOptional<z.ZodNumber>;
    discountValue: z.ZodNumber;
    startDate: z.ZodString;
    endDate: z.ZodString;
    status: z.ZodEnum<["active", "scheduled", "inactive"]>;
    maxUsage: z.ZodNullable<z.ZodNumber>;
    usageLimit: z.ZodNullable<z.ZodNumber>;
    maxUsagePerCustomer: z.ZodNullable<z.ZodNumber>;
    usageCount: z.ZodNumber;
    minimumAmount: z.ZodNullable<z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodObject<{
        minPurchase: z.ZodNullable<z.ZodNumber>;
        minQuantity: z.ZodNullable<z.ZodNumber>;
        customerTypes: z.ZodArray<z.ZodString, "many">;
        productCategories: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        minPurchase: number | null;
        minQuantity: number | null;
        customerTypes: string[];
        productCategories: string[];
    }, {
        minPurchase: number | null;
        minQuantity: number | null;
        customerTypes: string[];
        productCategories: string[];
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "active" | "scheduled" | "inactive";
    id: number;
    name: string;
    type: "fixed" | "percentage" | "buy_x_get_y" | "free_shipping" | "bundle";
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    usageLimit: number | null;
    discountValue: number;
    maxUsage: number | null;
    maxUsagePerCustomer: number | null;
    minimumAmount: number | null;
    description?: string | undefined;
    value?: number | undefined;
    code?: string | undefined;
    conditions?: {
        minPurchase: number | null;
        minQuantity: number | null;
        customerTypes: string[];
        productCategories: string[];
    } | undefined;
}, {
    status: "active" | "scheduled" | "inactive";
    id: number;
    name: string;
    type: "fixed" | "percentage" | "buy_x_get_y" | "free_shipping" | "bundle";
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    usageLimit: number | null;
    discountValue: number;
    maxUsage: number | null;
    maxUsagePerCustomer: number | null;
    minimumAmount: number | null;
    description?: string | undefined;
    value?: number | undefined;
    code?: string | undefined;
    conditions?: {
        minPurchase: number | null;
        minQuantity: number | null;
        customerTypes: string[];
        productCategories: string[];
    } | undefined;
}>;
export type Promotion = z.infer<typeof PromotionSchema>;
export declare const AppliedDiscountSchema: z.ZodObject<{
    id: z.ZodNumber;
    orderId: z.ZodNumber;
    promotionId: z.ZodNumber;
    amount: z.ZodNumber;
    type: z.ZodEnum<["percentage", "fixed"]>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    description: string;
    type: "fixed" | "percentage";
    promotionId: number;
    orderId: number;
    amount: number;
}, {
    id: number;
    description: string;
    type: "fixed" | "percentage";
    promotionId: number;
    orderId: number;
    amount: number;
}>;
export type AppliedDiscount = z.infer<typeof AppliedDiscountSchema>;
export interface PromotionError {
    data?: {
        message?: string;
    };
}
export interface DiscountApplication {
    promotionId: number;
    promotionName: string;
    discountAmount: number;
    applicable: boolean;
    reason: string;
}
//# sourceMappingURL=promotion.d.ts.map