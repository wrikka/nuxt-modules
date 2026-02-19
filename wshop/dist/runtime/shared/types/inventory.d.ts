import { z } from "zod";
export declare const InventorySchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    reservedQuantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    reorderLevel: z.ZodNumber;
    maxLevel: z.ZodNumber;
    location: z.ZodOptional<z.ZodString>;
    lastUpdated: z.ZodString;
    updatedBy: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    productId: string;
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
    maxLevel: number;
    lastUpdated: string;
    availableQuantity: number;
    updatedBy: number;
    location?: string | undefined;
}, {
    id: string;
    productId: string;
    quantity: number;
    reservedQuantity: number;
    reorderLevel: number;
    maxLevel: number;
    lastUpdated: string;
    availableQuantity: number;
    updatedBy: number;
    location?: string | undefined;
}>;
export type Inventory = z.infer<typeof InventorySchema>;
export declare const InventoryLogSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    variantId: z.ZodOptional<z.ZodString>;
    change: z.ZodNumber;
    newQuantity: z.ZodNumber;
    reason: z.ZodEnum<["sale", "return", "adjustment", "transfer", "initial"]>;
    source: z.ZodString;
    timestamp: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    reason: "transfer" | "sale" | "adjustment" | "return" | "initial";
    productId: string;
    change: number;
    newQuantity: number;
    source: string;
    timestamp: Date;
    variantId?: string | undefined;
}, {
    id: string;
    reason: "transfer" | "sale" | "adjustment" | "return" | "initial";
    productId: string;
    change: number;
    newQuantity: number;
    source: string;
    timestamp: Date;
    variantId?: string | undefined;
}>;
export type InventoryLog = z.infer<typeof InventoryLogSchema>;
//# sourceMappingURL=inventory.d.ts.map