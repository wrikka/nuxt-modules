// d:/wshop/server/workflows/engine.ts

import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { workflowExecutions } from "~~/server/db/schemas"

export interface WorkflowTrigger {
	event: string
	data?: Record<string, any>
}

export async function triggerWorkflow(trigger: WorkflowTrigger) {
	try {
		// Find workflows that match the trigger event
		const matchingWorkflows = await db.query.workflows.findMany({
			where: (w, { eq }) => eq(w.enabled, true),
		})

		for (const workflow of matchingWorkflows) {
			if (!workflow.trigger || workflow.trigger.event !== trigger.event) continue

			// Check conditions
			if (workflow.trigger.conditions) {
				const conditionsMet = checkConditions(workflow.trigger.conditions, trigger.data || {})
				if (!conditionsMet) continue
			}

			// Execute workflow
			await executeWorkflow(workflow, trigger.data || {})
		}
	} catch (error) {
		console.error("Error triggering workflow:", error)
	}
}

function checkConditions(conditions: Record<string, any>, data: Record<string, any>): boolean {
	for (const [key, value] of Object.entries(conditions)) {
		if (data[key] !== value) return false
	}
	return true
}

async function executeWorkflow(workflow: any, data: Record<string, any>) {
	const executionId = crypto.randomUUID()

	try {
		// Create execution record
		await db.insert(workflowExecutions).values({
			id: executionId,
			workflowId: workflow.id,
			triggerData: data,
			status: "running",
		})

		// Execute actions
		const results = []
		for (const action of workflow.actions) {
			const result = await executeAction(action, data)
			results.push(result)
		}

		// Update execution record
		await db.update(workflowExecutions)
			.set({ status: "completed", result: results })
			.where(eq(workflowExecutions.id, executionId))
	} catch (error: any) {
		await db.update(workflowExecutions)
			.set({ status: "failed", error: error.message })
			.where(eq(workflowExecutions.id, executionId))
		throw error
	}
}

async function executeAction(action: any, data: Record<string, any>): Promise<any> {
	switch (action.type) {
		case "send_email":
			return await sendEmail(action.config, data)
		case "create_discount":
			return await createDiscount(action.config, data)
		case "add_tag":
			return await addTag(action.config, data)
		default:
			console.warn(`Unknown action type: ${action.type}`)
			return null
	}
}

async function sendEmail(config: any, data: Record<string, any>) {
	// Send email using configured email service
	console.log("Sending email:", config, data)
	return { sent: true }
}

async function createDiscount(config: any, data: Record<string, any>) {
	// Create discount code
	console.log("Creating discount:", config, data)
	return { created: true }
}

async function addTag(config: any, data: Record<string, any>) {
	// Add tag to customer
	console.log("Adding tag:", config, data)
	return { added: true }
}
