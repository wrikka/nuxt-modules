import { z } from "zod";
export const ExportTypeSchema = z.enum([
  "sales_report",
  "inventory_report",
  "customer_list",
  "product_list",
  "employee_performance",
  "financial_report"
]);
export const ImportTypeSchema = z.enum([
  "products",
  "customers",
  "inventory",
  "price_list"
]);
export const ExportFormatSchema = z.enum(["excel", "csv", "pdf", "json"]);
export const ImportFormatSchema = z.enum(["excel", "csv", "json"]);
export const ExportJobSchema = z.object({
  id: z.string(),
  type: ExportTypeSchema,
  format: ExportFormatSchema,
  parameters: z.record(z.unknown()),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  filePath: z.string().optional(),
  fileSize: z.number().optional(),
  downloadUrl: z.string().optional(),
  error: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.date(),
  completedAt: z.date().optional()
});
export const ImportErrorSchema = z.object({
  row: z.number(),
  field: z.string(),
  value: z.string(),
  message: z.string(),
  severity: z.enum(["error", "warning"])
});
export const ImportJobSchema = z.object({
  id: z.string(),
  type: ImportTypeSchema,
  format: ImportFormatSchema,
  filePath: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]),
  totalRows: z.number(),
  processedRows: z.number(),
  errors: z.array(ImportErrorSchema),
  createdBy: z.string(),
  createdAt: z.date(),
  completedAt: z.date().optional()
});
export const ExportFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["string", "number", "date", "boolean"]),
  format: z.string().optional(),
  width: z.number().optional()
});
export const ExportTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ExportTypeSchema,
  format: ExportFormatSchema,
  fields: z.array(ExportFieldSchema),
  filters: z.record(z.unknown()).optional(),
  isDefault: z.boolean(),
  createdBy: z.string(),
  createdAt: z.date()
});
