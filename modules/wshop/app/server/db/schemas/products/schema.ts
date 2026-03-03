import { createInsertSchema } from "drizzle-zod"
import { productImages, products, tags } from "./core"
import { digitalProductFiles, productsToTags } from "./digital"
import { productOptions, productVariants } from "./variants"

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products)
export const insertProductImageSchema = createInsertSchema(productImages)
export const insertProductOptionSchema = createInsertSchema(productOptions)
export const insertProductVariantSchema = createInsertSchema(productVariants)
export const insertTagSchema = createInsertSchema(tags)
export const insertProductsToTagsSchema = createInsertSchema(productsToTags)
export const insertDigitalProductFileSchema = createInsertSchema(digitalProductFiles)

// Types
export type InsertProduct = typeof insertProductSchema.type
export type InsertProductImage = typeof insertProductImageSchema.type
export type InsertProductOption = typeof insertProductOptionSchema.type
export type InsertProductVariant = typeof insertProductVariantSchema.type
export type InsertTag = typeof insertTagSchema.type
export type InsertProductsToTags = typeof insertProductsToTagsSchema.type
export type InsertDigitalProductFile = typeof insertDigitalProductFileSchema.type
