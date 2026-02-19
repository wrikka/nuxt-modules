import { z } from "zod";
export declare const ChatMessageSchema: z.ZodObject<{
    id: z.ZodNumber;
    chatId: z.ZodNumber;
    senderId: z.ZodNumber;
    senderType: z.ZodEnum<["customer", "staff"]>;
    message: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isRead: z.ZodBoolean;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    message: string;
    createdAt: string;
    chatId: number;
    senderId: number;
    senderType: "staff" | "customer";
    isRead: boolean;
    attachments?: string[] | undefined;
}, {
    id: number;
    message: string;
    createdAt: string;
    chatId: number;
    senderId: number;
    senderType: "staff" | "customer";
    isRead: boolean;
    attachments?: string[] | undefined;
}>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export declare const ChatSchema: z.ZodObject<{
    id: z.ZodNumber;
    customerId: z.ZodNumber;
    staffId: z.ZodNullable<z.ZodNumber>;
    subject: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["open", "pending", "closed"]>;
    priority: z.ZodEnum<["low", "medium", "high"]>;
    lastMessage: z.ZodOptional<z.ZodString>;
    lastMessageAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "open" | "closed";
    id: number;
    createdAt: string;
    updatedAt: string;
    customerId: number;
    staffId: number | null;
    priority: "high" | "medium" | "low";
    lastMessageAt: string | null;
    subject?: string | undefined;
    lastMessage?: string | undefined;
}, {
    status: "pending" | "open" | "closed";
    id: number;
    createdAt: string;
    updatedAt: string;
    customerId: number;
    staffId: number | null;
    priority: "high" | "medium" | "low";
    lastMessageAt: string | null;
    subject?: string | undefined;
    lastMessage?: string | undefined;
}>;
export type Chat = z.infer<typeof ChatSchema>;
export declare const ChatNotificationSchema: z.ZodObject<{
    id: z.ZodNumber;
    type: z.ZodEnum<["new_message", "chat_assigned", "chat_closed"]>;
    chatId: z.ZodNumber;
    message: z.ZodString;
    isRead: z.ZodBoolean;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    type: "new_message" | "chat_assigned" | "chat_closed";
    message: string;
    createdAt: string;
    chatId: number;
    isRead: boolean;
}, {
    id: number;
    type: "new_message" | "chat_assigned" | "chat_closed";
    message: string;
    createdAt: string;
    chatId: number;
    isRead: boolean;
}>;
export type ChatNotification = z.infer<typeof ChatNotificationSchema>;
//# sourceMappingURL=chat.d.ts.map