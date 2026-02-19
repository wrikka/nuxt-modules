import { z } from "zod";
export declare const POSRegisterSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    location: z.ZodString;
    cashDrawerBalance: z.ZodNumber;
    status: z.ZodEnum<["open", "closed", "maintenance"]>;
    currentStaffId: z.ZodNullable<z.ZodNumber>;
    openedAt: z.ZodNullable<z.ZodString>;
    closedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "open" | "closed" | "maintenance";
    id: number;
    name: string;
    location: string;
    openedAt: string | null;
    closedAt: string | null;
    cashDrawerBalance: number;
    currentStaffId: number | null;
}, {
    status: "open" | "closed" | "maintenance";
    id: number;
    name: string;
    location: string;
    openedAt: string | null;
    closedAt: string | null;
    cashDrawerBalance: number;
    currentStaffId: number | null;
}>;
export type POSRegister = z.infer<typeof POSRegisterSchema>;
export declare const StaffSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    role: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    role: string;
}, {
    id: number;
    name: string;
    role: string;
}>;
export type Staff = z.infer<typeof StaffSchema>;
//# sourceMappingURL=register.d.ts.map