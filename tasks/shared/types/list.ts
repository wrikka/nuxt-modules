import { z } from "zod"

export const ListSchema = z.object({
	id: z.string(),
	icon: z.string(),
	label: z.string(),
})

export type List = z.infer<typeof ListSchema>
