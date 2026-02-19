import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schemas/index.js";
import type { DbAddress } from "../../db/types.js";
export declare class OrderServiceCore {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    createOrderFromCart(cartId: string, paymentIntentId: string, paymentIntentAmount: number): Promise<{
        cart: {
            status: "active" | "abandoned" | "converted";
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subtotal: string;
            discountAmount: string;
            customerId: string | null;
            shippingAddress: DbAddress | null;
            discountId: string | null;
            giftCardId: string | null;
            orderId: string | null;
            anonymousId: string | null;
            customerEmail: string | null;
            giftCardAmountApplied: string;
            abandonedAt: Date | null;
            recoveryEmailSentAt: Date | null;
            discount: {
                id: string;
                description: string | null;
                type: "percentage" | "fixed_amount";
                createdAt: Date;
                value: string;
                code: string;
                usageCount: number;
                expiresAt: Date | null;
                minPurchaseAmount: string | null;
                usageLimit: number | null;
                isActive: string;
            } | null;
            giftCard: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                expiresAt: Date | null;
                isActive: "true" | "false";
                initialBalance: string;
                currentBalance: string;
            } | null;
            items: {
                id: string;
                price: string;
                productId: string;
                variantId: string;
                quantity: number;
                cartId: string;
            }[];
        };
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
        };
        shippingCost: number;
        preTaxTotal: number;
        taxAmount: number;
        total: number;
    }>;
}
//# sourceMappingURL=core.d.ts.map