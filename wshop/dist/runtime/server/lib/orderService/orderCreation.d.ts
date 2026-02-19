import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schemas/index.js";
import type { DbAddress } from "../../db/types.js";
export declare class OrderCreationService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    createOrderRecord(cartId: string, customerId: string, email: string, shippingAddress: DbAddress, preTaxTotal: number, taxAmount: number, total: number, paymentIntentId: string): Promise<{
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
        shippingAddress: DbAddress | null;
        billingAddress: DbAddress | null;
        paymentMethod: string | null;
        paymentIntentId: string | null;
        discountId: string | null;
    } | undefined>;
    updateCartStatus(cartId: string): Promise<void>;
}
//# sourceMappingURL=orderCreation.d.ts.map