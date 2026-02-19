import { z } from "zod";
export declare const StatSchema: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
    change: z.ZodString;
    icon: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    value: string;
    icon: string;
    change: string;
}, {
    name: string;
    value: string;
    icon: string;
    change: string;
}>;
export type Stat = z.infer<typeof StatSchema>;
export declare const ActivitySchema: z.ZodObject<{
    id: z.ZodNumber;
    user: z.ZodString;
    action: z.ZodString;
    time: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    user: string;
    action: string;
    time: string;
}, {
    id: number;
    user: string;
    action: string;
    time: string;
}>;
export type Activity = z.infer<typeof ActivitySchema>;
//# sourceMappingURL=dashboard.d.ts.map