import { z } from "zod";
export const BarcodeSchema = z.object({
  id: z.string(),
  productId: z.string(),
  type: z.enum(["ean13", "code128", "qr", "upc"]),
  value: z.string(),
  format: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
});
export const BarcodeScanSchema = z.object({
  id: z.string(),
  barcode: z.string(),
  productId: z.string().optional(),
  scannedAt: z.date(),
  userId: z.string(),
  registerId: z.string(),
  success: z.boolean(),
  error: z.string().optional()
});
export const BarcodeSettingsSchema = z.object({
  autoGenerate: z.boolean(),
  prefix: z.string(),
  length: z.number(),
  type: BarcodeSchema.shape.type,
  includeChecksum: z.boolean()
});
export const BatchBarcodeSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  startNumber: z.number(),
  endNumber: z.number(),
  format: z.string(),
  generatedAt: z.date(),
  generatedBy: z.string(),
  status: z.enum(["pending", "generated", "printed", "used"])
});
