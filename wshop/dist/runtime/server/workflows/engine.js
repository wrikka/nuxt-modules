import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { workflowExecutions } from "~~/server/db/schemas";
export async function triggerWorkflow(trigger) {
  try {
    const matchingWorkflows = await db.query.workflows.findMany({
      where: (w, { eq: eq2 }) => eq2(w.enabled, true)
    });
    for (const workflow of matchingWorkflows) {
      if (!workflow.trigger || workflow.trigger.event !== trigger.event) continue;
      if (workflow.trigger.conditions) {
        const conditionsMet = checkConditions(workflow.trigger.conditions, trigger.data || {});
        if (!conditionsMet) continue;
      }
      await executeWorkflow(workflow, trigger.data || {});
    }
  } catch (error) {
    console.error("Error triggering workflow:", error);
  }
}
function checkConditions(conditions, data) {
  for (const [key, value] of Object.entries(conditions)) {
    if (data[key] !== value) return false;
  }
  return true;
}
async function executeWorkflow(workflow, data) {
  const executionId = crypto.randomUUID();
  try {
    await db.insert(workflowExecutions).values({
      id: executionId,
      workflowId: workflow.id,
      triggerData: data,
      status: "running"
    });
    const results = [];
    for (const action of workflow.actions) {
      const result = await executeAction(action, data);
      results.push(result);
    }
    await db.update(workflowExecutions).set({ status: "completed", result: results }).where(eq(workflowExecutions.id, executionId));
  } catch (error) {
    await db.update(workflowExecutions).set({ status: "failed", error: error.message }).where(eq(workflowExecutions.id, executionId));
    throw error;
  }
}
async function executeAction(action, data) {
  switch (action.type) {
    case "send_email":
      return await sendEmail(action.config, data);
    case "create_discount":
      return await createDiscount(action.config, data);
    case "add_tag":
      return await addTag(action.config, data);
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return null;
  }
}
async function sendEmail(config, data) {
  console.log("Sending email:", config, data);
  return { sent: true };
}
async function createDiscount(config, data) {
  console.log("Creating discount:", config, data);
  return { created: true };
}
async function addTag(config, data) {
  console.log("Adding tag:", config, data);
  return { added: true };
}
