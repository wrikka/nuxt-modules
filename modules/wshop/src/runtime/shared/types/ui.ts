import { z } from "zod"

export const SelectOptionSchema = z.object({
	value: z.union([z.string(), z.number()]),
	label: z.string(),
	disabled: z.boolean().optional(),
})
export type SelectOption = z.infer<typeof SelectOptionSchema>

export const TableColumnSchema = z.object({
	key: z.string(),
	label: z.string(),
	sortable: z.boolean().optional(),
	width: z.string().optional(),
	align: z.enum(["left", "center", "right"]).optional(),
})
export type TableColumn = z.infer<typeof TableColumnSchema>

export const FilterOptionSchema = z.object({
	key: z.string(),
	label: z.string(),
	value: z.unknown(),
})
export type FilterOption = z.infer<typeof FilterOptionSchema>
