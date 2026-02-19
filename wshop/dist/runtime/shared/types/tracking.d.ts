import { z } from "zod";
export declare const TrackingSchema: z.ZodObject<{
    id: z.ZodNumber;
    orderId: z.ZodNumber;
    trackingNumber: z.ZodString;
    carrier: z.ZodString;
    status: z.ZodEnum<["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned"]>;
    estimatedDelivery: z.ZodOptional<z.ZodString>;
    actualDelivery: z.ZodNullable<z.ZodString>;
    weight: z.ZodNumber;
    dimensions: z.ZodOptional<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        width: number;
        height: number;
        length: number;
    }, {
        width: number;
        height: number;
        length: number;
    }>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "delivered" | "failed" | "picked_up" | "in_transit" | "out_for_delivery" | "returned";
    id: number;
    createdAt: string;
    updatedAt: string;
    orderId: number;
    trackingNumber: string;
    carrier: string;
    actualDelivery: string | null;
    weight: number;
    estimatedDelivery?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
    } | undefined;
}, {
    status: "pending" | "delivered" | "failed" | "picked_up" | "in_transit" | "out_for_delivery" | "returned";
    id: number;
    createdAt: string;
    updatedAt: string;
    orderId: number;
    trackingNumber: string;
    carrier: string;
    actualDelivery: string | null;
    weight: number;
    estimatedDelivery?: string | undefined;
    dimensions?: {
        width: number;
        height: number;
        length: number;
    } | undefined;
}>;
export type Tracking = z.infer<typeof TrackingSchema>;
export declare const TrackingEventSchema: z.ZodObject<{
    id: z.ZodNumber;
    trackingId: z.ZodNumber;
    status: z.ZodString;
    location: z.ZodString;
    description: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: string;
    id: number;
    description: string;
    location: string;
    timestamp: string;
    trackingId: number;
}, {
    status: string;
    id: number;
    description: string;
    location: string;
    timestamp: string;
    trackingId: number;
}>;
export type TrackingEvent = z.infer<typeof TrackingEventSchema>;
export declare const CarrierSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    code: z.ZodString;
    trackingUrl: z.ZodString;
    isActive: z.ZodBoolean;
    apiKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    apiKey: string;
    trackingUrl: string;
}, {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    apiKey: string;
    trackingUrl: string;
}>;
export type Carrier = z.infer<typeof CarrierSchema>;
//# sourceMappingURL=tracking.d.ts.map