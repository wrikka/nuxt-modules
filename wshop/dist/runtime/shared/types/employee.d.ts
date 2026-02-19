import { z } from "zod";
export declare const PermissionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    resource: z.ZodString;
    action: z.ZodEnum<["create", "read", "update", "delete", "admin"]>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    action: "delete" | "create" | "read" | "update" | "admin";
    resource: string;
}, {
    id: string;
    name: string;
    description: string;
    action: "delete" | "create" | "read" | "update" | "admin";
    resource: string;
}>;
export type Permission = z.infer<typeof PermissionSchema>;
export declare const EmployeeRoleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    permissions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        resource: z.ZodString;
        action: z.ZodEnum<["create", "read", "update", "delete", "admin"]>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }, {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }>, "many">;
    level: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    level: number;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
}, {
    id: string;
    name: string;
    description: string;
    level: number;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
}>;
export type EmployeeRole = z.infer<typeof EmployeeRoleSchema>;
export declare const EmployeeSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
    role: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        permissions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            resource: z.ZodString;
            action: z.ZodEnum<["create", "read", "update", "delete", "admin"]>;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }, {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }>, "many">;
        level: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        level: number;
        permissions: {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }[];
    }, {
        id: string;
        name: string;
        description: string;
        level: number;
        permissions: {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }[];
    }>;
    permissions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        resource: z.ZodString;
        action: z.ZodEnum<["create", "read", "update", "delete", "admin"]>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }, {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }>, "many">;
    stores: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
    lastLogin: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    role: {
        id: string;
        name: string;
        description: string;
        level: number;
        permissions: {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }[];
    };
    isActive: boolean;
    phone: string;
    firstName: string;
    lastName: string;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
    username: string;
    stores: string[];
    lastLogin?: Date | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    role: {
        id: string;
        name: string;
        description: string;
        level: number;
        permissions: {
            id: string;
            name: string;
            description: string;
            action: "delete" | "create" | "read" | "update" | "admin";
            resource: string;
        }[];
    };
    isActive: boolean;
    phone: string;
    firstName: string;
    lastName: string;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
    username: string;
    stores: string[];
    lastLogin?: Date | undefined;
}>;
export type Employee = z.infer<typeof EmployeeSchema>;
export declare const EmployeeShiftSchema: z.ZodObject<{
    id: z.ZodString;
    employeeId: z.ZodString;
    storeId: z.ZodString;
    registerId: z.ZodString;
    startTime: z.ZodDate;
    endTime: z.ZodOptional<z.ZodDate>;
    status: z.ZodEnum<["active", "ended", "break"]>;
    openingBalance: z.ZodNumber;
    closingBalance: z.ZodOptional<z.ZodNumber>;
    cashSales: z.ZodNumber;
    cardSales: z.ZodNumber;
    otherSales: z.ZodNumber;
    totalSales: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "ended" | "break";
    id: string;
    cashSales: number;
    cardSales: number;
    registerId: string;
    employeeId: string;
    storeId: string;
    startTime: Date;
    openingBalance: number;
    otherSales: number;
    totalSales: number;
    endTime?: Date | undefined;
    closingBalance?: number | undefined;
    notes?: string | undefined;
}, {
    status: "active" | "ended" | "break";
    id: string;
    cashSales: number;
    cardSales: number;
    registerId: string;
    employeeId: string;
    storeId: string;
    startTime: Date;
    openingBalance: number;
    otherSales: number;
    totalSales: number;
    endTime?: Date | undefined;
    closingBalance?: number | undefined;
    notes?: string | undefined;
}>;
export type EmployeeShift = z.infer<typeof EmployeeShiftSchema>;
export declare const EmployeePerformanceSchema: z.ZodObject<{
    id: z.ZodString;
    employeeId: z.ZodString;
    period: z.ZodString;
    totalSales: z.ZodNumber;
    totalTransactions: z.ZodNumber;
    averageTransaction: z.ZodNumber;
    itemsSold: z.ZodNumber;
    refunds: z.ZodNumber;
    customerSatisfaction: z.ZodNumber;
    upsells: z.ZodNumber;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    period: string;
    createdAt: Date;
    employeeId: string;
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    itemsSold: number;
    refunds: number;
    customerSatisfaction: number;
    upsells: number;
}, {
    id: string;
    period: string;
    createdAt: Date;
    employeeId: string;
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
    itemsSold: number;
    refunds: number;
    customerSatisfaction: number;
    upsells: number;
}>;
export type EmployeePerformance = z.infer<typeof EmployeePerformanceSchema>;
//# sourceMappingURL=employee.d.ts.map