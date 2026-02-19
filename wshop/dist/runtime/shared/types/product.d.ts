import { z } from "zod";
export declare const ProductImageSchema: z.ZodObject<{
    id: z.ZodString;
    src: z.ZodString;
    alt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    src: string;
    alt: string | null;
}, {
    id: string;
    src: string;
    alt: string | null;
}>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export declare const OptionValueSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    value: z.ZodString;
    priceModifier: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    value: string;
    label: string;
    priceModifier?: number | undefined;
}, {
    id: string;
    value: string;
    label: string;
    priceModifier?: number | undefined;
}>;
export type OptionValue = z.infer<typeof OptionValueSchema>;
export declare const CustomizationOptionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["dropdown", "swatch", "text", "radio"]>;
    values: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        value: z.ZodString;
        priceModifier: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        value: string;
        label: string;
        priceModifier?: number | undefined;
    }, {
        id: string;
        value: string;
        label: string;
        priceModifier?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    values: {
        id: string;
        value: string;
        label: string;
        priceModifier?: number | undefined;
    }[];
    id: string;
    name: string;
    type: "dropdown" | "swatch" | "text" | "radio";
}, {
    values: {
        id: string;
        value: string;
        label: string;
        priceModifier?: number | undefined;
    }[];
    id: string;
    name: string;
    type: "dropdown" | "swatch" | "text" | "radio";
}>;
export type CustomizationOption = z.infer<typeof CustomizationOptionSchema>;
export declare const CustomizationOptionSetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["dropdown", "swatch", "text", "radio"]>;
        values: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            value: z.ZodString;
            priceModifier: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }, {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        values: {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }[];
        id: string;
        name: string;
        type: "dropdown" | "swatch" | "text" | "radio";
    }, {
        values: {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }[];
        id: string;
        name: string;
        type: "dropdown" | "swatch" | "text" | "radio";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    options: {
        values: {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }[];
        id: string;
        name: string;
        type: "dropdown" | "swatch" | "text" | "radio";
    }[];
}, {
    id: string;
    name: string;
    options: {
        values: {
            id: string;
            value: string;
            label: string;
            priceModifier?: number | undefined;
        }[];
        id: string;
        name: string;
        type: "dropdown" | "swatch" | "text" | "radio";
    }[];
}>;
export type CustomizationOptionSet = z.infer<typeof CustomizationOptionSetSchema>;
export declare const ProductOptionValueSchema: z.ZodObject<{
    label: z.ZodString;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    label: string;
}, {
    value: string;
    label: string;
}>;
export type ProductOptionValue = z.infer<typeof ProductOptionValueSchema>;
export declare const ProductOptionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    values: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">;
    displayType: z.ZodOptional<z.ZodEnum<["dropdown", "swatch", "button"]>>;
}, "strip", z.ZodTypeAny, {
    values: {
        value: string;
        label: string;
    }[];
    id: string;
    name: string;
    displayType?: "dropdown" | "swatch" | "button" | undefined;
}, {
    values: {
        value: string;
        label: string;
    }[];
    id: string;
    name: string;
    displayType?: "dropdown" | "swatch" | "button" | undefined;
}>;
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export declare const ProductVariantSchema: z.ZodObject<{
    id: z.ZodString;
    sku: z.ZodNullable<z.ZodString>;
    price: z.ZodString;
    stock: z.ZodNumber;
    options: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>;
    imageId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    options: Record<string, string> | null;
    price: string;
    stock: number;
    sku: string | null;
    imageId: string | null;
}, {
    id: string;
    options: Record<string, string> | null;
    price: string;
    stock: number;
    sku: string | null;
    imageId: string | null;
}>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    handle: z.ZodString;
    price: z.ZodString;
    status: z.ZodEnum<["active", "draft", "archived"]>;
    type: z.ZodDefault<z.ZodEnum<["physical", "digital"]>>;
    categoryId: z.ZodOptional<z.ZodNumber>;
    productSeoTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    productSeoDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    productSeoKeywords: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        src: z.ZodString;
        alt: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        src: string;
        alt: string | null;
    }, {
        id: string;
        src: string;
        alt: string | null;
    }>, "many">>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sku: z.ZodNullable<z.ZodString>;
        price: z.ZodString;
        stock: z.ZodNumber;
        options: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>;
        imageId: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        options: Record<string, string> | null;
        price: string;
        stock: number;
        sku: string | null;
        imageId: string | null;
    }, {
        id: string;
        options: Record<string, string> | null;
        price: string;
        stock: number;
        sku: string | null;
        imageId: string | null;
    }>, "many">>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        values: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">;
        displayType: z.ZodOptional<z.ZodEnum<["dropdown", "swatch", "button"]>>;
    }, "strip", z.ZodTypeAny, {
        values: {
            value: string;
            label: string;
        }[];
        id: string;
        name: string;
        displayType?: "dropdown" | "swatch" | "button" | undefined;
    }, {
        values: {
            value: string;
            label: string;
        }[];
        id: string;
        name: string;
        displayType?: "dropdown" | "swatch" | "button" | undefined;
    }>, "many">>;
    digitalFiles: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "active" | "archived";
    id: string;
    name: string;
    description: string | null;
    type: "physical" | "digital";
    price: string;
    handle: string;
    options?: {
        values: {
            value: string;
            label: string;
        }[];
        id: string;
        name: string;
        displayType?: "dropdown" | "swatch" | "button" | undefined;
    }[] | undefined;
    images?: {
        id: string;
        src: string;
        alt: string | null;
    }[] | undefined;
    variants?: {
        id: string;
        options: Record<string, string> | null;
        price: string;
        stock: number;
        sku: string | null;
        imageId: string | null;
    }[] | undefined;
    digitalFiles?: any[] | undefined;
    categoryId?: number | undefined;
    productSeoTitle?: string | null | undefined;
    productSeoDescription?: string | null | undefined;
    productSeoKeywords?: string | null | undefined;
}, {
    status: "draft" | "active" | "archived";
    id: string;
    name: string;
    description: string | null;
    price: string;
    handle: string;
    type?: "physical" | "digital" | undefined;
    options?: {
        values: {
            value: string;
            label: string;
        }[];
        id: string;
        name: string;
        displayType?: "dropdown" | "swatch" | "button" | undefined;
    }[] | undefined;
    images?: {
        id: string;
        src: string;
        alt: string | null;
    }[] | undefined;
    variants?: {
        id: string;
        options: Record<string, string> | null;
        price: string;
        stock: number;
        sku: string | null;
        imageId: string | null;
    }[] | undefined;
    digitalFiles?: any[] | undefined;
    categoryId?: number | undefined;
    productSeoTitle?: string | null | undefined;
    productSeoDescription?: string | null | undefined;
    productSeoKeywords?: string | null | undefined;
}>;
export type Product = z.infer<typeof ProductSchema>;
//# sourceMappingURL=product.d.ts.map