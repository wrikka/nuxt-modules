import { z } from "zod"
import { StatusSchema } from "./task"

export const DragEndEventSchema = z.object({
	item: z.any(), // HTMLElement is a complex object, not easily represented in Zod for SSR
	newStatus: StatusSchema,
})

export type DragEndEvent = z.infer<typeof DragEndEventSchema>
