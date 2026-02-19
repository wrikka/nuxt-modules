export interface PaymentIntentResult {
    clientSecret: string;
    paymentIntentId: string;
}
export interface PaymentProvider {
    /**
     * Creates a payment intent with the payment provider.
     * @param amount The amount to charge, in the smallest currency unit (e.g., cents).
     * @param currency The currency code (e.g., 'usd', 'thb').
     * @param metadata Optional metadata to associate with the payment.
     */
    createPaymentIntent(amount: number, currency: string, metadata?: Record<string, string | number | boolean | null>): Promise<PaymentIntentResult>;
    /**
     * Retrieves the status of a payment intent.
     * @param paymentIntentId The ID of the payment intent to check.
     */
    getPaymentStatus(paymentIntentId: string): Promise<"succeeded" | "processing" | "requires_payment_method">;
}
//# sourceMappingURL=provider.d.ts.map