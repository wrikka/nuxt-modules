import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schemas/index.js";
export declare class OrderPaymentService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    processGiftCardPayment(cartId: string, giftCardAmount: number): Promise<void>;
    validatePaymentAmount(paymentIntentAmount: number, expectedAmount: number): Promise<void>;
}
//# sourceMappingURL=payment.d.ts.map