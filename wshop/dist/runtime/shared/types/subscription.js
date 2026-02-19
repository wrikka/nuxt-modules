import { z } from "zod";
export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  billingInterval: z.enum(["day", "week", "month", "year"]),
  intervalCount: z.number(),
  status: z.enum(["active", "archived"])
});
export const SubscriptionSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  planId: z.string(),
  status: z.enum(["active", "paused", "cancelled", "past_due"]),
  startDate: z.date(),
  nextBillingDate: z.date(),
  cancellationDate: z.date().optional()
});
