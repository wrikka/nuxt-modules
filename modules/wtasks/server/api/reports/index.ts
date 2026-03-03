import { defineEventHandler, readBody } from "h3"
import type { Report } from "~/shared/types/features"

const mockReports: Report[] = [
	{
		id: "report-1",
		name: "Weekly Summary",
		description: "Tasks completed this week",
		type: "bar",
		dataSource: "tasks",
		filters: { dateRange: "last_7_days" },
		config: { groupBy: "status" },
		createdAt: new Date().toISOString(),
		createdBy: "user-1",
		isScheduled: false,
	},
]

export default defineEventHandler(async (event) => {
	const method = event.node.req.method
	if (method === "GET") return mockReports
	if (method === "POST") {
		const body = await readBody(event)
		const newReport: Report = {
			id: `report-${Date.now()}`,
			...body,
			createdAt: new Date().toISOString(),
			createdBy: "user-1",
		}
		mockReports.push(newReport)
		return newReport
	}
	return mockReports
})
