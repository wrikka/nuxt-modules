import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schemas/index.js";
export declare class OrderService {
    private db;
    private core;
    private creation;
    private payment;
    constructor(db: NodePgDatabase<typeof schema>);
    createOrderFromCart(cartId: string, paymentIntentId: string, paymentIntentAmount: number): Promise<{
        taxAmount: string;
        status: "pending" | "cancelled" | "delivered" | "processing" | "shipped";
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subtotal: string;
        total: string;
        customerId: string | null;
        paymentStatus: "pending" | "paid" | "failed" | "refunded";
        shippingCost: string;
        shippingAddress: import("../../db/types.js").DbAddress | null;
        billingAddress: import("../../db/types.js").DbAddress | null;
        paymentMethod: string | null;
        paymentIntentId: string | null;
        discountId: string | null;
    } | undefined>;
    getOrder(orderId: string): Promise<{
        taxAmount: string;
        status: "pending" | "cancelled" | "delivered" | "processing" | "shipped";
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subtotal: string;
        total: string;
        customerId: string | null;
        paymentStatus: "pending" | "paid" | "failed" | "refunded";
        shippingCost: string;
        shippingAddress: import("../../db/types.js").DbAddress | null;
        billingAddress: import("../../db/types.js").DbAddress | null;
        paymentMethod: string | null;
        paymentIntentId: string | null;
        discountId: string | null;
        customer: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            avatar: string | null;
            country: string | null;
            spent: string;
            orderCount: number;
        } | null;
        items: {
            taxAmount: string;
            id: string;
            price: string;
            orderId: string;
            productId: string | null;
            variantId: string | null;
            quantity: number;
        }[];
    } | undefined>;
    getOrdersByCustomer(customerId: string): Promise<{
        taxAmount: string;
        status: "pending" | "cancelled" | "delivered" | "processing" | "shipped";
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subtotal: string;
        total: string;
        customerId: string | null;
        paymentStatus: "pending" | "paid" | "failed" | "refunded";
        shippingCost: string;
        shippingAddress: import("../../db/types.js").DbAddress | null;
        billingAddress: import("../../db/types.js").DbAddress | null;
        paymentMethod: string | null;
        paymentIntentId: string | null;
        discountId: string | null;
        items: {
            taxAmount: string;
            id: string;
            price: string;
            orderId: string;
            productId: string | null;
            variantId: string | null;
            quantity: number;
        }[];
    }[]>;
}
//# sourceMappingURL=index.d.ts.map