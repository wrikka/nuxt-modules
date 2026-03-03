import { z } from "zod"

export const NotificationChannelSchema = z.object({
	type: z.enum(["in_app", "email", "sms", "push", "webhook"]),
	enabled: z.boolean(),
	config: z.record(z.unknown()).optional(),
})
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>

export const NotificationTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
	category: z.enum(["stock", "order", "promotion", "system", "customer", "employee"]),
	template: z.string(),
	enabled: z.boolean(),
	channels: z.array(NotificationChannelSchema),
})
export type NotificationType = z.infer<typeof NotificationTypeSchema>

export const NotificationSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: NotificationTypeSchema,
	title: z.string(),
	message: z.string(),
	data: z.record(z.unknown()).optional(),
	isRead: z.boolean(),
	priority: z.enum(["low", "medium", "high", "urgent"]),
	actionUrl: z.string().optional(),
	expiresAt: z.date().optional(),
	createdAt: z.date(),
	readAt: z.date().optional(),
})
export type Notification = z.infer<typeof NotificationSchema>

export const NotificationSettingsSchema = z.object({
	userId: z.string(),
	types: z.record(
		z.string(),
		z.object({
			enabled: z.boolean(),
			channels: z.array(NotificationChannelSchema.shape.type),
		}),
	),
	quietHours: z.object({
		enabled: z.boolean(),
		start: z.string(),
		end: z.string(),
	}).optional(),
})
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>

export const NotificationTemplateSchema = z.object({
	id: z.string(),
	type: z.string(),
	language: z.string(),
	subject: z.string().optional(),
	body: z.string(),
	variables: z.array(z.string()),
})
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>
