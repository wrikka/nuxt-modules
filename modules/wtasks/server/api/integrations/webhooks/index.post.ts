import { defineEventHandler, readBody } from "h3"
import { z } from "zod"

const WebhookSchema = z.object({
	provider: z.enum(["slack", "discord"]),
	name: z.string(),
	url: z.string().url(),
	events: z.array(z.string()),
	isActive: z.boolean(),
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const validated = WebhookSchema.parse(body)

	// TODO: Store in database
	return {
		id: crypto.randomUUID(),
		...validated,
		createdAt: new Date().toISOString(),
	}
})
