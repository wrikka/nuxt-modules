import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { customerSegmentRules, customerSegments } from "~~/server/db/schemas";
const segmentRuleSchema = z.object({
  field: z.string(),
  operator: z.enum(["gte", "lte", "eq", "neq"]),
  value: z.union([z.string(), z.number()])
});
const updateSegmentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  rules: z.array(segmentRuleSchema).min(1).optional()
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const segmentId = event.context.params?.id;
  if (!segmentId) {
    throw createError({ statusCode: 400, statusMessage: "Segment ID is required" });
  }
  if (method === "GET") {
    const segment = await db.query.customerSegments.findFirst({
      where: eq(customerSegments.id, segmentId),
      with: { rules: true }
    });
    if (!segment) {
      throw createError({ statusCode: 404, statusMessage: "Segment not found" });
    }
    return segment;
  }
  if (method === "PUT") {
    const body = await readBody(event);
    const validation = updateSegmentSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid data",
        data: validation.error.flatten()
      });
    }
    const { name, description, rules } = validation.data;
    const updatedSegment = await db.transaction(async (tx) => {
      if (name || description) {
        await tx.update(customerSegments).set({ name, description }).where(
          eq(customerSegments.id, segmentId)
        );
      }
      if (rules) {
        await tx.delete(customerSegmentRules).where(eq(customerSegmentRules.segmentId, segmentId));
        const rulesToInsert = rules.map((rule) => ({
          segmentId,
          field: rule.field,
          operator: rule.operator,
          value: String(rule.value)
        }));
        await tx.insert(customerSegmentRules).values(rulesToInsert);
      }
      return tx.query.customerSegments.findFirst({
        where: eq(customerSegments.id, segmentId),
        with: { rules: true }
      });
    });
    return { success: true, segment: updatedSegment };
  }
  if (method === "DELETE") {
    await db.delete(customerSegments).where(eq(customerSegments.id, segmentId));
    return { success: true, message: `Segment ${segmentId} deleted` };
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
