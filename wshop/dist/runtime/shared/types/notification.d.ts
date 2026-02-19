import { z } from "zod";
export declare const NotificationChannelSchema: z.ZodObject<{
    type: z.ZodEnum<["in_app", "email", "sms", "push", "webhook"]>;
    enabled: z.ZodBoolean;
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "push" | "email" | "in_app" | "sms" | "webhook";
    enabled: boolean;
    config?: Record<string, unknown> | undefined;
}, {
    type: "push" | "email" | "in_app" | "sms" | "webhook";
    enabled: boolean;
    config?: Record<string, unknown> | undefined;
}>;
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;
export declare const NotificationTypeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["stock", "order", "promotion", "system", "customer", "employee"]>;
    template: z.ZodString;
    enabled: z.ZodBoolean;
    channels: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["in_app", "email", "sms", "push", "webhook"]>;
        enabled: z.ZodBoolean;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "push" | "email" | "in_app" | "sms" | "webhook";
        enabled: boolean;
        config?: Record<string, unknown> | undefined;
    }, {
        type: "push" | "email" | "in_app" | "sms" | "webhook";
        enabled: boolean;
        config?: Record<string, unknown> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
    enabled: boolean;
    channels: {
        type: "push" | "email" | "in_app" | "sms" | "webhook";
        enabled: boolean;
        config?: Record<string, unknown> | undefined;
    }[];
    template: string;
}, {
    id: string;
    name: string;
    category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
    enabled: boolean;
    channels: {
        type: "push" | "email" | "in_app" | "sms" | "webhook";
        enabled: boolean;
        config?: Record<string, unknown> | undefined;
    }[];
    template: string;
}>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export declare const NotificationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<["stock", "order", "promotion", "system", "customer", "employee"]>;
        template: z.ZodString;
        enabled: z.ZodBoolean;
        channels: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["in_app", "email", "sms", "push", "webhook"]>;
            enabled: z.ZodBoolean;
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }, {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
        enabled: boolean;
        channels: {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }[];
        template: string;
    }, {
        id: string;
        name: string;
        category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
        enabled: boolean;
        channels: {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }[];
        template: string;
    }>;
    title: z.ZodString;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    isRead: z.ZodBoolean;
    priority: z.ZodEnum<["low", "medium", "high", "urgent"]>;
    actionUrl: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    readAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: {
        id: string;
        name: string;
        category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
        enabled: boolean;
        channels: {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }[];
        template: string;
    };
    message: string;
    title: string;
    createdAt: Date;
    userId: string;
    isRead: boolean;
    priority: "high" | "medium" | "low" | "urgent";
    data?: Record<string, unknown> | undefined;
    expiresAt?: Date | undefined;
    actionUrl?: string | undefined;
    readAt?: Date | undefined;
}, {
    id: string;
    type: {
        id: string;
        name: string;
        category: "order" | "stock" | "customer" | "promotion" | "system" | "employee";
        enabled: boolean;
        channels: {
            type: "push" | "email" | "in_app" | "sms" | "webhook";
            enabled: boolean;
            config?: Record<string, unknown> | undefined;
        }[];
        template: string;
    };
    message: string;
    title: string;
    createdAt: Date;
    userId: string;
    isRead: boolean;
    priority: "high" | "medium" | "low" | "urgent";
    data?: Record<string, unknown> | undefined;
    expiresAt?: Date | undefined;
    actionUrl?: string | undefined;
    readAt?: Date | undefined;
}>;
export type Notification = z.infer<typeof NotificationSchema>;
export declare const NotificationSettingsSchema: z.ZodObject<{
    userId: z.ZodString;
    types: z.ZodRecord<z.ZodString, z.ZodObject<{
        enabled: z.ZodBoolean;
        channels: z.ZodArray<z.ZodEnum<["in_app", "email", "sms", "push", "webhook"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        channels: ("push" | "email" | "in_app" | "sms" | "webhook")[];
    }, {
        enabled: boolean;
        channels: ("push" | "email" | "in_app" | "sms" | "webhook")[];
    }>>;
    quietHours: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
        start: z.ZodString;
        end: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        end: string;
        start: string;
    }, {
        enabled: boolean;
        end: string;
        start: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    types: Record<string, {
        enabled: boolean;
        channels: ("push" | "email" | "in_app" | "sms" | "webhook")[];
    }>;
    quietHours?: {
        enabled: boolean;
        end: string;
        start: string;
    } | undefined;
}, {
    userId: string;
    types: Record<string, {
        enabled: boolean;
        channels: ("push" | "email" | "in_app" | "sms" | "webhook")[];
    }>;
    quietHours?: {
        enabled: boolean;
        end: string;
        start: string;
    } | undefined;
}>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export declare const NotificationTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    language: z.ZodString;
    subject: z.ZodOptional<z.ZodString>;
    body: z.ZodString;
    variables: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: string;
    language: string;
    body: string;
    variables: string[];
    subject?: string | undefined;
}, {
    id: string;
    type: string;
    language: string;
    body: string;
    variables: string[];
    subject?: string | undefined;
}>;
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;
//# sourceMappingURL=notification.d.ts.map