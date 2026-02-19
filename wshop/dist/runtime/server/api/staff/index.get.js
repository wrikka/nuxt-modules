import { db } from "~~/server/db";
export default defineEventHandler(async (_event) => {
  try {
    const allStaff = await db.query.staffAccounts.findMany({
      columns: { passwordHash: false },
      // Exclude password hash
      with: { role: true }
    });
    return allStaff;
  } catch (error) {
    console.error("Error fetching staff accounts:", error);
    throw createError({ statusCode: 500, statusMessage: "Failed to fetch staff accounts" });
  }
});
