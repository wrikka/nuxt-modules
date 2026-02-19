import bcrypt from "bcrypt";
import { z } from "zod";
import { db, staffAccounts } from "~~/server/db";
const createStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  roleId: z.string().optional()
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = createStaffSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: validation.error.flatten()
    });
  }
  const { name, email, password, roleId } = validation.data;
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newStaff = await db.insert(staffAccounts).values({ name, email, passwordHash, roleId }).returning({ id: staffAccounts.id, name: staffAccounts.name, email: staffAccounts.email });
    return newStaff[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    if (errorMessage.includes("duplicate key value violates unique constraint")) {
      throw createError({
        statusCode: 409,
        statusMessage: "A staff account with this email already exists."
      });
    }
    console.error("Error creating staff account:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to create staff account" });
  }
});
