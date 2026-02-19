import { z } from "zod";
export declare const SegmentRuleSchema: z.ZodObject<{
    field: z.ZodString;
    operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
}, "strip", z.ZodTypeAny, {
    value: string | number | boolean;
    field: string;
    operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
}, {
    value: string | number | boolean;
    field: string;
    operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
}>;
export type SegmentRule = z.infer<typeof SegmentRuleSchema>;
export declare const SegmentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    rules: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | boolean;
        field: string;
        operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
    }, {
        value: string | number | boolean;
        field: string;
        operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
    }>, "many">;
    customerCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: string;
    rules: {
        value: string | number | boolean;
        field: string;
        operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
    }[];
    description?: string | undefined;
    customerCount?: number | undefined;
}, {
    id: string;
    name: string;
    createdAt: string;
    rules: {
        value: string | number | boolean;
        field: string;
        operator: "greaterThan" | "lessThan" | "contains" | "equals" | "notEquals";
    }[];
    description?: string | undefined;
    customerCount?: number | undefined;
}>;
export type Segment = z.infer<typeof SegmentSchema>;
//# sourceMappingURL=segment.d.ts.map