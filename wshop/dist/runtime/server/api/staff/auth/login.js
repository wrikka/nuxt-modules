import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, staffAccounts } from "~~/server/db";
import { lucia } from "~~/server/utils/auth";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }
  const body = await readBody(event);
  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: validation.error.flatten()
    });
  }
  const { email, password } = validation.data;
  try {
    const staff = await db.query.staffAccounts.findFirst({
      where: eq(staffAccounts.email, email),
      with: {
        role: {
          with: {
            staffRolesToPermissions: {
              with: {
                permission: true
              }
            }
          }
        }
      }
    });
    if (!staff) {
      throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, staff.passwordHash);
    if (!isPasswordValid) {
      throw createError({ statusCode: 401, statusMessage: "Invalid credentials" });
    }
    const session = await lucia.createSession(staff.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    appendHeader(event, "Set-Cookie", sessionCookie.serialize());
    return { success: true };
  } catch (error) {
    if (typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 401) {
      throw error;
    }
    console.error("Login error:", error);
    throw createError({ statusCode: 500, statusMessage: "An internal error occurred" });
  }
});
