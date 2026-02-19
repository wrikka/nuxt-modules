import { z } from "zod"

export const SupplierSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
	enabled: z.boolean(),
	config: z.record(z.any()).nullable(),
	createdAt: z.date().nullable(),
	updatedAt: z.date().nullable(),
})

export type Supplier = z.infer<typeof SupplierSchema>
