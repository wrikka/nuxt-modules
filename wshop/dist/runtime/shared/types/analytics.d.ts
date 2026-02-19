import { z } from "zod";
export declare const TimeSeriesDataSchema: z.ZodObject<{
    date: z.ZodString;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    date: string;
}, {
    value: number;
    date: string;
}>;
export type TimeSeriesData = z.infer<typeof TimeSeriesDataSchema>;
export declare const TopProductDataSchema: z.ZodObject<{
    productId: z.ZodString;
    name: z.ZodString;
    sales: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    productId: string;
    sales: number;
}, {
    name: string;
    productId: string;
    sales: number;
}>;
export type TopProductData = z.infer<typeof TopProductDataSchema>;
export declare const ConversionFunnelDataSchema: z.ZodObject<{
    step: z.ZodString;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    step: string;
    count: number;
}, {
    step: string;
    count: number;
}>;
export type ConversionFunnelData = z.infer<typeof ConversionFunnelDataSchema>;
//# sourceMappingURL=analytics.d.ts.map