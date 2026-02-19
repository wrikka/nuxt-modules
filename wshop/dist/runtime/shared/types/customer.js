import { z } from "zod";
export const CustomerSchema = z.object({
  id: z.string(),
  // Use string for ID consistency
  name: z.string().nullable(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  spent: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional()
});
