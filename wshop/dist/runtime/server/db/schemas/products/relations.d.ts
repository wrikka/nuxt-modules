export declare const productsRelations: import("drizzle-orm").Relations<"products", {
    images: import("drizzle-orm").Many<"product_images">;
    options: import("drizzle-orm").Many<"product_options">;
    variants: import("drizzle-orm").Many<"product_variants">;
    digitalFiles: import("drizzle-orm").Many<"digital_product_files">;
    productsToTags: import("drizzle-orm").Many<"products_to_tags">;
}>;
export declare const productImagesRelations: import("drizzle-orm").Relations<"product_images", {
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const productOptionsRelations: import("drizzle-orm").Relations<"product_options", {
    product: import("drizzle-orm").One<"products", true>;
}>;
export declare const productVariantsRelations: import("drizzle-orm").Relations<"product_variants", {
    product: import("drizzle-orm").One<"products", true>;
    image: import("drizzle-orm").One<"product_images", false>;
}>;
export declare const tagsRelations: import("drizzle-orm").Relations<"tags", {
    productsToTags: import("drizzle-orm").Many<"products_to_tags">;
}>;
export declare const productsToTagsRelations: import("drizzle-orm").Relations<"products_to_tags", {
    product: import("drizzle-orm").One<"products", true>;
    tag: import("drizzle-orm").One<"tags", true>;
}>;
export declare const digitalProductFilesRelations: import("drizzle-orm").Relations<"digital_product_files", {
    product: import("drizzle-orm").One<"products", true>;
}>;
//# sourceMappingURL=relations.d.ts.map