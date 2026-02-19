import { z } from "zod";
export declare const CartItemSchema: z.ZodObject<{
    id: z.ZodString;
    cartId: z.ZodString;
    productId: z.ZodString;
    variantId: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodString;
    product: z.ZodOptional<z.ZodObject<Pick<{
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
    }, "name" | "images">, "strip", z.ZodTypeAny, {
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    }, {
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    }>>;
    variant: z.ZodOptional<z.ZodObject<Pick<{
        id: z.ZodString;
        sku: z.ZodNullable<z.ZodString>;
        price: z.ZodString;
        stock: z.ZodNumber;
        options: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>;
        imageId: z.ZodNullable<z.ZodString>;
    }, "options">, "strip", z.ZodTypeAny, {
        options: Record<string, string> | null;
    }, {
        options: Record<string, string> | null;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    price: string;
    productId: string;
    variantId: string;
    quantity: number;
    cartId: string;
    product?: {
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    } | undefined;
    variant?: {
        options: Record<string, string> | null;
    } | undefined;
}, {
    id: string;
    price: string;
    productId: string;
    variantId: string;
    quantity: number;
    cartId: string;
    product?: {
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    } | undefined;
    variant?: {
        options: Record<string, string> | null;
    } | undefined;
}>;
export type CartItem = z.infer<typeof CartItemSchema>;
export declare const GiftCardSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    currentBalance: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    code: string;
    currentBalance: string;
}, {
    id: string;
    code: string;
    currentBalance: string;
}>;
export type GiftCard = z.infer<typeof GiftCardSchema>;
export declare const CartSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["active", "abandoned", "converted"]>;
    subtotal: z.ZodString;
    discountAmount: z.ZodString;
    giftCardAmountApplied: z.ZodString;
    itemCount: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        cartId: z.ZodString;
        productId: z.ZodString;
        variantId: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodString;
        product: z.ZodOptional<z.ZodObject<Pick<{
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
        }, "name" | "images">, "strip", z.ZodTypeAny, {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        }, {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        }>>;
        variant: z.ZodOptional<z.ZodObject<Pick<{
            id: z.ZodString;
            sku: z.ZodNullable<z.ZodString>;
            price: z.ZodString;
            stock: z.ZodNumber;
            options: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>;
            imageId: z.ZodNullable<z.ZodString>;
        }, "options">, "strip", z.ZodTypeAny, {
            options: Record<string, string> | null;
        }, {
            options: Record<string, string> | null;
        }>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        price: string;
        productId: string;
        variantId: string;
        quantity: number;
        cartId: string;
        product?: {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        } | undefined;
        variant?: {
            options: Record<string, string> | null;
        } | undefined;
    }, {
        id: string;
        price: string;
        productId: string;
        variantId: string;
        quantity: number;
        cartId: string;
        product?: {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        } | undefined;
        variant?: {
            options: Record<string, string> | null;
        } | undefined;
    }>, "many">;
    discount: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        type: z.ZodEnum<["percentage", "fixed_amount"]>;
        value: z.ZodString;
        usageLimit: z.ZodNullable<z.ZodNumber>;
        usageCount: z.ZodNumber;
        isActive: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        description: string | null;
        type: "percentage" | "fixed_amount";
        createdAt: string;
        updatedAt: string;
        value: string;
        code: string;
        usageCount: number;
        usageLimit: number | null;
        isActive: boolean;
    }, {
        id: string;
        description: string | null;
        type: "percentage" | "fixed_amount";
        createdAt: string;
        updatedAt: string;
        value: string;
        code: string;
        usageCount: number;
        usageLimit: number | null;
        isActive: boolean;
    }>>;
    giftCard: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        currentBalance: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        code: string;
        currentBalance: string;
    }, {
        id: string;
        code: string;
        currentBalance: string;
    }>>;
    customer: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodNullable<z.ZodString>;
        email: z.ZodString;
        avatar: z.ZodOptional<z.ZodString>;
        spent: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    }, {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "abandoned" | "converted";
    id: string;
    createdAt: string;
    updatedAt: string;
    subtotal: string;
    discount: {
        id: string;
        description: string | null;
        type: "percentage" | "fixed_amount";
        createdAt: string;
        updatedAt: string;
        value: string;
        code: string;
        usageCount: number;
        usageLimit: number | null;
        isActive: boolean;
    } | null;
    discountAmount: string;
    giftCard: {
        id: string;
        code: string;
        currentBalance: string;
    } | null;
    customer: {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    } | null;
    items: {
        id: string;
        price: string;
        productId: string;
        variantId: string;
        quantity: number;
        cartId: string;
        product?: {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        } | undefined;
        variant?: {
            options: Record<string, string> | null;
        } | undefined;
    }[];
    giftCardAmountApplied: string;
    itemCount: number;
}, {
    status: "active" | "abandoned" | "converted";
    id: string;
    createdAt: string;
    updatedAt: string;
    subtotal: string;
    discount: {
        id: string;
        description: string | null;
        type: "percentage" | "fixed_amount";
        createdAt: string;
        updatedAt: string;
        value: string;
        code: string;
        usageCount: number;
        usageLimit: number | null;
        isActive: boolean;
    } | null;
    discountAmount: string;
    giftCard: {
        id: string;
        code: string;
        currentBalance: string;
    } | null;
    customer: {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    } | null;
    items: {
        id: string;
        price: string;
        productId: string;
        variantId: string;
        quantity: number;
        cartId: string;
        product?: {
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        } | undefined;
        variant?: {
            options: Record<string, string> | null;
        } | undefined;
    }[];
    giftCardAmountApplied: string;
    itemCount: number;
}>;
export type Cart = z.infer<typeof CartSchema>;
//# sourceMappingURL=cart.d.ts.map