import { z } from "zod";
export declare const UserSchema: z.ZodObject<{
    id: z.ZodNumber;
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["admin", "manager", "staff", "customer"]>;
    permissions: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
    lastLogin: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: string;
    updatedAt: string;
    email: string;
    role: "staff" | "customer" | "admin" | "manager";
    isActive: boolean;
    firstName: string;
    lastName: string;
    permissions: string[];
    username: string;
    lastLogin: string | null;
    password: string;
    phone?: string | undefined;
    avatar?: string | undefined;
}, {
    id: number;
    createdAt: string;
    updatedAt: string;
    email: string;
    role: "staff" | "customer" | "admin" | "manager";
    isActive: boolean;
    firstName: string;
    lastName: string;
    permissions: string[];
    username: string;
    lastLogin: string | null;
    password: string;
    phone?: string | undefined;
    avatar?: string | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const RoleSchema: z.ZodObject<{
    id: z.ZodNumber;
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
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    description: string;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
}, {
    id: number;
    name: string;
    description: string;
    permissions: {
        id: string;
        name: string;
        description: string;
        action: "delete" | "create" | "read" | "update" | "admin";
        resource: string;
    }[];
}>;
export type Role = z.infer<typeof RoleSchema>;
//# sourceMappingURL=user.d.ts.map