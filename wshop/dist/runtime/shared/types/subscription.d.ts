import { z } from "zod";
export declare const SubscriptionPlanSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodString;
    billingInterval: z.ZodEnum<["day", "week", "month", "year"]>;
    intervalCount: z.ZodNumber;
    status: z.ZodEnum<["active", "archived"]>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    status: "active" | "archived";
    id: string;
    name: string;
    description: string;
    price: number;
    billingInterval: "week" | "month" | "year" | "day";
    intervalCount: number;
}, {
    currency: string;
    status: "active" | "archived";
    id: string;
    name: string;
    description: string;
    price: number;
    billingInterval: "week" | "month" | "year" | "day";
    intervalCount: number;
}>;
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;
export declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    planId: z.ZodString;
    status: z.ZodEnum<["active", "paused", "cancelled", "past_due"]>;
    startDate: z.ZodDate;
    nextBillingDate: z.ZodDate;
    cancellationDate: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "cancelled" | "paused" | "past_due";
    id: string;
    startDate: Date;
    customerId: string;
    planId: string;
    nextBillingDate: Date;
    cancellationDate?: Date | undefined;
}, {
    status: "active" | "cancelled" | "paused" | "past_due";
    id: string;
    startDate: Date;
    customerId: string;
    planId: string;
    nextBillingDate: Date;
    cancellationDate?: Date | undefined;
}>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
//# sourceMappingURL=subscription.d.ts.map