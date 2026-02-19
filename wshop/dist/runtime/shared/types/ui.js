import { z } from "zod";
export const SelectOptionSchema = z.object({
  value: z.union([z.string(), z.number()]),
  label: z.string(),
  disabled: z.boolean().optional()
});
export const TableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  sortable: z.boolean().optional(),
  width: z.string().optional(),
  align: z.enum(["left", "center", "right"]).optional()
});
export const FilterOptionSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.unknown()
});
