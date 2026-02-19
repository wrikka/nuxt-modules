import { z } from "zod";
export declare const POSSessionSchema: z.ZodObject<{
    id: z.ZodNumber;
    sessionId: z.ZodString;
    status: z.ZodEnum<["active", "completed", "voided"]>;
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
    subtotal: z.ZodNumber;
    tax: z.ZodNumber;
    discount: z.ZodNumber;
    total: z.ZodNumber;
    paymentMethod: z.ZodEnum<["cash", "card", "mobile", "store_credit"]>;
    paymentDetails: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    customerId: z.ZodNullable<z.ZodNumber>;
    staffId: z.ZodNumber;
    registerId: z.ZodNumber;
    createdAt: z.ZodString;
    completedAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "completed" | "voided";
    id: number;
    createdAt: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    customerId: number | null;
    paymentMethod: "cash" | "card" | "mobile" | "store_credit";
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
    staffId: number;
    sessionId: string;
    registerId: number;
    completedAt: string | null;
    paymentDetails?: Record<string, any> | undefined;
}, {
    status: "active" | "completed" | "voided";
    id: number;
    createdAt: string;
    subtotal: number;
    total: number;
    discount: number;
    tax: number;
    customerId: number | null;
    paymentMethod: "cash" | "card" | "mobile" | "store_credit";
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
    staffId: number;
    sessionId: string;
    registerId: number;
    completedAt: string | null;
    paymentDetails?: Record<string, any> | undefined;
}>;
export type POSSession = z.infer<typeof POSSessionSchema>;
//# sourceMappingURL=session.d.ts.map