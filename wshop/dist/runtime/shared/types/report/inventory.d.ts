import { z } from "zod";
export declare const LowStockItemSchema: z.ZodObject<{
    productId: z.ZodNumber;
    productName: z.ZodString;
    currentStock: z.ZodNumber;
    minStock: z.ZodNumber;
    reorderPoint: z.ZodNumber;
    lastRestocked: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: number;
    productName: string;
    currentStock: number;
    minStock: number;
    reorderPoint: number;
    lastRestocked: string;
}, {
    productId: number;
    productName: string;
    currentStock: number;
    minStock: number;
    reorderPoint: number;
    lastRestocked: string;
}>;
export type LowStockItem = z.infer<typeof LowStockItemSchema>;
export declare const StockMovementSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodNumber;
    productName: z.ZodString;
    type: z.ZodEnum<["in", "out", "adjustment"]>;
    quantity: z.ZodNumber;
    reason: z.ZodString;
    timestamp: z.ZodString;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "in" | "out" | "adjustment";
    reason: string;
    userId: string;
    productId: number;
    quantity: number;
    timestamp: string;
    productName: string;
}, {
    id: string;
    type: "in" | "out" | "adjustment";
    reason: string;
    userId: string;
    productId: number;
    quantity: number;
    timestamp: string;
    productName: string;
}>;
export type StockMovement = z.infer<typeof StockMovementSchema>;
export declare const InventoryReportSchema: z.ZodObject<{
    totalProducts: z.ZodNumber;
    totalValue: z.ZodNumber;
    lowStockItems: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        productName: z.ZodString;
        currentStock: z.ZodNumber;
        minStock: z.ZodNumber;
        reorderPoint: z.ZodNumber;
        lastRestocked: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        productId: number;
        productName: string;
        currentStock: number;
        minStock: number;
        reorderPoint: number;
        lastRestocked: string;
    }, {
        productId: number;
        productName: string;
        currentStock: number;
        minStock: number;
        reorderPoint: number;
        lastRestocked: string;
    }>, "many">;
    recentMovements: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodNumber;
        productName: z.ZodString;
        type: z.ZodEnum<["in", "out", "adjustment"]>;
        quantity: z.ZodNumber;
        reason: z.ZodString;
        timestamp: z.ZodString;
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "in" | "out" | "adjustment";
        reason: string;
        userId: string;
        productId: number;
        quantity: number;
        timestamp: string;
        productName: string;
    }, {
        id: string;
        type: "in" | "out" | "adjustment";
        reason: string;
        userId: string;
        productId: number;
        quantity: number;
        timestamp: string;
        productName: string;
    }>, "many">;
    categories: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        productCount: z.ZodNumber;
        totalValue: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        totalValue: number;
        productCount: number;
    }, {
        name: string;
        totalValue: number;
        productCount: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    categories: {
        name: string;
        totalValue: number;
        productCount: number;
    }[];
    totalProducts: number;
    totalValue: number;
    lowStockItems: {
        productId: number;
        productName: string;
        currentStock: number;
        minStock: number;
        reorderPoint: number;
        lastRestocked: string;
    }[];
    recentMovements: {
        id: string;
        type: "in" | "out" | "adjustment";
        reason: string;
        userId: string;
        productId: number;
        quantity: number;
        timestamp: string;
        productName: string;
    }[];
}, {
    categories: {
        name: string;
        totalValue: number;
        productCount: number;
    }[];
    totalProducts: number;
    totalValue: number;
    lowStockItems: {
        productId: number;
        productName: string;
        currentStock: number;
        minStock: number;
        reorderPoint: number;
        lastRestocked: string;
    }[];
    recentMovements: {
        id: string;
        type: "in" | "out" | "adjustment";
        reason: string;
        userId: string;
        productId: number;
        quantity: number;
        timestamp: string;
        productName: string;
    }[];
}>;
export type InventoryReport = z.infer<typeof InventoryReportSchema>;
//# sourceMappingURL=inventory.d.ts.map