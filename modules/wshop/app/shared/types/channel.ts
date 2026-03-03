import { z } from "zod"

export const ChannelConfigSchema = z.object({
	apiKey: z.string().optional(),
	webhookUrl: z.string().optional(),
}).catchall(z.any())

export type ChannelConfig = z.infer<typeof ChannelConfigSchema>

export const ChannelSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string(),
	description: z.string(),
	enabled: z.boolean(),
	config: ChannelConfigSchema.optional(),
})

export type Channel = z.infer<typeof ChannelSchema>
