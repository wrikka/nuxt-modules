import { z } from "zod"

export const ViewSchema = z.enum(["list", "kanban"])
export const GroupBySchema = z.enum(["status", "assignee", "none"])
export const FieldSchema = z.enum(["tags", "assignee", "comments", "subtasks", "date"])

export type View = z.infer<typeof ViewSchema>
export type GroupBy = z.infer<typeof GroupBySchema>
export type Field = z.infer<typeof FieldSchema>
