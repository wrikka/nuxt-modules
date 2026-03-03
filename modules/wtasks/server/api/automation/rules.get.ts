import { defineEventHandler, readBody } from "h3"
import type { AutomationRule } from "~/shared/types/features"

const mockRules: AutomationRule[] = [
	{
		id: "rule-1",
		name: "Notify on task completion",
		enabled: true,
		trigger: {
			type: "status_change",
			conditions: [{ field: "status", operator: "equals", value: "Done" }],
		},
		actions: [{ type: "send_notification", config: { message: "Task completed!" } }],
	},
]

export default defineEventHandler(async (event) => {
	const method = event.node.req.method

	if (method === "GET") {
		return mockRules
	}

	if (method === "POST") {
		const body = await readBody(event)
		const newRule: AutomationRule = {
			id: `rule-${Date.now()}`,
			...body,
		}
		mockRules.push(newRule)
		return newRule
	}

	return mockRules
})
