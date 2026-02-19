import { relations } from "drizzle-orm";
import { productImages, products, tags } from "./core.js";
import { digitalProductFiles, productsToTags } from "./digital.js";
import { productOptions, productVariants } from "./variants.js";
export const productsRelations = relations(products, ({ many }) => ({
  images: many(productImages),
  options: many(productOptions),
  variants: many(productVariants),
  digitalFiles: many(digitalProductFiles),
  productsToTags: many(productsToTags)
}));
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));
export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id]
  })
}));
export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id]
  }),
  image: one(productImages, {
    fields: [productVariants.imageId],
    references: [productImages.id]
  })
}));
export const tagsRelations = relations(tags, ({ many }) => ({
  productsToTags: many(productsToTags)
}));
export const productsToTagsRelations = relations(productsToTags, ({ one }) => ({
  product: one(products, {
    fields: [productsToTags.productId],
    references: [products.id]
  }),
  tag: one(tags, {
    fields: [productsToTags.tagId],
    references: [tags.id]
  })
}));
export const digitalProductFilesRelations = relations(digitalProductFiles, ({ one }) => ({
  product: one(products, {
    fields: [digitalProductFiles.productId],
    references: [products.id]
  })
}));
