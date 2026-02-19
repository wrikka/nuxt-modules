import { z } from "zod";
export const TimeSeriesDataSchema = z.object({
  date: z.string(),
  value: z.number()
});
export const TopProductDataSchema = z.object({
  productId: z.string(),
  name: z.string(),
  sales: z.number()
});
export const ConversionFunnelDataSchema = z.object({
  step: z.string(),
  count: z.number()
});
