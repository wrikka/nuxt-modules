import { z } from "zod";
import { PermissionSchema } from "./employee.js";
export const UserSchema = z.object({
  id: z.number(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "manager", "staff", "customer"]),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
  lastLogin: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema)
});
