import { and, eq, gte, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { discounts } from "~~/server/db/schemas";
const validateSchema = z.object({
  code: z.string().min(1, "Discount code is required")
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }
  const body = await readBody(event);
  const validation = validateSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request",
      data: validation.error.flatten()
    });
  }
  const { code } = validation.data;
  try {
    const discount = await db.query.discounts.findFirst({
      where: and(
        eq(discounts.code, code.toUpperCase()),
        eq(discounts.isActive, "true"),
        or(
          isNull(discounts.expiresAt),
          gte(discounts.expiresAt, /* @__PURE__ */ new Date())
        ),
        or(
          isNull(discounts.usageLimit),
          lt(discounts.usageCount, discounts.usageLimit)
        )
      )
    });
    if (!discount) {
      throw createError({ statusCode: 404, statusMessage: "Invalid or expired discount code" });
    }
    return {
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: discount.value
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 404) {
      throw error;
    }
    console.error("Error validating discount code:", error);
    throw createError({ statusCode: 500, statusMessage: "Could not validate discount code" });
  }
});
