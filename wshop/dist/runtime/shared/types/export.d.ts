import { z } from "zod";
export declare const ExportTypeSchema: z.ZodEnum<["sales_report", "inventory_report", "customer_list", "product_list", "employee_performance", "financial_report"]>;
export type ExportType = z.infer<typeof ExportTypeSchema>;
export declare const ImportTypeSchema: z.ZodEnum<["products", "customers", "inventory", "price_list"]>;
export type ImportType = z.infer<typeof ImportTypeSchema>;
export declare const ExportFormatSchema: z.ZodEnum<["excel", "csv", "pdf", "json"]>;
export type ExportFormat = z.infer<typeof ExportFormatSchema>;
export declare const ImportFormatSchema: z.ZodEnum<["excel", "csv", "json"]>;
export type ImportFormat = z.infer<typeof ImportFormatSchema>;
export declare const ExportJobSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["sales_report", "inventory_report", "customer_list", "product_list", "employee_performance", "financial_report"]>;
    format: z.ZodEnum<["excel", "csv", "pdf", "json"]>;
    parameters: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    status: z.ZodEnum<["pending", "processing", "completed", "failed"]>;
    filePath: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodNumber>;
    downloadUrl: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "failed" | "completed";
    id: string;
    type: "sales_report" | "inventory_report" | "customer_list" | "product_list" | "employee_performance" | "financial_report";
    createdAt: Date;
    format: "pdf" | "excel" | "csv" | "json";
    parameters: Record<string, unknown>;
    createdBy: string;
    error?: string | undefined;
    fileSize?: number | undefined;
    filePath?: string | undefined;
    downloadUrl?: string | undefined;
    completedAt?: Date | undefined;
}, {
    status: "pending" | "processing" | "failed" | "completed";
    id: string;
    type: "sales_report" | "inventory_report" | "customer_list" | "product_list" | "employee_performance" | "financial_report";
    createdAt: Date;
    format: "pdf" | "excel" | "csv" | "json";
    parameters: Record<string, unknown>;
    createdBy: string;
    error?: string | undefined;
    fileSize?: number | undefined;
    filePath?: string | undefined;
    downloadUrl?: string | undefined;
    completedAt?: Date | undefined;
}>;
export type ExportJob = z.infer<typeof ExportJobSchema>;
export declare const ImportErrorSchema: z.ZodObject<{
    row: z.ZodNumber;
    field: z.ZodString;
    value: z.ZodString;
    message: z.ZodString;
    severity: z.ZodEnum<["error", "warning"]>;
}, "strip", z.ZodTypeAny, {
    message: string;
    value: string;
    severity: "error" | "warning";
    field: string;
    row: number;
}, {
    message: string;
    value: string;
    severity: "error" | "warning";
    field: string;
    row: number;
}>;
export type ImportError = z.infer<typeof ImportErrorSchema>;
export declare const ImportJobSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["products", "customers", "inventory", "price_list"]>;
    format: z.ZodEnum<["excel", "csv", "json"]>;
    filePath: z.ZodString;
    status: z.ZodEnum<["pending", "processing", "completed", "failed"]>;
    totalRows: z.ZodNumber;
    processedRows: z.ZodNumber;
    errors: z.ZodArray<z.ZodObject<{
        row: z.ZodNumber;
        field: z.ZodString;
        value: z.ZodString;
        message: z.ZodString;
        severity: z.ZodEnum<["error", "warning"]>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        value: string;
        severity: "error" | "warning";
        field: string;
        row: number;
    }, {
        message: string;
        value: string;
        severity: "error" | "warning";
        field: string;
        row: number;
    }>, "many">;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "processing" | "failed" | "completed";
    id: string;
    type: "products" | "customers" | "inventory" | "price_list";
    createdAt: Date;
    errors: {
        message: string;
        value: string;
        severity: "error" | "warning";
        field: string;
        row: number;
    }[];
    format: "excel" | "csv" | "json";
    filePath: string;
    createdBy: string;
    totalRows: number;
    processedRows: number;
    completedAt?: Date | undefined;
}, {
    status: "pending" | "processing" | "failed" | "completed";
    id: string;
    type: "products" | "customers" | "inventory" | "price_list";
    createdAt: Date;
    errors: {
        message: string;
        value: string;
        severity: "error" | "warning";
        field: string;
        row: number;
    }[];
    format: "excel" | "csv" | "json";
    filePath: string;
    createdBy: string;
    totalRows: number;
    processedRows: number;
    completedAt?: Date | undefined;
}>;
export type ImportJob = z.infer<typeof ImportJobSchema>;
export declare const ExportFieldSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["string", "number", "date", "boolean"]>;
    format: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "date";
    key: string;
    label: string;
    width?: number | undefined;
    format?: string | undefined;
}, {
    type: "string" | "number" | "boolean" | "date";
    key: string;
    label: string;
    width?: number | undefined;
    format?: string | undefined;
}>;
export type ExportField = z.infer<typeof ExportFieldSchema>;
export declare const ExportTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["sales_report", "inventory_report", "customer_list", "product_list", "employee_performance", "financial_report"]>;
    format: z.ZodEnum<["excel", "csv", "pdf", "json"]>;
    fields: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["string", "number", "date", "boolean"]>;
        format: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "date";
        key: string;
        label: string;
        width?: number | undefined;
        format?: string | undefined;
    }, {
        type: "string" | "number" | "boolean" | "date";
        key: string;
        label: string;
        width?: number | undefined;
        format?: string | undefined;
    }>, "many">;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    isDefault: z.ZodBoolean;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: "sales_report" | "inventory_report" | "customer_list" | "product_list" | "employee_performance" | "financial_report";
    createdAt: Date;
    format: "pdf" | "excel" | "csv" | "json";
    isDefault: boolean;
    createdBy: string;
    fields: {
        type: "string" | "number" | "boolean" | "date";
        key: string;
        label: string;
        width?: number | undefined;
        format?: string | undefined;
    }[];
    filters?: Record<string, unknown> | undefined;
}, {
    id: string;
    name: string;
    type: "sales_report" | "inventory_report" | "customer_list" | "product_list" | "employee_performance" | "financial_report";
    createdAt: Date;
    format: "pdf" | "excel" | "csv" | "json";
    isDefault: boolean;
    createdBy: string;
    fields: {
        type: "string" | "number" | "boolean" | "date";
        key: string;
        label: string;
        width?: number | undefined;
        format?: string | undefined;
    }[];
    filters?: Record<string, unknown> | undefined;
}>;
export type ExportTemplate = z.infer<typeof ExportTemplateSchema>;
//# sourceMappingURL=export.d.ts.map