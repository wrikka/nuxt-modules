import { z } from "zod"

export const ViewSchema = z.enum(["list", "kanban", "calendar", "timeline", "table"])
export const GroupBySchema = z.enum(["status", "assignee", "priority", "dueDate", "none"])
export const FieldSchema = z.enum([
    "tags",
    "assignee",
    "comments",
    "subtasks",
    "date",
    "dueDate",
    "priority",
    "timeTracking",
    "dependencies",
    "customFields",
])

export type View = z.infer<typeof ViewSchema>
export type GroupBy = z.infer<typeof GroupBySchema>
export type Field = z.infer<typeof FieldSchema>
