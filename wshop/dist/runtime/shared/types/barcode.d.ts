import { z } from "zod";
export declare const BarcodeSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    type: z.ZodEnum<["ean13", "code128", "qr", "upc"]>;
    value: z.ZodString;
    format: z.ZodString;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "ean13" | "code128" | "qr" | "upc";
    createdAt: Date;
    updatedAt: Date;
    value: string;
    isActive: boolean;
    productId: string;
    format: string;
}, {
    id: string;
    type: "ean13" | "code128" | "qr" | "upc";
    createdAt: Date;
    updatedAt: Date;
    value: string;
    isActive: boolean;
    productId: string;
    format: string;
}>;
export type Barcode = z.infer<typeof BarcodeSchema>;
export declare const BarcodeScanSchema: z.ZodObject<{
    id: z.ZodString;
    barcode: z.ZodString;
    productId: z.ZodOptional<z.ZodString>;
    scannedAt: z.ZodDate;
    userId: z.ZodString;
    registerId: z.ZodString;
    success: z.ZodBoolean;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    id: string;
    userId: string;
    barcode: string;
    scannedAt: Date;
    registerId: string;
    error?: string | undefined;
    productId?: string | undefined;
}, {
    success: boolean;
    id: string;
    userId: string;
    barcode: string;
    scannedAt: Date;
    registerId: string;
    error?: string | undefined;
    productId?: string | undefined;
}>;
export type BarcodeScan = z.infer<typeof BarcodeScanSchema>;
export declare const BarcodeSettingsSchema: z.ZodObject<{
    autoGenerate: z.ZodBoolean;
    prefix: z.ZodString;
    length: z.ZodNumber;
    type: z.ZodEnum<["ean13", "code128", "qr", "upc"]>;
    includeChecksum: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    length: number;
    type: "ean13" | "code128" | "qr" | "upc";
    autoGenerate: boolean;
    prefix: string;
    includeChecksum: boolean;
}, {
    length: number;
    type: "ean13" | "code128" | "qr" | "upc";
    autoGenerate: boolean;
    prefix: string;
    includeChecksum: boolean;
}>;
export type BarcodeSettings = z.infer<typeof BarcodeSettingsSchema>;
export declare const BatchBarcodeSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    startNumber: z.ZodNumber;
    endNumber: z.ZodNumber;
    format: z.ZodString;
    generatedAt: z.ZodDate;
    generatedBy: z.ZodString;
    status: z.ZodEnum<["pending", "generated", "printed", "used"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "generated" | "printed" | "used";
    id: string;
    productId: string;
    quantity: number;
    format: string;
    startNumber: number;
    endNumber: number;
    generatedAt: Date;
    generatedBy: string;
}, {
    status: "pending" | "generated" | "printed" | "used";
    id: string;
    productId: string;
    quantity: number;
    format: string;
    startNumber: number;
    endNumber: number;
    generatedAt: Date;
    generatedBy: string;
}>;
export type BatchBarcode = z.infer<typeof BatchBarcodeSchema>;
//# sourceMappingURL=barcode.d.ts.map