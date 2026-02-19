import { z } from "zod";
export declare const DiscountSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    type: z.ZodEnum<["percentage", "fixed_amount"]>;
    value: z.ZodString;
    usageLimit: z.ZodNullable<z.ZodNumber>;
    usageCount: z.ZodNumber;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    description: string | null;
    type: "percentage" | "fixed_amount";
    createdAt: string;
    updatedAt: string;
    value: string;
    code: string;
    usageCount: number;
    usageLimit: number | null;
    isActive: boolean;
}, {
    id: string;
    description: string | null;
    type: "percentage" | "fixed_amount";
    createdAt: string;
    updatedAt: string;
    value: string;
    code: string;
    usageCount: number;
    usageLimit: number | null;
    isActive: boolean;
}>;
export type Discount = z.infer<typeof DiscountSchema>;
//# sourceMappingURL=discount.d.ts.map