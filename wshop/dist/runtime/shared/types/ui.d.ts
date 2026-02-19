import { z } from "zod";
export declare const SelectOptionSchema: z.ZodObject<{
    value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
    label: z.ZodString;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    value: string | number;
    label: string;
    disabled?: boolean | undefined;
}, {
    value: string | number;
    label: string;
    disabled?: boolean | undefined;
}>;
export type SelectOption = z.infer<typeof SelectOptionSchema>;
export declare const TableColumnSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    sortable: z.ZodOptional<z.ZodBoolean>;
    width: z.ZodOptional<z.ZodString>;
    align: z.ZodOptional<z.ZodEnum<["left", "center", "right"]>>;
}, "strip", z.ZodTypeAny, {
    key: string;
    label: string;
    width?: string | undefined;
    align?: "left" | "center" | "right" | undefined;
    sortable?: boolean | undefined;
}, {
    key: string;
    label: string;
    width?: string | undefined;
    align?: "left" | "center" | "right" | undefined;
    sortable?: boolean | undefined;
}>;
export type TableColumn = z.infer<typeof TableColumnSchema>;
export declare const FilterOptionSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    value: z.ZodUnknown;
}, "strip", z.ZodTypeAny, {
    key: string;
    label: string;
    value?: unknown;
}, {
    key: string;
    label: string;
    value?: unknown;
}>;
export type FilterOption = z.infer<typeof FilterOptionSchema>;
//# sourceMappingURL=ui.d.ts.map