import { z } from "zod";
export const POSRegisterSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Register name is required"),
  location: z.string(),
  cashDrawerBalance: z.number(),
  status: z.enum(["open", "closed", "maintenance"]),
  currentStaffId: z.number().nullable(),
  openedAt: z.string().nullable(),
  closedAt: z.string().nullable()
});
export const StaffSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string()
});
