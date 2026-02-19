import Stripe from "stripe";
import type { PaymentIntentResult, PaymentProvider } from "./provider.js";
declare class StripePaymentProvider implements PaymentProvider {
    private stripe;
    constructor();
    createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntentResult>;
    getPaymentStatus(paymentIntentId: string): Promise<"succeeded" | "processing" | "requires_payment_method">;
    updatePaymentIntent(paymentIntentId: string, params: Stripe.PaymentIntentUpdateParams): Promise<Stripe.PaymentIntent>;
    cancelPaymentIntent(paymentIntentId: string, reason: Stripe.PaymentIntentCancelParams.CancellationReason): Promise<Stripe.PaymentIntent>;
}
export declare const stripePaymentProvider: StripePaymentProvider;
export {};
//# sourceMappingURL=stripe.d.ts.map