import { z } from "zod"

export const ContextMenuOptionsSchema = z.object({
	x: z.number(),
	y: z.number(),
	options: z.array(z.object({
		label: z.string(),
		action: z.function(), // z.function(z.tuple([]), z.void()) has issues with the linter, using a general function type for now.
	})),
})

export type ContextMenuOptions = z.infer<typeof ContextMenuOptionsSchema>
