import { z } from "zod";
export declare const ReservationSchema: z.ZodObject<{
    id: z.ZodString;
    customerId: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    reservedPrice: z.ZodNumber;
    depositAmount: z.ZodNumber;
    status: z.ZodEnum<["pending", "confirmed", "fulfilled", "cancelled", "expired"]>;
    reserveDate: z.ZodDate;
    expiryDate: z.ZodDate;
    fulfillmentDate: z.ZodOptional<z.ZodDate>;
    notes: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "expired" | "cancelled" | "confirmed" | "fulfilled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    productId: string;
    quantity: number;
    createdBy: string;
    reservedPrice: number;
    depositAmount: number;
    reserveDate: Date;
    expiryDate: Date;
    notes?: string | undefined;
    fulfillmentDate?: Date | undefined;
}, {
    status: "pending" | "expired" | "cancelled" | "confirmed" | "fulfilled";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    productId: string;
    quantity: number;
    createdBy: string;
    reservedPrice: number;
    depositAmount: number;
    reserveDate: Date;
    expiryDate: Date;
    notes?: string | undefined;
    fulfillmentDate?: Date | undefined;
}>;
export type Reservation = z.infer<typeof ReservationSchema>;
export declare const ReservationSettingsSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    defaultExpiryHours: z.ZodNumber;
    requireDeposit: z.ZodBoolean;
    depositPercentage: z.ZodNumber;
    maxReservationsPerCustomer: z.ZodNumber;
    allowPartialFulfillment: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    defaultExpiryHours: number;
    requireDeposit: boolean;
    depositPercentage: number;
    maxReservationsPerCustomer: number;
    allowPartialFulfillment: boolean;
}, {
    enabled: boolean;
    defaultExpiryHours: number;
    requireDeposit: boolean;
    depositPercentage: number;
    maxReservationsPerCustomer: number;
    allowPartialFulfillment: boolean;
}>;
export type ReservationSettings = z.infer<typeof ReservationSettingsSchema>;
export declare const ReservationNotificationSchema: z.ZodObject<{
    id: z.ZodString;
    reservationId: z.ZodString;
    type: z.ZodEnum<["reminder", "expiry", "fulfillment", "cancellation"]>;
    message: z.ZodString;
    sentAt: z.ZodDate;
    method: z.ZodEnum<["email", "sms", "push"]>;
    status: z.ZodEnum<["pending", "sent", "failed"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "failed" | "sent";
    id: string;
    type: "reminder" | "expiry" | "fulfillment" | "cancellation";
    message: string;
    method: "push" | "email" | "sms";
    reservationId: string;
    sentAt: Date;
}, {
    status: "pending" | "failed" | "sent";
    id: string;
    type: "reminder" | "expiry" | "fulfillment" | "cancellation";
    message: string;
    method: "push" | "email" | "sms";
    reservationId: string;
    sentAt: Date;
}>;
export type ReservationNotification = z.infer<typeof ReservationNotificationSchema>;
//# sourceMappingURL=reservation.d.ts.map