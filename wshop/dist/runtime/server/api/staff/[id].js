import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, staffAccounts } from "~~/server/db";
const updateStaffSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long").optional(),
  roleId: z.string().optional()
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const staffId = event.context.params?.id;
  if (!staffId) {
    throw createError({ statusCode: 400, statusMessage: "Staff ID is required" });
  }
  if (method === "GET") {
    const staff = await db.query.staffAccounts.findFirst({
      where: eq(staffAccounts.id, staffId),
      columns: { passwordHash: false },
      with: { role: true }
    });
    if (!staff) {
      throw createError({ statusCode: 404, statusMessage: "Staff account not found" });
    }
    return staff;
  }
  if (method === "PUT") {
    const body = await readBody(event);
    const validation = updateStaffSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid data",
        data: validation.error.flatten()
      });
    }
    const { password, ...updateData } = validation.data;
    let passwordHash;
    if (password) {
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(password, saltRounds);
    }
    const finalUpdateData = { ...updateData, ...passwordHash && { passwordHash } };
    const updatedStaff = await db.update(staffAccounts).set(finalUpdateData).where(eq(staffAccounts.id, staffId)).returning({ id: staffAccounts.id, name: staffAccounts.name, email: staffAccounts.email });
    if (updatedStaff.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Staff account not found" });
    }
    return updatedStaff[0];
  }
  if (method === "DELETE") {
    const deletedStaff = await db.delete(staffAccounts).where(eq(staffAccounts.id, staffId)).returning();
    if (deletedStaff.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Staff account not found" });
    }
    return { success: true, message: `Staff account ${staffId} deleted` };
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
