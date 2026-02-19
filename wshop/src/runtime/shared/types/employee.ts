import { z } from "zod"

export const PermissionSchema = z.object({
	id: z.string(),
	name: z.string(),
	resource: z.string(),
	action: z.enum(["create", "read", "update", "delete", "admin"]),
	description: z.string(),
})
export type Permission = z.infer<typeof PermissionSchema>

export const EmployeeRoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	permissions: z.array(PermissionSchema),
	level: z.number(),
})
export type EmployeeRole = z.infer<typeof EmployeeRoleSchema>

export const EmployeeSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string().email(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	role: EmployeeRoleSchema,
	permissions: z.array(PermissionSchema),
	stores: z.array(z.string()),
	isActive: z.boolean(),
	lastLogin: z.date().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type Employee = z.infer<typeof EmployeeSchema>

export const EmployeeShiftSchema = z.object({
	id: z.string(),
	employeeId: z.string(),
	storeId: z.string(),
	registerId: z.string(),
	startTime: z.date(),
	endTime: z.date().optional(),
	status: z.enum(["active", "ended", "break"]),
	openingBalance: z.number(),
	closingBalance: z.number().optional(),
	cashSales: z.number(),
	cardSales: z.number(),
	otherSales: z.number(),
	totalSales: z.number(),
	notes: z.string().optional(),
})
export type EmployeeShift = z.infer<typeof EmployeeShiftSchema>

export const EmployeePerformanceSchema = z.object({
	id: z.string(),
	employeeId: z.string(),
	period: z.string(),
	totalSales: z.number(),
	totalTransactions: z.number(),
	averageTransaction: z.number(),
	itemsSold: z.number(),
	refunds: z.number(),
	customerSatisfaction: z.number(),
	upsells: z.number(),
	createdAt: z.date(),
})
export type EmployeePerformance = z.infer<typeof EmployeePerformanceSchema>
