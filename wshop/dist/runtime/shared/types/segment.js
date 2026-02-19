import { z } from "zod";
export const SegmentRuleSchema = z.object({
  field: z.string(),
  // e.g., 'totalSpent', 'lastOrderDate', 'tags'
  operator: z.enum(["equals", "notEquals", "greaterThan", "lessThan", "contains"]),
  value: z.union([z.string(), z.number(), z.boolean()])
});
export const SegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  rules: z.array(SegmentRuleSchema),
  customerCount: z.number().optional(),
  // Optional: to show how many customers match
  createdAt: z.string()
});
