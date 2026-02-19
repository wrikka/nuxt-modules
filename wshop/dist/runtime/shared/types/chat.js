import { z } from "zod";
export const ChatMessageSchema = z.object({
  id: z.number(),
  chatId: z.number(),
  senderId: z.number(),
  senderType: z.enum(["customer", "staff"]),
  message: z.string().min(1, "Message is required"),
  attachments: z.array(z.string()).optional(),
  isRead: z.boolean(),
  createdAt: z.string()
});
export const ChatSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  staffId: z.number().nullable(),
  subject: z.string().optional(),
  status: z.enum(["open", "pending", "closed"]),
  priority: z.enum(["low", "medium", "high"]),
  lastMessage: z.string().optional(),
  lastMessageAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const ChatNotificationSchema = z.object({
  id: z.number(),
  type: z.enum(["new_message", "chat_assigned", "chat_closed"]),
  chatId: z.number(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.string()
});
