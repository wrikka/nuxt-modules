import { z } from "zod";
export declare const OrderItemSchema: z.ZodObject<{
    product: z.ZodObject<Pick<{
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
    }, "id" | "name" | "images">, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    }, {
        id: string;
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    }>;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    price: number;
    product: {
        id: string;
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    };
    quantity: number;
}, {
    price: number;
    product: {
        id: string;
        name: string;
        images?: {
            id: string;
            src: string;
            alt: string | null;
        }[] | undefined;
    };
    quantity: number;
}>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    customer: z.ZodObject<{
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
    }>;
    items: z.ZodArray<z.ZodObject<{
        product: z.ZodObject<Pick<{
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
        }, "id" | "name" | "images">, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        }, {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        }>;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price: number;
        product: {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        };
        quantity: number;
    }, {
        price: number;
        product: {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        };
        quantity: number;
    }>, "many">;
    status: z.ZodEnum<["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]>;
    total: z.ZodNumber;
    orderDate: z.ZodString;
    paymentIntentId: z.ZodOptional<z.ZodString>;
    subtotal: z.ZodNumber;
    shippingCost: z.ZodNumber;
    taxAmount: z.ZodNumber;
    paymentStatus: z.ZodEnum<["Pending", "Paid", "Failed", "Refunded"]>;
    shippingAddress: z.ZodObject<{
        id: z.ZodNumber;
        customerId: z.ZodNumber;
        type: z.ZodEnum<["billing", "shipping", "both"]>;
        firstName: z.ZodString;
        lastName: z.ZodString;
        company: z.ZodOptional<z.ZodString>;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    }, {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    taxAmount: number;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    id: string;
    subtotal: number;
    total: number;
    paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
    shippingCost: number;
    shippingAddress: {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    };
    customer: {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    };
    items: {
        price: number;
        product: {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        };
        quantity: number;
    }[];
    orderDate: string;
    paymentIntentId?: string | undefined;
}, {
    taxAmount: number;
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    id: string;
    subtotal: number;
    total: number;
    paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
    shippingCost: number;
    shippingAddress: {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    };
    customer: {
        id: string;
        name: string | null;
        email: string;
        phone?: string | undefined;
        avatar?: string | undefined;
        country?: string | undefined;
        spent?: string | undefined;
    };
    items: {
        price: number;
        product: {
            id: string;
            name: string;
            images?: {
                id: string;
                src: string;
                alt: string | null;
            }[] | undefined;
        };
        quantity: number;
    }[];
    orderDate: string;
    paymentIntentId?: string | undefined;
}>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
//# sourceMappingURL=order.d.ts.map