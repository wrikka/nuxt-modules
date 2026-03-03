import { z } from "zod"

export const StatSchema = z.object({
	name: z.string(),
	value: z.string(),
	change: z.string(),
	icon: z.string(),
})
export type Stat = z.infer<typeof StatSchema>

export const ActivitySchema = z.object({
	id: z.number(),
	user: z.string(),
	action: z.string(),
	time: z.string(),
})
export type Activity = z.infer<typeof ActivitySchema>
