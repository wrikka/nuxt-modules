import { z } from "zod";
export const ProductImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string().nullable()
});
export const OptionValueSchema = z.object({
  id: z.string(),
  label: z.string(),
  // e.g., 'Red', 'Large'
  value: z.string(),
  // e.g., '#FF0000', 'L'
  priceModifier: z.number().optional()
  // e.g., 5 for +$5.00
});
export const CustomizationOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  // e.g., 'Color', 'Size', 'Engraving'
  type: z.enum(["dropdown", "swatch", "text", "radio"]),
  values: z.array(OptionValueSchema)
});
export const CustomizationOptionSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  options: z.array(CustomizationOptionSchema)
});
export const ProductOptionValueSchema = z.object({
  label: z.string(),
  value: z.string()
});
export const ProductOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  values: z.array(ProductOptionValueSchema),
  displayType: z.enum(["dropdown", "swatch", "button"]).optional()
});
export const ProductVariantSchema = z.object({
  id: z.string(),
  sku: z.string().nullable(),
  price: z.string(),
  // Drizzle returns decimals as strings
  stock: z.number(),
  options: z.record(z.string()).nullable(),
  imageId: z.string().nullable()
});
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  handle: z.string(),
  price: z.string(),
  // Drizzle returns decimals as strings
  status: z.enum(["active", "draft", "archived"]),
  type: z.enum(["physical", "digital"]).default("physical"),
  categoryId: z.number().optional(),
  productSeoTitle: z.string().nullable().optional(),
  productSeoDescription: z.string().nullable().optional(),
  productSeoKeywords: z.string().nullable().optional(),
  images: z.array(ProductImageSchema).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  options: z.array(ProductOptionSchema).optional(),
  digitalFiles: z.array(z.any()).optional()
});
