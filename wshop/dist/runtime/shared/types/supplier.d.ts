import { z } from "zod";
export declare const SupplierSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    enabled: z.ZodBoolean;
    config: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodNullable<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    enabled: boolean;
    config: Record<string, any> | null;
}, {
    id: string;
    name: string;
    type: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    enabled: boolean;
    config: Record<string, any> | null;
}>;
export type Supplier = z.infer<typeof SupplierSchema>;
//# sourceMappingURL=supplier.d.ts.map