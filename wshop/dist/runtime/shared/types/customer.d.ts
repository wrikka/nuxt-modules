import { z } from "zod";
export declare const CustomerSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    spent: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string | null;
    email: string;
    phone?: string | undefined;
    avatar?: string | undefined;
    country?: string | undefined;
    spent?: string | undefined;
}, {
    id: string;
    name: string | null;
    email: string;
    phone?: string | undefined;
    avatar?: string | undefined;
    country?: string | undefined;
    spent?: string | undefined;
}>;
export type Customer = z.infer<typeof CustomerSchema>;
//# sourceMappingURL=customer.d.ts.map