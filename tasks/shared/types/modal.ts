import { z } from "zod"
import { TaskSchema } from "./task"

const CreateTaskModalSchema = z.object({
	name: z.literal("createTask"),
})

const EditTaskModalSchema = z.object({
	name: z.literal("editTask"),
	task: TaskSchema,
})

const DeleteTaskModalSchema = z.object({
	name: z.literal("deleteTask"),
	task: TaskSchema,
	onConfirm: z.function(),
})

export const ModalStateSchema = z.discriminatedUnion("name", [
	CreateTaskModalSchema,
	EditTaskModalSchema,
	DeleteTaskModalSchema,
])

export type ModalState = z.infer<typeof ModalStateSchema>
